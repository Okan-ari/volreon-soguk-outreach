// Volreon Soğuk Outreach Dashboard Client
let currentData = {
  settings: { isActive: true, sendInterval: 45 },
  stats: { totalScraped: 0, totalFound: 0, totalSent: 0, totalFailed: 0, pendingCount: 0 },
  leads: [],
  logs: []
};

let currentFilter = 'all';
let searchQuery = '';

// SSE Bağlantısı
function initSSE() {
  const evtSource = new EventSource('/api/events');

  evtSource.addEventListener('initial_data', (e) => {
    currentData = JSON.parse(e.data);
    renderDashboard();
  });

  evtSource.addEventListener('data_updated', (e) => {
    currentData = JSON.parse(e.data);
    renderDashboard();
  });

  evtSource.addEventListener('countdown', (e) => {
    const { seconds, total } = JSON.parse(e.data);
    updateCountdownUI(seconds, total);
  });

  evtSource.onerror = (err) => {
    console.warn('SSE bağlantısı koptu, yeniden bağlanılıyor...', err);
  };
}

// Geri Sayım UI Güncellemesi
function updateCountdownUI(seconds, total) {
  const timerVal = document.getElementById('timerVal');
  const timerFill = document.getElementById('timerFill');
  if (timerVal) {
    timerVal.innerText = `${Math.max(0, seconds)}s`;
  }
  if (timerFill && total > 0) {
    const percent = Math.max(0, Math.min(100, (seconds / total) * 100));
    timerFill.style.width = `${percent}%`;
  }
}

// Tüm Dashboard'u Render Et
function renderDashboard() {
  renderHeaderStatus();
  renderStats();
  renderLogs();
  renderLeadsTable();
}

// Header ve Durum Butonu
function renderHeaderStatus() {
  const badge = document.getElementById('systemStatusBadge');
  const statusText = document.getElementById('statusText');
  const btnToggleIcon = document.getElementById('btnToggleIcon');
  const btnToggleText = document.getElementById('btnToggleText');
  const countdownContainer = document.getElementById('countdownContainer');

  const isActive = currentData.settings?.isActive;

  if (isActive) {
    badge.className = 'status-badge active';
    statusText.innerText = 'CANLI / AKTİF';
    btnToggleIcon.innerText = '⏸';
    btnToggleText.innerText = 'Durdur';
    countdownContainer.style.opacity = '1';
  } else {
    badge.className = 'status-badge paused';
    statusText.innerText = 'DURDURULDU';
    btnToggleIcon.innerText = '▶';
    btnToggleText.innerText = 'Başlat';
    countdownContainer.style.opacity = '0.4';
  }
}

// İstatistik Sayaçları
function renderStats() {
  const s = currentData.stats || {};
  document.getElementById('statScraped').innerText = (s.totalScraped || 0).toLocaleString();
  document.getElementById('statFound').innerText = (s.totalFound || 0).toLocaleString();
  document.getElementById('statSent').innerText = (s.totalSent || 0).toLocaleString();
  document.getElementById('statPending').innerText = (s.pendingCount || 0).toLocaleString();

  // Başarı Oranı
  const totalAttempts = (s.totalSent || 0) + (s.totalFailed || 0);
  let rate = 100;
  if (totalAttempts > 0) {
    rate = Math.round(((s.totalSent || 0) / totalAttempts) * 100);
  }
  document.getElementById('statRate').innerText = `${rate}%`;
  document.getElementById('statFailed').innerText = `${s.totalFailed || 0} Hata`;

  // Filtre Sayıları
  const leads = currentData.leads || [];
  document.getElementById('countAll').innerText = leads.length;
  document.getElementById('countPending').innerText = leads.filter(l => l.status === 'BEKLEMEDE').length;
  document.getElementById('countSent').innerText = leads.filter(l => l.status === 'GONDERILDI').length;
}

// Terminal Logları
function renderLogs() {
  const container = document.getElementById('terminalLogs');
  const logs = currentData.logs || [];

  if (logs.length === 0) {
    container.innerHTML = '<div class="log-row"><span class="log-msg">Henüz işlem kaydı yok...</span></div>';
    return;
  }

  container.innerHTML = logs.map(log => {
    const typeClass = (log.type || 'system').toLowerCase();
    return `
      <div class="log-row ${typeClass}">
        <span class="log-time">[${log.timestamp}]</span>
        <span class="log-badge ${typeClass}">${log.type}</span>
        <span class="log-msg">${escapeHtml(log.message)}</span>
      </div>
    `;
  }).join('');
}

// Lead Tablosu
function renderLeadsTable() {
  const tbody = document.getElementById('leadsTableBody');
  let leads = currentData.leads || [];

  // Durum Filtresi
  if (currentFilter !== 'all') {
    leads = leads.filter(l => l.status === currentFilter);
  }

  // Arama Filtresi
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    leads = leads.filter(l => 
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.website && l.website.toLowerCase().includes(q))
    );
  }

  if (leads.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <div>Bu filtreye uygun lead bulunamadı.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = leads.map(l => {
    const sectorClass = (l.sector || 'genel').toLowerCase();
    const isPending = l.status === 'BEKLEMEDE';

    const catInfo = allCategories[l.sector] || { name: l.sector || 'Genel', icon: '💼' };

    return `
      <tr>
        <td>
          <div class="lead-name">
            ${escapeHtml(l.name)}
            ${l.city ? `<span class="lead-city">📍 ${escapeHtml(l.city)}</span>` : ''}
          </div>
        </td>
        <td>
          <span class="badge-sector ${sectorClass}">${catInfo.icon} ${escapeHtml(catInfo.name)}</span>
        </td>
        <td>
          <span class="lead-email">${escapeHtml(l.email)}</span>
        </td>
        <td>
          ${l.website ? `<a href="${escapeHtml(l.website)}" target="_blank" class="lead-link">🔗 Siteyi Aç</a>` : '<span style="color:#64748b">-</span>'}
        </td>
        <td>
          <span class="badge-status ${l.status}">${l.status}</span>
        </td>
        <td>
          <div class="actions-col">
            <button class="btn-action" title="Mail Önizle" onclick="previewLeadMail('${l.id}')">👁️ Önizle</button>
            ${isPending ? `<button class="btn-action send" title="Hemen Gönder" onclick="sendNow('${l.id}')">🚀 Gönder</button>` : ''}
            <button class="btn-action del" title="Sil" onclick="deleteLead('${l.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Filtre Seçimi
function filterLeads(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  renderLeadsTable();
}

// Arama Girişi
function handleSearchTable() {
  searchQuery = document.getElementById('tableSearch').value;
  renderLeadsTable();
}

// Sistemi Başlat / Durdur
async function toggleSystem() {
  try {
    const res = await fetch('/api/toggle', { method: 'POST' });
    const data = await res.json();
    currentData.settings.isActive = data.isActive;
    renderHeaderStatus();
  } catch (err) {
    alert('Sistem durumu değiştirilemedi: ' + err.message);
  }
}

let allCategories = {};

// Kategorileri ve Şehirleri Yükle
async function loadCategoriesAndCities() {
  try {
    const res = await fetch('/api/categories');
    const data = await res.json();
    allCategories = data.categories || {};

    const selectCategory = document.getElementById('selectCategory');
    const selectCity = document.getElementById('selectCity');

    if (selectCategory) {
      selectCategory.innerHTML = '<option value="" disabled selected>Kategori Seçiniz (20 Sektör)...</option>' +
        Object.entries(allCategories).map(([key, item]) => {
          return `<option value="${key}">${item.icon} ${item.name}</option>`;
        }).join('');
    }

    if (selectCity && data.cities) {
      selectCity.innerHTML = data.cities.map(c => `<option value="${c}">${c}</option>`).join('');
    }
  } catch (err) {
    console.warn('Kategoriler yüklenemedi:', err);
  }
}

// Otomatik Kategori & Şehir Arama Tetikleyici
async function handleCategorySearch(e) {
  e.preventDefault();
  const category = document.getElementById('selectCategory').value;
  const city = document.getElementById('selectCity').value;
  const btn = document.getElementById('btnStartTarget');

  if (!category || !city) {
    alert('Lütfen bir kategori ve şehir seçiniz.');
    return;
  }

  btn.disabled = true;
  const catName = allCategories[category]?.name || category;
  btn.innerHTML = `<span>⏳</span> [${catName}] taranıyor...`;

  try {
    const res = await fetch('/api/trigger-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, city })
    });
    const result = await res.json();
    if (result.success) {
      // Başarılı
    } else {
      alert('Tarama başlatılamadı: ' + result.error);
    }
  } catch (err) {
    alert('Hata: ' + err.message);
  } finally {
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<span>🚀</span> Bu Sektör & Şehirde Taramayı Başlat';
    }, 2000);
  }
}

// Test E-Postası Gönder
async function handleTestEmail(e) {
  e.preventDefault();
  const emailInput = document.getElementById('inputTestEmail');
  const btn = document.getElementById('btnTestMail');
  const email = emailInput.value.trim();

  if (!email) return;

  btn.disabled = true;
  btn.innerHTML = '<span>⏳</span> Gönderiliyor...';

  try {
    const res = await fetch('/api/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const result = await res.json();
    if (result.success) {
      alert('✓ Test e-postası başarıyla gönderildi: ' + email);
    } else {
      alert('✕ Gönderim başarısız: ' + (result.error || 'Bilinmeyen hata'));
    }
  } catch (err) {
    alert('Hata: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>📤</span> Test Mailini Gönder';
  }
}

// Hemen Gönder
async function sendNow(id) {
  if (!confirm('Bu lead için sırayı beklemeden şimdi e-posta gönderilsin mi?')) return;

  try {
    const res = await fetch(`/api/send-now/${id}`, { method: 'POST' });
    const result = await res.json();
    if (result.success) {
      // Başarılı
    } else {
      alert('Gönderim hatası: ' + (result.error || 'Hata oluştu'));
    }
  } catch (err) {
    alert('Hata: ' + err.message);
  }
}

// Lead Sil
async function deleteLead(id) {
  if (!confirm('Bu lead silinsin mi?')) return;
  try {
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
  } catch (err) {
    alert('Silinemedi: ' + err.message);
  }
}

// Mail Önizleme Modalı
async function previewLeadMail(id) {
  const modal = document.getElementById('previewModal');
  const title = document.getElementById('modalTitle');
  const meta = document.getElementById('modalMeta');
  const body = document.getElementById('modalBody');

  body.innerHTML = '<div style="padding:20px; text-align:center; color:#64748b;">Şablon hazırlanıyor...</div>';
  modal.classList.add('open');

  try {
    const res = await fetch(`/api/preview/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Yüklenemedi');

    const lead = data.lead;
    title.innerText = `Mail Önizleme: ${lead.name}`;
    meta.innerHTML = `
      <div><strong>Konu:</strong> ${escapeHtml(data.subject)}</div>
      <div><strong>Kime:</strong> ${escapeHtml(lead.email)} | <strong>Sektör:</strong> ${escapeHtml(lead.sector || 'Genel')}</div>
      <div><strong>Web Sitesi:</strong> <a href="${escapeHtml(lead.website)}" target="_blank" style="color:#38bdf8;">${escapeHtml(lead.website)}</a></div>
    `;

    body.innerHTML = data.bodyHtml;
  } catch (err) {
    body.innerHTML = `<div style="color:#ef4444; padding:20px;">Hata: ${err.message}</div>`;
  }
}

function closeModal(e) {
  const modal = document.getElementById('previewModal');
  modal.classList.remove('open');
}

function clearLogs() {
  document.getElementById('terminalLogs').innerHTML = '<div class="log-row"><span class="log-msg">Loglar ekrandan temizlendi.</span></div>';
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Başlat
document.addEventListener('DOMContentLoaded', () => {
  initSSE();
  loadCategoriesAndCities();
});
