const nodemailer = require('nodemailer');
const db = require('./data/db');
const { getEmailContent } = require('./templates');
require('dotenv').config();

// SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.maillb.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  pool: true,
  maxConnections: 3,
  maxMessages: 100
});

// Bağlantı testi
async function verifyConnection() {
  try {
    await transporter.verify();
    return { success: true, message: 'SMTP Sunucu bağlantısı doğrulandı.' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Test e-postası gönderme
async function sendTestEmail(toEmail) {
  try {
    const dummyLead = {
      name: 'Sayın Yetkili',
      sector: 'klinik',
      email: toEmail
    };
    const { subject, bodyHtml, bodyText } = getEmailContent(dummyLead);

    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'Volreon AI | Okan Arı'}" <${process.env.SMTP_USER}>`,
      replyTo: process.env.REPLY_TO || process.env.SMTP_USER,
      to: toEmail,
      subject: `[TEST] ${subject}`,
      text: bodyText,
      html: bodyHtml
    });

    db.addLog('SUCCESS', `Test e-postası başarıyla gönderildi: ${toEmail}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    db.addLog('ERROR', `Test e-postası gönderilemedi: ${err.message}`);
    return { success: false, error: err.message };
  }
}

// Tek bir lead'e soğuk e-posta gönderimi
async function sendColdEmail(lead) {
  if (!lead || !lead.email) {
    return { success: false, error: 'Geçersiz lead veya e-posta yok' };
  }

  try {
    const { subject, bodyHtml, bodyText } = getEmailContent(lead);

    db.addLog('MAILER', `E-posta gönderiliyor: ${lead.email} (${lead.name} - ${lead.sector})`);

    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'Volreon AI | Okan Arı'}" <${process.env.SMTP_USER}>`,
      replyTo: process.env.REPLY_TO || process.env.SMTP_USER,
      to: lead.email,
      subject: subject,
      text: bodyText,
      html: bodyHtml
    });

    db.updateLeadStatus(lead.id, 'GONDERILDI');
    db.addLog('SUCCESS', `E-posta BAŞARIYLA iletildi: ${lead.email} [${lead.name}]`);
    return { success: true, messageId: info.messageId };

  } catch (err) {
    db.updateLeadStatus(lead.id, 'BASARISIZ', err.message);
    db.addLog('ERROR', `Gönderim hatası (${lead.email}): ${err.message}`);
    return { success: false, error: err.message };
  }
}

// Otomasyon döngüsü yöneticisi
let mailerInterval = null;
let countdownSeconds = 60;

// Rate limit / cooldown yönetimi
let inCooldown = false;
let cooldownTimer = null;
const COOLDOWN_DURATION_MS = 15 * 60 * 1000; // 15 dakika
const RATE_LIMIT_KEYWORDS = [
  'rate limit', 'too many', 'throttl', '451', '421', '450',
  'temporarily', 'try later', 'short amount of time', 'exceeded'
];

function isRateLimitError(errMsg) {
  if (!errMsg) return false;
  const lower = errMsg.toLowerCase();
  return RATE_LIMIT_KEYWORDS.some(kw => lower.includes(kw));
}

function startCooldown(emitEvent, reason) {
  if (inCooldown) return;
  inCooldown = true;

  const cooldownMins = Math.round(COOLDOWN_DURATION_MS / 60000);
  db.addLog('SYSTEM', `⏸️ RATE LİMİT TESPİT EDİLDİ: ${reason} — ${cooldownMins} dakika dinlenme başladı.`);
  emitEvent('data_updated', db.getDashboardData());

  // Cooldown bitince otomatik devam
  cooldownTimer = setTimeout(() => {
    inCooldown = false;
    cooldownTimer = null;
    db.addLog('SYSTEM', '▶️ Cooldown bitti — Gönderim otomatik olarak devam ediyor.');
    emitEvent('data_updated', db.getDashboardData());
  }, COOLDOWN_DURATION_MS);
}

function startMailerLoop(emitEvent = () => {}) {
  if (mailerInterval) clearInterval(mailerInterval);

  const interval = parseInt(process.env.SEND_INTERVAL || '60');
  countdownSeconds = interval;

  // Her saniye çalışan timer (Dashboard geri sayımı ve gönderim tetikleyicisi)
  mailerInterval = setInterval(async () => {
    const { settings } = db.readDb();

    // Durduruldu veya cooldown modunda ise sayma
    if (!settings.isActive || inCooldown) {
      // Cooldown durumunu dashboard'a bildir
      if (inCooldown) {
        const remaining = cooldownTimer ? Math.round(COOLDOWN_DURATION_MS / 60000) : 0;
        emitEvent('countdown', { seconds: -1, total: interval, cooldown: true });
      }
      return;
    }

    countdownSeconds--;
    emitEvent('countdown', { seconds: countdownSeconds, total: settings.sendInterval || interval });

    if (countdownSeconds <= 0) {
      countdownSeconds = settings.sendInterval || interval;

      const nextLead = db.getNextPendingLead();
      if (nextLead) {
        const result = await sendColdEmail(nextLead);
        // Rate limit kontrolü
        if (!result.success && isRateLimitError(result.error)) {
          startCooldown(emitEvent, result.error);
        }
        emitEvent('data_updated', db.getDashboardData());
      } else {
        db.addLog('SYSTEM', 'Kuyrukta bekleyen e-posta kalmadı. Scraper veri çekmeye devam ediyor...');
        emitEvent('data_updated', db.getDashboardData());
      }
    }
  }, 1000);
}

function stopMailerLoop() {
  if (mailerInterval) {
    clearInterval(mailerInterval);
    mailerInterval = null;
  }
  if (cooldownTimer) {
    clearTimeout(cooldownTimer);
    cooldownTimer = null;
    inCooldown = false;
  }
}

module.exports = {
  transporter,
  verifyConnection,
  sendTestEmail,
  sendColdEmail,
  startMailerLoop,
  stopMailerLoop,
  startCooldown,
  isRateLimitError
};
