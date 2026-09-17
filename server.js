const express = require('express');
const path = require('path');
const db = require('./data/db');
const mailer = require('./mailer');
const scraper = require('./scraper');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SSE (Server-Sent Events) istemcileri listesi
let sseClients = [];

function emitSSE(eventType, data) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.res.write(payload);
    } catch (_) {}
  });
}

// SSE Uç Noktası
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  // İlk bağlantıda mevcut verileri gönder
  res.write(`event: initial_data\ndata: ${JSON.stringify(db.getDashboardData())}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// Dashboard Verisi
app.get('/api/dashboard', (req, res) => {
  res.json(db.getDashboardData());
});

// Başlat / Durdur
app.post('/api/toggle', (req, res) => {
  const current = db.readDb().settings.isActive;
  const updated = db.updateSettings({ isActive: !current });
  db.addLog('SYSTEM', updated.isActive ? 'Otomasyon sistemi BAŞLATILDI.' : 'Otomasyon sistemi DURDURULDU.');
  emitSSE('data_updated', db.getDashboardData());
  res.json({ success: true, isActive: updated.isActive });
});

// Ayarları Güncelle
app.post('/api/settings', (req, res) => {
  const { sendInterval } = req.body;
  if (sendInterval && Number(sendInterval) >= 10) {
    db.updateSettings({ sendInterval: Number(sendInterval) });
    db.addLog('SYSTEM', `Gönderim aralığı ${sendInterval} saniye olarak güncellendi.`);
    emitSSE('data_updated', db.getDashboardData());
    return res.json({ success: true, sendInterval: Number(sendInterval) });
  }
  res.status(400).json({ error: 'Geçersiz parametre' });
});

// Test E-postası Gönder
app.post('/api/test-email', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Geçerli bir e-posta giriniz.' });
  }

  const result = await mailer.sendTestEmail(email);
  emitSSE('data_updated', db.getDashboardData());
  res.json(result);
});

const { CATEGORIES, CITIES } = require('./categories');

// Kategori ve Şehir Listesi API'si
app.get('/api/categories', (req, res) => {
  res.json({ categories: CATEGORIES, cities: CITIES });
});

// Kategori ve Şehir Odaklı Otomatik Tarama Başlat (Anahtar kelime sormaz)
app.post('/api/trigger-search', async (req, res) => {
  const { category, city } = req.body;
  if (!category || !city) {
    return res.status(400).json({ error: 'Kategori ve şehir seçilmelidir.' });
  }

  // Arka planda çalıştır
  scraper.runCategorySearch(category, city).then(() => {
    emitSSE('data_updated', db.getDashboardData());
  });

  res.json({ success: true, message: `${CATEGORIES[category]?.name || category} (${city}) için tarama başlatıldı.` });
});

// Belirli bir Lead'in Mail Şablonunu Önizle
app.get('/api/preview/:id', (req, res) => {
  const { id } = req.params;
  const dbData = db.readDb();
  const lead = dbData.leads.find(l => l.id === id);
  if (!lead) return res.status(404).json({ error: 'Lead bulunamadı' });

  const { subject, bodyHtml, bodyText } = require('./templates').getEmailContent(lead);
  res.json({ subject, bodyHtml, bodyText, lead });
});

// Belirli bir Lead'e Anında Gönderim Yap
app.post('/api/send-now/:id', async (req, res) => {
  const { id } = req.params;
  const dbData = db.readDb();
  const lead = dbData.leads.find(l => l.id === id);

  if (!lead) {
    return res.status(404).json({ error: 'Lead bulunamadı' });
  }

  const result = await mailer.sendColdEmail(lead);
  emitSSE('data_updated', db.getDashboardData());
  res.json(result);
});

// Lead Sil
app.delete('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const data = db.readDb();
  data.leads = data.leads.filter(l => l.id !== id);
  db.writeDb(data);
  emitSSE('data_updated', db.getDashboardData());
  res.json({ success: true });
});

// Sunucuyu başlat
app.listen(PORT, async () => {
  console.log(`\n🚀 Volreon Soğuk Data & Outreach Paneli çalışıyor: http://localhost:${PORT}\n`);
  
  // SMTP Doğrulama
  const smtpStatus = await mailer.verifyConnection();
  if (smtpStatus.success) {
    db.addLog('SYSTEM', `SMTP Sunucu bağlantısı doğrulandı: ${process.env.SMTP_USER}`);
  } else {
    db.addLog('ERROR', `SMTP Bağlantı hatası: ${smtpStatus.error}`);
  }

  // Gönderim ve Scraper döngülerini başlat
  mailer.startMailerLoop(emitSSE);
  scraper.startScraperLoop();

  // Her 10 saniyede bir genel veri güncelleme sinyali
  setInterval(() => {
    emitSSE('data_updated', db.getDashboardData());
  }, 10000);
});
