const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'leads.json');

// Başlangıç şeması
const defaultData = {
  settings: {
    isActive: true,
    sendInterval: 45,
    autoScrape: true,
    targetSectors: ['klinik', 'otel', 'restoran'],
    targetCities: ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Muğla']
  },
  stats: {
    totalScraped: 0,
    totalFound: 0,
    totalSent: 0,
    totalFailed: 0
  },
  leads: [],
  logs: []
};

// Veritabanını oku
function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('DB okuma hatası:', err);
    return defaultData;
  }
}

// Veritabanını atomik yaz
function writeDb(data) {
  try {
    const tempPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, DB_PATH);
  } catch (err) {
    console.error('DB yazma hatası:', err);
  }
}

// Lead ekle (Mükerrer kontrolü ile)
function addLead(lead) {
  const db = readDb();
  
  // E-posta veya web sitesi ile mükerrer kontrolü
  const normalizedEmail = (lead.email || '').toLowerCase().trim();
  const exists = db.leads.some(l => 
    (l.email && l.email.toLowerCase().trim() === normalizedEmail) ||
    (lead.website && l.website && l.website.toLowerCase().replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '') === lead.website.toLowerCase().replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, ''))
  );

  if (exists) {
    return { success: false, reason: 'DUPLICATE' };
  }

  const newLead = {
    id: 'ld_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    name: lead.name || 'İşletme Yetkilisi',
    sector: lead.sector || 'genel',
    email: normalizedEmail,
    phone: lead.phone || '',
    website: lead.website || '',
    city: lead.city || '',
    source: lead.source || 'Google Web Tarayıcı',
    status: 'BEKLEMEDE', // BEKLEMEDE, GONDERILDI, BASARISIZ
    createdAt: new Date().toISOString(),
    sentAt: null,
    error: null
  };

  db.leads.unshift(newLead);
  db.stats.totalFound += 1;
  writeDb(db);
  return { success: true, lead: newLead };
}

// Gönderilecek sıradaki lead'i getir
function getNextPendingLead() {
  const db = readDb();
  return db.leads.find(l => l.status === 'BEKLEMEDE');
}

// Lead durumunu güncelle
function updateLeadStatus(id, status, error = null) {
  const db = readDb();
  const lead = db.leads.find(l => l.id === id);
  if (lead) {
    lead.status = status;
    if (status === 'GONDERILDI') {
      lead.sentAt = new Date().toISOString();
      db.stats.totalSent += 1;
    } else if (status === 'BASARISIZ') {
      lead.error = error;
      db.stats.totalFailed += 1;
    }
    writeDb(db);
    return lead;
  }
  return null;
}

// Log ekle
function addLog(type, message) {
  const db = readDb();
  const log = {
    id: Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toLocaleTimeString('tr-TR'),
    type: type, // 'SCRAPER', 'MAILER', 'SYSTEM', 'SUCCESS', 'ERROR'
    message: message
  };
  db.logs.unshift(log);
  if (db.logs.length > 200) {
    db.logs = db.logs.slice(0, 200);
  }
  writeDb(db);
  return log;
}

// Ayarları güncelle
function updateSettings(newSettings) {
  const db = readDb();
  db.settings = { ...db.settings, ...newSettings };
  writeDb(db);
  return db.settings;
}

// Toplu istatistik ve son durum
function getDashboardData() {
  const db = readDb();
  return {
    settings: db.settings,
    stats: {
      totalScraped: db.stats.totalScraped,
      totalFound: db.stats.totalFound,
      totalSent: db.stats.totalSent,
      totalFailed: db.stats.totalFailed,
      pendingCount: db.leads.filter(l => l.status === 'BEKLEMEDE').length
    },
    leads: db.leads.slice(0, 100),
    logs: db.logs.slice(0, 50)
  };
}

// İstatistik artır
function incrementScraped(count = 1) {
  const db = readDb();
  db.stats.totalScraped += count;
  writeDb(db);
}

module.exports = {
  readDb,
  writeDb,
  addLead,
  getNextPendingLead,
  updateLeadStatus,
  addLog,
  updateSettings,
  getDashboardData,
  incrementScraped
};
