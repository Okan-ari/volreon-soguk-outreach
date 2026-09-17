const puppeteer = require('puppeteer-core');
const puppeteerFull = (() => { try { return require('puppeteer'); } catch(_) { return null; } })();
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./data/db');
const { CATEGORIES, CITIES } = require('./categories');

// Chrome path: Railway (Linux) veya macOS local
const CHROME_PATHS = [
  process.env.CHROME_PATH,                                           // Railway env var
  '/usr/bin/google-chrome-stable',                                   // Railway/Linux
  '/usr/bin/google-chrome',                                          // Linux alt
  '/usr/bin/chromium-browser',                                       // Chromium
  '/usr/bin/chromium',                                               // Chromium alt
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'   // macOS
].filter(Boolean);

const fs_native = require('fs');
function getChromePath() {
  // puppeteer tam paket varsa onun Chrome'unu kullan
  if (puppeteerFull) {
    try {
      const ep = puppeteerFull.executablePath();
      if (ep && fs_native.existsSync(ep)) return ep;
    } catch(_) {}
  }
  // Mevcut path'leri dene
  for (const p of CHROME_PATHS) {
    if (p && fs_native.existsSync(p)) return p;
  }
  return null;
}

// Rastgele User-Agent
const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Filtrelenecek kamu, dizin ve genel platformlar
const IGNORED_DOMAINS = [
  'google.', 'bing.', 'yahoo.', 'yandex.', 'youtube.', 'facebook.', 'instagram.',
  'linkedin.', 'twitter.', 'x.com', 'wikipedia.', 'tripadvisor.', 'booking.',
  'sahibinden.', 'trendyol.', 'armut.', '.gov.tr', '.edu.tr', '.bel.tr', '.pol.tr'
];

// E-posta doğrulama
function isValidBusinessEmail(email) {
  if (!email || typeof email !== 'string') return false;
  email = email.toLowerCase().trim();
  
  if (email.length < 6 || email.length > 80) return false;
  if (!email.includes('@') || !email.includes('.')) return false;

  const blacklistExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.js', '.css', '.ico'];
  if (blacklistExtensions.some(ext => email.endsWith(ext))) return false;

  const blacklistWords = [
    'sentry', 'wixpress', 'example', 'domain.com', 'test@', 'noreply', 'no-reply',
    'support@wix', 'wordpress', 'cloudflare', 'abuse@', 'postmaster', 'mailer-daemon'
  ];
  if (blacklistWords.some(w => email.includes(w))) return false;

  return true;
}

// Web sitesine girip e-posta ve telefon ayıklama
async function extractContactFromWebsite(targetUrl, givenName, sector, city) {
  try {
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    db.addLog('SCRAPER', `İşletme web sitesi taranıyor: ${givenName} -> ${cleanUrl}`);

    const res = await axios.get(cleanUrl, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9'
      },
      timeout: 9000,
      maxRedirects: 3
    });

    const html = res.data;
    if (typeof html !== 'string') return null;

    const $ = cheerio.load(html);

    // E-posta ve telefon ayıklama
    const foundEmails = new Set();

    // 1. mailto: linkleri
    $('a[href^="mailto:"]').each((_, el) => {
      const mail = $(el).attr('href').replace('mailto:', '').split('?')[0].trim();
      if (isValidBusinessEmail(mail)) foundEmails.add(mail.toLowerCase());
    });

    // 2. Metin içi Regex
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = html.match(emailRegex) || [];
    for (const m of matches) {
      if (isValidBusinessEmail(m)) foundEmails.add(m.toLowerCase());
    }

    // Telefon
    let phone = '';
    $('a[href^="tel:"]').each((_, el) => {
      if (!phone) {
        phone = $(el).attr('href').replace('tel:', '').trim();
      }
    });

    // Ana sayfada e-posta yoksa /iletisim veya /contact sayfasına bak
    if (foundEmails.size === 0) {
      const contactLinks = [];
      $('a').each((_, el) => {
        const href = $(el).attr('href') || '';
        const text = $(el).text().toLowerCase();
        if (text.includes('iletişim') || text.includes('iletisim') || text.includes('contact') || href.includes('iletisim') || href.includes('contact')) {
          contactLinks.push(href);
        }
      });

      if (contactLinks.length > 0) {
        let contactUrl = contactLinks[0];
        if (!contactUrl.startsWith('http')) {
          try {
            contactUrl = new URL(contactUrl, cleanUrl).href;
          } catch (_) {}
        }

        if (contactUrl.startsWith('http')) {
          try {
            const cRes = await axios.get(contactUrl, {
              headers: { 'User-Agent': getRandomUserAgent() },
              timeout: 6000
            });
            const cMatches = (cRes.data || '').toString().match(emailRegex) || [];
            for (const cm of cMatches) {
              if (isValidBusinessEmail(cm)) foundEmails.add(cm.toLowerCase());
            }
          } catch (_) {}
        }
      }
    }

    const emailList = Array.from(foundEmails);
    if (emailList.length === 0) return null;

    // En kurumsal e-postayı seç
    let selectedEmail = emailList[0];
    const priorityPrefixes = ['info@', 'iletisim@', 'rezervasyon@', 'randevu@', 'ofis@', 'contact@', 'muhasebe@'];
    for (const pref of priorityPrefixes) {
      const match = emailList.find(e => e.startsWith(pref));
      if (match) {
        selectedEmail = match;
        break;
      }
    }

    const lead = {
      name: givenName || 'İşletme Yetkilisi',
      sector: sector,
      city: city,
      email: selectedEmail,
      phone: phone,
      website: cleanUrl,
      source: 'Google Haritalar & Açık Web'
    };

    const added = db.addLead(lead);
    if (added.success) {
      db.addLog('SUCCESS', `🎯 GERÇEK LEAD: ${lead.name} -> ${lead.email} [${lead.sector} / ${city}]`);
      return added.lead;
    } else {
      db.addLog('SYSTEM', `Mükerrer işletme atlandı: ${lead.email}`);
    }

    return null;

  } catch (err) {
    return null;
  }
}

// Google Haritalar Açık İşletme Tarayıcısı (Sıfır API, Headless Chrome)
async function scrapeGoogleMaps(query, sector, city) {
  db.addLog('SCRAPER', `📍 Google Haritalar taranıyor: "${query}" (${city})`);
  let browser = null;

  try {
    const chromePath = getChromePath();
    if (!chromePath) {
      db.addLog('ERROR', 'Chrome/Chromium bulunamadı. Scraper çalıştırılamıyor.');
      return;
    }

    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled', '--lang=tr-TR']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent(getRandomUserAgent());

    // Gereksiz kaynakları engelle (hız için)
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'font', 'media', 'stylesheet'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}?hl=tr`;
    await page.goto(mapsUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Sayfanın render olması için bekle
    await new Promise(r => setTimeout(r, 4000));
    // Sonuç panelinin yüklenmesini bekle ve kaydırarak daha fazla sonuç yükle
    try {
      await page.waitForSelector('div[role="feed"]', { timeout: 15000 });
      await page.evaluate(async () => {
        const feed = document.querySelector('div[role="feed"]');
        if (feed) {
          for (let i = 0; i < 2; i++) {
            feed.scrollTop = feed.scrollHeight;
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
        }
      });
    } catch (e) {
      db.addLog('SYSTEM', `Google Maps feed yüklenemedi veya sonuç bulunamadı: ${query}`);
    }

    // İşletmeleri ayıkla (gelişmiş seçiciler)
    const places = await page.evaluate(() => {
      const list = [];
      const items = document.querySelectorAll('div[role="feed"] > div > div[jsaction], div[role="article"]');
      items.forEach(item => {
        const titleEl = item.querySelector('div.fontHeadlineSmall') || item.querySelector('a[aria-label]') || item.querySelector('.qBF1Pd');
        const name = titleEl ? (titleEl.innerText || titleEl.getAttribute('aria-label')) : '';

        // Web sitesi butonu
        let website = '';
        const webEl = item.querySelector('a[data-value="Web sitesi"]') || 
                      item.querySelector('a[aria-label*="Web sitesi"]') ||
                      item.querySelector('a[data-tooltip*="Web sitesi"]') ||
                      item.querySelector('a.lcr4fd') ||
                      item.querySelector('a[href^="http"]:not([href*="google."])');
        if (webEl) {
          website = webEl.getAttribute('href');
        }

        if (name && name.length > 2 && website) {
          const cleanName = name.split('\n')[0].trim();
          if (!list.some(p => p.name === cleanName)) {
            list.push({ name: cleanName, website });
          }
        }
      });
      return list;
    });

    if (browser) {
      await browser.close();
      browser = null;
    }

    db.incrementScraped(places.length);
    db.addLog('SCRAPER', `"${query}" aramasında ${places.length} web sitesi olan gerçek işletme tespit edildi.`);

    // Tespit edilen her işletmenin web sitesini tara
    for (const place of places) {
      const isIgnored = IGNORED_DOMAINS.some(d => place.website.includes(d));
      if (!isIgnored) {
        await extractContactFromWebsite(place.website, place.name, sector, city);
        await new Promise(r => setTimeout(r, 1200));
      }
    }

  } catch (err) {
    if (browser) {
      try {
        await browser.close();
      } catch (e) {}
    }
    db.addLog('ERROR', `Google Haritalar tarama hatası: ${err.message}`);
  }
}

// Kullanıcı Sektör ve Şehir Seçtiğinde Tetiklenen Fonksiyon
async function runCategorySearch(categoryKey, city = 'İstanbul') {
  const cat = CATEGORIES[categoryKey];
  if (!cat) {
    db.addLog('ERROR', `Geçersiz kategori: ${categoryKey}`);
    return;
  }

  db.addLog('SYSTEM', `🚀 [${cat.name}] / [${city}] için Google Haritalar taraması başlatıldı.`);

  const queries = cat.queries(city);
  for (const query of queries) {
    await scrapeGoogleMaps(query, categoryKey, city);
    await new Promise(r => setTimeout(r, 2000));
  }
}

// Otomatik Döngü: 20 Kategori ve Şehirleri Sırayla Gezer
const categoryKeys = Object.keys(CATEGORIES);
let currentCatIndex = 0;
let currentCityIndex = 0;
let scraperRunning = false;
let scraperTimer = null;

async function runScraperCycle() {
  if (scraperRunning) return;
  const { settings } = db.readDb();
  if (!settings.isActive) return;

  scraperRunning = true;
  try {
    const catKey = categoryKeys[currentCatIndex];
    const city = CITIES[currentCityIndex];

    currentCatIndex = (currentCatIndex + 1) % categoryKeys.length;
    if (currentCatIndex === 0) {
      currentCityIndex = (currentCityIndex + 1) % CITIES.length;
    }

    const cat = CATEGORIES[catKey];
    const queries = cat.queries(city);
    const selectedQuery = queries[0];

    await scrapeGoogleMaps(selectedQuery, catKey, city);
  } catch (err) {
    db.addLog('ERROR', `Döngü hatası: ${err.message}`);
  } finally {
    scraperRunning = false;
  }
}

function startScraperLoop() {
  if (scraperTimer) clearInterval(scraperTimer);
  runScraperCycle();
  scraperTimer = setInterval(runScraperCycle, 45000);
}

function stopScraperLoop() {
  if (scraperTimer) {
    clearInterval(scraperTimer);
    scraperTimer = null;
  }
}

module.exports = {
  startScraperLoop,
  stopScraperLoop,
  runCategorySearch,
  extractContactFromWebsite
};
