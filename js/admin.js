/**
 * admin.js — dedeseptian. Admin Panel
 * Auth: session-based password (localStorage)
 * Data: full CRUD → localStorage → read by main.js
 */

const STORAGE_KEY = 'dedeseptian_data';
const PASS_KEY    = 'dedeseptian_pass';
const AUTH_KEY    = 'dedeseptian_auth';
const DEFAULT_PWD = 'dede2026';

/* ──────────────────────────────────────
   AUTH
   ────────────────────────────────────── */
const getPassword = () => localStorage.getItem(PASS_KEY) || DEFAULT_PWD;
const isAuth      = () => sessionStorage.getItem(AUTH_KEY) === '1';

function doLogin(pwd) {
  if (pwd === getPassword()) {
    sessionStorage.setItem(AUTH_KEY, '1');
    return true;
  }
  return false;
}
function doLogout() {
  sessionStorage.removeItem(AUTH_KEY);
  location.reload();
}

/* ──────────────────────────────────────
   DATA
   ────────────────────────────────────── */
let appData = {};

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (_) {}
  }
  return JSON.parse(JSON.stringify(window.DEFAULT_DATA));
}
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

/* ──────────────────────────────────────
   DOM HELPERS
   ────────────────────────────────────── */
const qs    = sel => document.querySelector(sel);
const qsAll = sel => document.querySelectorAll(sel);

function val(id)  { return (qs(`#${id}`)?.value || '').trim(); }
function setVal(id, v) { const el = qs(`#${id}`); if (el) el.value = v ?? ''; }

function esc(s) {
  return String(s || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ──────────────────────────────────────
   TOAST
   ────────────────────────────────────── */
function toast(msg, type = 'success') {
  let el = qs('#toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = `toast ${type}`;
  el.style.display = 'block';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = 'none'; }, 2600);
}

/* ──────────────────────────────────────
   MODAL
   ────────────────────────────────────── */
function openModal(html) {
  let overlay = qs('#modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal';
    overlay.className = 'modal-overlay';
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `<div class="modal-box">${html}</div>`;
  overlay.style.display = 'flex';
}
function closeModal() {
  const m = qs('#modal');
  if (m) m.style.display = 'none';
}
// Expose to inline onclick
window.closeModal = closeModal;

/* ──────────────────────────────────────
   INIT
   ────────────────────────────────────── */
let currentSec = 'profile';

document.addEventListener('DOMContentLoaded', () => {
  if (isAuth()) {
    appData = loadData();
    showAdmin();
  } else {
    showLogin();
  }

  // Login form
  qs('#login-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const pwd = val('login-pass');
    if (doLogin(pwd)) {
      appData = loadData();
      showAdmin();
    } else {
      const err = qs('#login-error');
      if (err) { err.textContent = 'Password salah. Coba lagi.'; err.style.display = 'block'; }
    }
  });

  // Sidebar links
  qsAll('.sidebar-link[data-sec]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      qsAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      currentSec = link.dataset.sec;
      renderSection(currentSec);
    });
  });

  // Logout
  qs('#logout-btn')?.addEventListener('click', doLogout);
});

function showLogin() {
  qs('#login-screen').style.display = 'flex';
  qs('#admin-ui').style.display = 'none';
}
function showAdmin() {
  qs('#login-screen').style.display = 'none';
  qs('#admin-ui').style.display = 'flex';
  renderSection(currentSec);
}

/* ──────────────────────────────────────
   SECTION ROUTER
   ────────────────────────────────────── */
function renderSection(sec) {
  const content = qs('#admin-content');
  content.innerHTML = '';
  ({ profile, projects, expertise, articles, design })[sec]?.(content);
}

const SECTIONS = { profile, projects, expertise, articles, design };
function renderSection(sec) {
  const content = qs('#admin-content');
  content.innerHTML = '';
  (SECTIONS[sec] || SECTIONS.profile)(content);
}

/* ──────────────────────────────────────
   SECTION: PROFILE
   ────────────────────────────────────── */
function profile(root) {
  const p = appData.profile;
  root.innerHTML = `
    <div class="sec-head"><h2>Managing Profile (ID)</h2></div>

    <div class="form-card">
      <div class="fg">
        <label>DISPLAY NAME</label>
        <input id="f-name" value="${esc(p.name)}">
      </div>
      <div class="fg-row">
        <div class="fg">
          <label>CURRENT ROLE</label>
          <input id="f-role" value="${esc(p.role)}">
        </div>
        <div class="fg">
          <label>PROFILE IMAGE URL</label>
          <input id="f-img" value="${esc(p.profileImage)}">
        </div>
      </div>

      <div class="divider"><div class="divider-label">⚙️ Hero Section</div></div>

      <div class="fg">
        <label>HEADLINE</label>
        <input id="f-headline" value="${esc(p.heroHeadline)}">
      </div>
      <div class="fg-row">
        <div class="fg">
          <label>KATA HIGHLIGHT (diberi warna biru)</label>
          <input id="f-highlight" value="${esc(p.heroHighlight)}" placeholder="e.g. Masa Depan">
        </div>
        <div class="fg">
          <label>TAGLINE</label>
          <input id="f-tagline" value="${esc(p.heroTagline)}">
        </div>
      </div>
      <div class="fg">
        <label>DESKRIPSI HERO</label>
        <textarea id="f-herodesc" rows="3">${esc(p.heroDesc)}</textarea>
      </div>

      <div class="divider"><div class="divider-label">📄 About</div></div>

      <div class="fg">
        <label>ABOUT CONTENT</label>
        <textarea id="f-about" rows="5">${esc(p.aboutContent)}</textarea>
      </div>
      <div class="fg-row">
        <div class="fg">
          <label>ABOUT IMAGE URL (opsional)</label>
          <input id="f-aboutimg" value="${esc(p.aboutImage || '')}" placeholder="Biarkan kosong = gunakan foto profil">
        </div>
        <div class="fg">
          <label>TAHUN PENGALAMAN</label>
          <input id="f-years" value="${esc(p.aboutYears || '7+')}" placeholder="7+">
        </div>
      </div>

      <div class="divider"><div class="divider-label">📍 Kontak & Links</div></div>

      <div class="fg-row">
        <div class="fg">
          <label>LOKASI</label>
          <input id="f-loc" value="${esc(p.location)}">
        </div>
        <div class="fg">
          <label>EMAIL</label>
          <input id="f-email" value="${esc(p.email || '')}" placeholder="hello@domain.com">
        </div>
      </div>
      <div class="fg">
        <label>LINKEDIN URL</label>
        <input id="f-linkedin" value="${esc(p.linkedin || '')}" placeholder="https://linkedin.com/in/...">
      </div>

      <div class="form-actions">
        <button class="btn-save" onclick="saveProfile()">Simpan Perubahan</button>
      </div>
    </div>

    <div class="form-card">
      <div class="divider-label" style="margin-bottom:1.1rem">🔐 GANTI PASSWORD</div>
      <div class="fg-row">
        <div class="fg">
          <label>PASSWORD BARU</label>
          <input type="password" id="f-newpwd" placeholder="Min. 6 karakter">
        </div>
        <div class="fg">
          <label>KONFIRMASI PASSWORD</label>
          <input type="password" id="f-confirmpwd" placeholder="Ulangi password baru">
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-save" onclick="changePassword()">Update Password</button>
      </div>
    </div>
  `;
}

window.saveProfile = function() {
  const p = appData.profile;
  p.name         = val('f-name');
  p.role         = val('f-role');
  p.profileImage = val('f-img');
  p.heroHeadline = val('f-headline');
  p.heroHighlight= val('f-highlight');
  p.heroTagline  = val('f-tagline');
  p.heroDesc     = val('f-herodesc');
  p.aboutContent = val('f-about');
  p.aboutImage   = val('f-aboutimg') || undefined;
  p.aboutYears   = val('f-years');
  p.location     = val('f-loc');
  p.email        = val('f-email');
  p.linkedin     = val('f-linkedin');
  saveData();
  toast('Profile berhasil disimpan! ✓');
};

window.changePassword = function() {
  const np = val('f-newpwd');
  const cp = val('f-confirmpwd');
  if (np.length < 6) return toast('Password minimal 6 karakter', 'error');
  if (np !== cp)     return toast('Password tidak cocok', 'error');
  localStorage.setItem(PASS_KEY, np);
  setVal('f-newpwd', '');
  setVal('f-confirmpwd', '');
  toast('Password berhasil diubah! ✓');
};

/* ──────────────────────────────────────
   SECTION: PROJECTS
   ────────────────────────────────────── */
function projects(root) {
  root.innerHTML = `
    <div class="sec-head">
      <h2>Managing Projects</h2>
      <button class="btn-add" onclick="openProjectModal(-1)">+ Tambah Project</button>
    </div>
    <div id="proj-list"></div>
  `;
  renderProjList();
}

function renderProjList() {
  const list = qs('#proj-list');
  if (!list) return;
  if (!appData.projects.length) {
    list.innerHTML = `<div class="empty-state">Belum ada project. Klik "+ Tambah Project" untuk mulai.</div>`;
    return;
  }
  list.innerHTML = appData.projects.map((p, i) => `
    <div class="item-card">
      <div class="item-thumb">
        <img src="${esc(p.image)}" alt="${esc(p.title)}"
             onerror="this.src='https://picsum.photos/seed/err${p.id}/200/120'">
      </div>
      <div class="item-body">
        <div class="item-meta">${esc(p.subtitle)} · ${esc(p.category)}</div>
        <div class="item-title">${esc(p.title)}</div>
        <div class="item-desc">${esc(p.description)}</div>
      </div>
      <div class="item-actions">
        <button class="btn-edit" onclick="openProjectModal(${i})">Edit</button>
        <button class="btn-del"  onclick="deleteProject(${i})">Hapus</button>
      </div>
    </div>
  `).join('');
}

window.openProjectModal = function(idx) {
  const isNew = idx === -1;
  const p = isNew ? {} : appData.projects[idx];
  openModal(`
    <h3>${isNew ? 'Tambah' : 'Edit'} Project</h3>
    <div class="fg">
      <label>JUDUL PROJECT</label>
      <input id="m-title" value="${esc(p.title)}">
    </div>
    <div class="fg-row">
      <div class="fg">
        <label>SUBTITLE / TYPE</label>
        <input id="m-subtitle" value="${esc(p.subtitle)}" placeholder="e.g. Desain Pengajaran">
      </div>
      <div class="fg">
        <label>KATEGORI</label>
        <select id="m-cat">
          <option value="desain-pengajaran" ${p.category==='desain-pengajaran'?'selected':''}>Desain Pengajaran</option>
          <option value="teknologi-lms"     ${p.category==='teknologi-lms'?'selected':''}>Teknologi LMS</option>
          <option value="strategi"          ${p.category==='strategi'?'selected':''}>Strategi Lain</option>
        </select>
      </div>
    </div>
    <div class="fg">
      <label>IMAGE URL</label>
      <input id="m-img" value="${esc(p.image)}" placeholder="https://picsum.photos/...">
    </div>
    <div class="fg">
      <label>DESKRIPSI</label>
      <textarea id="m-desc" rows="3">${esc(p.description)}</textarea>
    </div>
    <div class="form-actions">
      <button class="btn-cancel" onclick="closeModal()">Batal</button>
      <button class="btn-save"   onclick="saveProject(${idx})">Simpan</button>
    </div>
  `);
};

window.saveProject = function(idx) {
  const title = val('m-title');
  if (!title) return toast('Judul wajib diisi', 'error');
  const item = {
    id:          idx === -1 ? Date.now() : appData.projects[idx].id,
    title,
    subtitle:    val('m-subtitle'),
    category:    qs('#m-cat').value,
    image:       val('m-img'),
    description: val('m-desc')
  };
  if (idx === -1) appData.projects.push(item);
  else            appData.projects[idx] = item;
  saveData(); closeModal(); renderProjList();
  toast(idx === -1 ? 'Project ditambahkan! ✓' : 'Project diperbarui! ✓');
};

window.deleteProject = function(idx) {
  if (!confirm('Hapus project ini?')) return;
  appData.projects.splice(idx, 1);
  saveData(); renderProjList();
  toast('Project dihapus');
};

/* ──────────────────────────────────────
   SECTION: EXPERTISE
   ────────────────────────────────────── */
function expertise(root) {
  root.innerHTML = `
    <div class="sec-head">
      <h2>Managing Expertise</h2>
      <button class="btn-add" onclick="openExpModal(-1)">+ Tambah Keahlian</button>
    </div>
    <div id="exp-list"></div>
  `;
  renderExpList();
}

function renderExpList() {
  const list = qs('#exp-list');
  if (!list) return;
  const icons = { monitor:'💻', book:'📚', share:'🔗', chart:'📊' };
  if (!appData.expertise.length) {
    list.innerHTML = `<div class="empty-state">Belum ada keahlian.</div>`;
    return;
  }
  list.innerHTML = appData.expertise.map((e, i) => `
    <div class="item-card">
      <div style="font-size:1.5rem;flex-shrink:0;width:40px;text-align:center">${icons[e.icon]||'⚡'}</div>
      <div class="item-body">
        <div class="item-title">${esc(e.title)}</div>
        <div class="item-desc">${esc(e.desc)}</div>
      </div>
      <div class="item-actions">
        <button class="btn-edit" onclick="openExpModal(${i})">Edit</button>
        <button class="btn-del"  onclick="deleteExp(${i})">Hapus</button>
      </div>
    </div>
  `).join('');
}

window.openExpModal = function(idx) {
  const isNew = idx === -1;
  const e = isNew ? {} : appData.expertise[idx];
  const ico = e.icon || 'monitor';
  openModal(`
    <h3>${isNew ? 'Tambah' : 'Edit'} Keahlian</h3>
    <div class="fg">
      <label>JUDUL</label>
      <input id="m-title" value="${esc(e.title)}">
    </div>
    <div class="fg">
      <label>IKON</label>
      <select id="m-icon">
        <option value="monitor" ${ico==='monitor'?'selected':''}>💻 Monitor (Pembelajaran Digital)</option>
        <option value="book"    ${ico==='book'?'selected':''}>📚 Buku (Manajemen Pengetahuan)</option>
        <option value="share"   ${ico==='share'?'selected':''}>🔗 Share (Strategi Konten)</option>
        <option value="chart"   ${ico==='chart'?'selected':''}>📊 Chart (Analitik)</option>
      </select>
    </div>
    <div class="fg">
      <label>DESKRIPSI</label>
      <textarea id="m-desc" rows="3">${esc(e.desc)}</textarea>
    </div>
    <div class="form-actions">
      <button class="btn-cancel" onclick="closeModal()">Batal</button>
      <button class="btn-save"   onclick="saveExp(${idx})">Simpan</button>
    </div>
  `);
};

window.saveExp = function(idx) {
  const title = val('m-title');
  if (!title) return toast('Judul wajib diisi', 'error');
  const item = { title, icon: qs('#m-icon').value, desc: val('m-desc') };
  if (idx === -1) appData.expertise.push(item);
  else            appData.expertise[idx] = item;
  saveData(); closeModal(); renderExpList();
  toast(idx === -1 ? 'Keahlian ditambahkan! ✓' : 'Keahlian diperbarui! ✓');
};

window.deleteExp = function(idx) {
  if (!confirm('Hapus keahlian ini?')) return;
  appData.expertise.splice(idx, 1);
  saveData(); renderExpList();
  toast('Keahlian dihapus');
};

/* ──────────────────────────────────────
   SECTION: ARTICLES
   ────────────────────────────────────── */
function articles(root) {
  root.innerHTML = `
    <div class="sec-head">
      <h2>Managing Articles</h2>
      <button class="btn-add" onclick="openArtModal(-1)">+ Tambah Artikel</button>
    </div>
    <div id="art-list"></div>
  `;
  renderArtList();
}

function renderArtList() {
  const list = qs('#art-list');
  if (!list) return;
  if (!appData.articles.length) {
    list.innerHTML = `<div class="empty-state">Belum ada artikel.</div>`;
    return;
  }
  list.innerHTML = appData.articles.map((a, i) => `
    <div class="item-card">
      <div class="item-thumb">
        <img src="${esc(a.image)}" alt="${esc(a.title)}"
             onerror="this.src='https://picsum.photos/seed/err${a.id}/200/120'">
      </div>
      <div class="item-body">
        <div class="item-meta">${esc(a.category)} · ${esc(a.tag)} · ${esc(a.date)}</div>
        <div class="item-title">${esc(a.title)}</div>
        <div class="item-desc">${esc(a.excerpt)}</div>
      </div>
      <div class="item-actions">
        <button class="btn-edit" onclick="openArtModal(${i})">Edit</button>
        <button class="btn-del"  onclick="deleteArt(${i})">Hapus</button>
      </div>
    </div>
  `).join('');
}

window.openArtModal = function(idx) {
  const isNew = idx === -1;
  const a = isNew ? {} : appData.articles[idx];
  openModal(`
    <h3>${isNew ? 'Tambah' : 'Edit'} Artikel</h3>
    <div class="fg">
      <label>JUDUL</label>
      <input id="m-title" value="${esc(a.title)}">
    </div>
    <div class="fg-row">
      <div class="fg">
        <label>KATEGORI</label>
        <input id="m-cat" value="${esc(a.category)}" placeholder="Knowledge Management">
      </div>
      <div class="fg">
        <label>TAG</label>
        <input id="m-tag" value="${esc(a.tag)}" placeholder="AI">
      </div>
    </div>
    <div class="fg-row">
      <div class="fg">
        <label>TANGGAL</label>
        <input id="m-date" value="${esc(a.date)}" placeholder="21 May 2025">
      </div>
      <div class="fg">
        <label>READ TIME</label>
        <input id="m-read" value="${esc(a.readTime)}" placeholder="5 min">
      </div>
    </div>
    <div class="fg">
      <label>IMAGE URL</label>
      <input id="m-img" value="${esc(a.image)}" placeholder="https://...">
    </div>
    <div class="fg">
      <label>EXCERPT</label>
      <textarea id="m-excerpt" rows="3">${esc(a.excerpt)}</textarea>
    </div>
    <div class="form-actions">
      <button class="btn-cancel" onclick="closeModal()">Batal</button>
      <button class="btn-save"   onclick="saveArt(${idx})">Simpan</button>
    </div>
  `);
};

window.saveArt = function(idx) {
  const title = val('m-title');
  if (!title) return toast('Judul wajib diisi', 'error');
  const item = {
    id:       idx === -1 ? Date.now() : appData.articles[idx].id,
    title,
    category: val('m-cat'),
    tag:      val('m-tag'),
    date:     val('m-date'),
    readTime: val('m-read'),
    image:    val('m-img'),
    excerpt:  val('m-excerpt')
  };
  if (idx === -1) appData.articles.push(item);
  else            appData.articles[idx] = item;
  saveData(); closeModal(); renderArtList();
  toast(idx === -1 ? 'Artikel ditambahkan! ✓' : 'Artikel diperbarui! ✓');
};

window.deleteArt = function(idx) {
  if (!confirm('Hapus artikel ini?')) return;
  appData.articles.splice(idx, 1);
  saveData(); renderArtList();
  toast('Artikel dihapus');
};

/* ──────────────────────────────────────
   SECTION: DESIGN (CTA + Stats)
   ────────────────────────────────────── */
function design(root) {
  const p = appData.profile;
  root.innerHTML = `
    <div class="sec-head"><h2>Design & CTA Settings</h2></div>

    <div class="form-card">
      <div class="divider-label">🎯 CTA BANNER</div>
      <div class="fg">
        <label>JUDUL CTA (gunakan \\n untuk baris baru)</label>
        <textarea id="f-ctatitle" rows="3">${esc(p.ctaTitle || 'SIAP MEMBANGUN\nMASA DEPAN\nBERSAMA?')}</textarea>
      </div>
      <div class="fg">
        <label>DESKRIPSI CTA</label>
        <textarea id="f-ctadesc" rows="3">${esc(p.ctaDesc)}</textarea>
      </div>
      <div class="fg-row">
        <div class="fg">
          <label>TOMBOL UTAMA</label>
          <input id="f-ctap1" value="${esc(p.ctaPrimary)}">
        </div>
        <div class="fg">
          <label>TOMBOL SEKUNDER</label>
          <input id="f-ctap2" value="${esc(p.ctaSecondary)}">
        </div>
      </div>

      <div class="divider"><div class="divider-label">📊 STATS</div></div>

      ${appData.stats.map((s, i) => `
        <div class="fg-row" style="margin-bottom:.75rem">
          <div class="fg">
            <label>STAT ${i+1} — NILAI</label>
            <input id="sv${i}" value="${esc(s.value)}" placeholder="10K+">
          </div>
          <div class="fg">
            <label>STAT ${i+1} — LABEL</label>
            <input id="sl${i}" value="${esc(s.label)}" placeholder="Pelajar Terjangkau">
          </div>
        </div>
      `).join('')}

      <div class="form-actions">
        <button class="btn-save" onclick="saveDesign()">Simpan Perubahan</button>
      </div>
    </div>

    <div class="form-card">
      <div class="divider-label" style="margin-bottom:.75rem">⚠️ DATA MANAGEMENT</div>
      <p style="font-size:.82rem;color:var(--c-muted);margin-bottom:1rem;line-height:1.6">
        Reset semua konten ke data default bawaan. <strong>Tindakan ini tidak bisa diurungkan.</strong>
      </p>
      <button class="btn-danger-outline" onclick="resetAll()">Reset ke Default</button>
    </div>
  `;
}

window.saveDesign = function() {
  const p = appData.profile;
  p.ctaTitle    = val('f-ctatitle');
  p.ctaDesc     = val('f-ctadesc');
  p.ctaPrimary  = val('f-ctap1');
  p.ctaSecondary= val('f-ctap2');
  appData.stats = appData.stats.map((s, i) => ({
    value: val(`sv${i}`) || s.value,
    label: val(`sl${i}`) || s.label
  }));
  saveData();
  toast('Design settings disimpan! ✓');
};

window.resetAll = function() {
  if (!confirm('Reset SEMUA data ke default? Tindakan ini tidak bisa diurungkan.')) return;
  localStorage.removeItem(STORAGE_KEY);
  appData = JSON.parse(JSON.stringify(window.DEFAULT_DATA));
  renderSection(currentSec);
  toast('Data direset ke default! ✓');
};
