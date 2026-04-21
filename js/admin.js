/**
 * admin.js — dedeseptian. Professional CMS v2
 * Features: Tag Chips, Status, Featured, ReadTime Auto, Reorder, Image Preview
 */

const STORAGE_KEY = 'dedeseptian_data';
const PASS_KEY    = 'dedeseptian_pass';
const AUTH_KEY    = 'dedeseptian_auth';
const DEFAULT_PWD = 'dede2026';

/* ── AUTH ─────────────────────────────────────── */
const getPassword = () => localStorage.getItem(PASS_KEY) || DEFAULT_PWD;
const isAuth      = () => sessionStorage.getItem(AUTH_KEY) === '1';
function doLogin(pwd) {
  if (pwd === getPassword()) { sessionStorage.setItem(AUTH_KEY,'1'); return true; }
  return false;
}
function doLogout() { sessionStorage.removeItem(AUTH_KEY); location.reload(); }

/* ── DATA ─────────────────────────────────────── */
let D = {};

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) { try { return JSON.parse(raw); } catch(_){} }
  return JSON.parse(JSON.stringify(window.DEFAULT_DATA));
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(D)); }

/* ── HELPERS ──────────────────────────────────── */
const qs    = s => document.querySelector(s);
const qsAll = s => document.querySelectorAll(s);
function val(id)  { return (qs(`#${id}`)?.value||'').trim(); }
function setVal(id,v) { const el=qs(`#${id}`); if(el) el.value=v??''; }
function checked(id) { return qs(`#${id}`)?.checked||false; }
function setChecked(id,v) { const el=qs(`#${id}`); if(el) el.checked=!!v; }

function esc(s) {
  return String(s||'')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function fmtDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('id-ID',{ day:'numeric', month:'short', year:'numeric' });
  } catch(_){ return iso; }
}

function calcReadTime(text) {
  const wpm = 200;
  const words = (text||'').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wpm));
}

/* ── TOAST ────────────────────────────────────── */
function toast(msg, type='success') {
  let el = qs('#admin-toast');
  if (!el) {
    el = document.createElement('div');
    el.id='admin-toast'; el.className='toast';
    document.body.appendChild(el);
  }
  el.innerHTML = `<span>${type==='success'?'✓':'✗'}</span>${msg}`;
  el.className = `toast ${type}`;
  el.style.display = 'flex';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display='none'; }, 2800);
}

/* ── MODAL ────────────────────────────────────── */
function openModal(titleHtml, bodyHtml, footerHtml) {
  let overlay = qs('#admin-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'admin-modal';
    overlay.className = 'modal-overlay';
    overlay.addEventListener('click', e => { if (e.target===overlay) closeModal(); });
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h3>${titleHtml}</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
      <div class="modal-footer">${footerHtml}</div>
    </div>
  `;
  overlay.style.display = 'flex';
  // Init any tag inputs or image previews in modal
  setTimeout(initModalEnhancements, 10);
}
function closeModal() {
  const m = qs('#admin-modal');
  if (m) m.style.display='none';
}
window.closeModal = closeModal;

/* ── TAG CHIP INPUT SYSTEM ────────────────────── */
const tagStates = {};

function initTagInput(containerId, initialTags=[]) {
  tagStates[containerId] = [...initialTags];
  renderTagInput(containerId);
}

function renderTagInput(cid) {
  const wrap = qs(`#${cid}`);
  if (!wrap) return;
  const tags = tagStates[cid] || [];
  wrap.innerHTML = tags.map(t => `
    <span class="tag-chip">
      ${esc(t)}
      <button class="tag-chip-remove" type="button" onclick="removeTag('${cid}','${t.replace(/'/g,"\\'")}')">×</button>
    </span>
  `).join('') + `
    <input class="tag-text-input" id="${cid}-input"
      placeholder="${tags.length?'':'Ketik tag, tekan Enter atau koma...'}"
      onkeydown="handleTagKey(event,'${cid}')"
      onblur="commitTagInput('${cid}')">
  `;
  wrap.onclick = () => qs(`#${cid}-input`)?.focus();
}

window.removeTag = function(cid, tag) {
  tagStates[cid] = (tagStates[cid]||[]).filter(t=>t!==tag);
  renderTagInput(cid);
};
window.handleTagKey = function(e, cid) {
  if (e.key==='Enter'||e.key===',') {
    e.preventDefault();
    const v = e.target.value.replace(',','').trim();
    if (v) addTag(cid, v);
    e.target.value='';
  }
  if (e.key==='Backspace' && !e.target.value && (tagStates[cid]||[]).length) {
    const tags = tagStates[cid];
    tagStates[cid] = tags.slice(0,-1);
    renderTagInput(cid);
  }
};
window.commitTagInput = function(cid) {
  const input = qs(`#${cid}-input`);
  if (!input) return;
  const v = input.value.replace(',','').trim();
  if (v) addTag(cid, v);
  input.value = '';
};
function addTag(cid, tag) {
  const t = tag.trim();
  if (!t) return;
  if (!(tagStates[cid]||[]).includes(t)) {
    tagStates[cid] = [...(tagStates[cid]||[]), t];
    renderTagInput(cid);
  }
}
function getTags(cid) { return [...(tagStates[cid]||[])]; }

/* ── IMAGE PREVIEW ────────────────────────────── */
function initImagePreview(inputId, thumbId) {
  const input = qs(`#${inputId}`);
  const thumb = qs(`#${thumbId}`);
  if (!input||!thumb) return;
  function update() {
    const url = input.value.trim();
    if (url) {
      thumb.classList.add('visible');
      thumb.querySelector('img').src = url;
    } else {
      thumb.classList.remove('visible');
    }
  }
  input.addEventListener('input', update);
  update();
}

function initModalEnhancements() {
  // Image previews in modal
  if (qs('#m-img') && qs('#m-img-thumb')) {
    initImagePreview('m-img', 'm-img-thumb');
  }
  // Read time calculation
  const excerptEl = qs('#m-excerpt');
  const rtEl = qs('#m-readtime');
  const rtHint = qs('#m-readtime-hint');
  if (excerptEl && rtEl) {
    excerptEl.addEventListener('input', () => {
      const est = calcReadTime(excerptEl.value);
      if (rtHint) rtHint.textContent = `Estimasi otomatis: ~${est} menit`;
    });
  }
}

/* ── INIT ─────────────────────────────────────── */
let currentSec = 'profile';
const sectionTitles = {
  profile: 'Profile', projects:'Projects', expertise:'Expertise',
  articles:'Articles', design:'Design & CTA'
};

document.addEventListener('DOMContentLoaded', () => {
  if (isAuth()) {
    D = loadData();
    showAdmin();
  } else {
    showLogin();
  }

  qs('#login-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const pwd = val('login-pass');
    const err = qs('#login-error');
    if (doLogin(pwd)) {
      D = loadData();
      showAdmin();
    } else {
      if (err) { err.textContent='Password salah. Coba lagi.'; err.style.display='block'; }
      qs('#login-pass').value='';
      qs('#login-pass').focus();
    }
  });

  qsAll('.sb-link[data-sec]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      qsAll('.sb-link').forEach(l=>l.classList.remove('active'));
      link.classList.add('active');
      currentSec = link.dataset.sec;
      updateTopbar(currentSec);
      renderSection(currentSec);
    });
  });

  qs('#logout-btn')?.addEventListener('click', doLogout);
});

function showLogin() {
  qs('#login-screen').style.display = 'flex';
  qs('#admin-ui').style.display = 'none';
}
function showAdmin() {
  qs('#login-screen').style.display = 'none';
  qs('#admin-ui').style.display = 'flex';
  updateTopbar(currentSec);
  renderSection(currentSec);
  updateSidebarBadges();
}
function updateTopbar(sec) {
  const el = qs('#topbar-section-name');
  if (el) el.textContent = sectionTitles[sec]||sec;
}
function updateSidebarBadges() {
  const counts = {
    projects: D.projects?.length||0,
    articles: D.articles?.length||0,
    expertise:D.expertise?.length||0,
  };
  Object.entries(counts).forEach(([sec,count]) => {
    const link = qs(`.sb-link[data-sec="${sec}"] .sb-badge`);
    if (link) link.textContent = count;
  });
}

/* ── SECTION ROUTER ───────────────────────────── */
const SECTIONS = { profile, projects, expertise, articles, design };
function renderSection(sec) {
  const content = qs('#admin-content');
  content.innerHTML = '';
  (SECTIONS[sec]||SECTIONS.profile)(content);
}

/* ══════════════════════════════════════════════
   SECTION: PROFILE
   ══════════════════════════════════════════════ */
function profile(root) {
  const p = D.profile;
  root.innerHTML = `
    <!-- Identity -->
    <div class="form-card">
      <div class="form-card-title">Identitas & Visual</div>
      <div class="fg-row">
        <div class="fg">
          <label>DISPLAY NAME</label>
          <input id="f-name" value="${esc(p.name)}">
        </div>
        <div class="fg">
          <label>NAMA LENGKAP</label>
          <input id="f-displayname" value="${esc(p.displayName||'')}">
        </div>
      </div>
      <div class="fg-row">
        <div class="fg">
          <label>CURRENT ROLE</label>
          <input id="f-role" value="${esc(p.role)}">
        </div>
        <div class="fg">
          <label>PROFILE IMAGE URL</label>
          <div class="img-preview-wrap">
            <div class="img-preview-thumb" id="f-img-thumb">
              <img src="${esc(p.profileImage)}" onerror="this.style.display='none'">
            </div>
            <div class="img-preview-input fg" style="margin-bottom:0">
              <input id="f-img" value="${esc(p.profileImage)}" placeholder="https://...">
            </div>
          </div>
        </div>
      </div>

      <div class="divider"><div class="divider-label">KONTAK & LINKS</div></div>
      <div class="fg-row-3">
        <div class="fg">
          <label>LOKASI</label>
          <input id="f-loc" value="${esc(p.location)}">
        </div>
        <div class="fg">
          <label>EMAIL</label>
          <input id="f-email" value="${esc(p.email||'')}">
        </div>
        <div class="fg">
          <label>LINKEDIN URL</label>
          <input id="f-linkedin" value="${esc(p.linkedin||'')}">
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-primary" onclick="saveProfile()">Simpan Profile</button>
      </div>
    </div>

    <!-- Hero -->
    <div class="form-card">
      <div class="form-card-title">Hero Section</div>
      <div class="fg">
        <label>HEADLINE</label>
        <input id="f-headline" value="${esc(p.heroHeadline)}">
      </div>
      <div class="fg-row">
        <div class="fg">
          <label>KATA HIGHLIGHT (biru + gradient)</label>
          <input id="f-highlight" value="${esc(p.heroHighlight)}" placeholder="Masa Depan">
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
      <div class="fg-row">
        <div class="fg">
          <label>TOMBOL CTA 1</label>
          <input id="f-cta1" value="${esc(p.heroCta1)}">
        </div>
        <div class="fg">
          <label>TOMBOL CTA 2</label>
          <input id="f-cta2" value="${esc(p.heroCta2)}">
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-primary" onclick="saveHero()">Simpan Hero</button>
      </div>
    </div>

    <!-- About -->
    <div class="form-card">
      <div class="form-card-title">About Section</div>
      <div class="fg">
        <label>ABOUT CONTENT</label>
        <textarea id="f-about" rows="5">${esc(p.aboutContent)}</textarea>
      </div>
      <div class="fg-row">
        <div class="fg">
          <label>ABOUT IMAGE URL (kosong = gunakan foto profil)</label>
          <div class="img-preview-wrap">
            <div class="img-preview-thumb" id="f-aboutimg-thumb">
              <img src="${esc(p.aboutImage||p.profileImage)}" onerror="this.style.display='none'">
            </div>
            <div class="img-preview-input fg" style="margin-bottom:0">
              <input id="f-aboutimg" value="${esc(p.aboutImage||'')}" placeholder="Biarkan kosong = foto profil">
            </div>
          </div>
        </div>
        <div class="fg">
          <label>TAHUN PENGALAMAN</label>
          <input id="f-years" value="${esc(p.aboutYears||'7+')}" placeholder="7+">
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-primary" onclick="saveAbout()">Simpan About</button>
      </div>
    </div>

    <!-- Password -->
    <div class="form-card">
      <div class="form-card-title">Ganti Password</div>
      <div class="fg-row">
        <div class="fg">
          <label>PASSWORD BARU</label>
          <input type="password" id="f-newpwd" placeholder="Min. 6 karakter">
        </div>
        <div class="fg">
          <label>KONFIRMASI</label>
          <input type="password" id="f-confpwd" placeholder="Ulangi password">
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-primary" onclick="changePassword()">Update Password</button>
      </div>
    </div>
  `;

  // Init image previews
  setTimeout(() => {
    initImagePreview('f-img','f-img-thumb');
    initImagePreview('f-aboutimg','f-aboutimg-thumb');
    qs('#f-img-thumb')?.classList.add('visible');
    qs('#f-aboutimg-thumb')?.classList.add('visible');
  }, 10);
}

window.saveProfile = function() {
  D.profile.name        = val('f-name');
  D.profile.displayName = val('f-displayname');
  D.profile.role        = val('f-role');
  D.profile.profileImage= val('f-img');
  D.profile.location    = val('f-loc');
  D.profile.email       = val('f-email');
  D.profile.linkedin    = val('f-linkedin');
  saveData(); toast('Profile disimpan ✓');
};
window.saveHero = function() {
  D.profile.heroHeadline = val('f-headline');
  D.profile.heroHighlight= val('f-highlight');
  D.profile.heroTagline  = val('f-tagline');
  D.profile.heroDesc     = val('f-herodesc');
  D.profile.heroCta1     = val('f-cta1');
  D.profile.heroCta2     = val('f-cta2');
  saveData(); toast('Hero section disimpan ✓');
};
window.saveAbout = function() {
  D.profile.aboutContent = val('f-about');
  D.profile.aboutImage   = val('f-aboutimg')||undefined;
  D.profile.aboutYears   = val('f-years');
  saveData(); toast('About section disimpan ✓');
};
window.changePassword = function() {
  const np = val('f-newpwd'), cp = val('f-confpwd');
  if (np.length<6) return toast('Password minimal 6 karakter','error');
  if (np!==cp) return toast('Password tidak cocok','error');
  localStorage.setItem(PASS_KEY, np);
  setVal('f-newpwd',''); setVal('f-confpwd','');
  toast('Password diubah ✓');
};

/* ══════════════════════════════════════════════
   SECTION: ARTICLES (Professional CMS)
   ══════════════════════════════════════════════ */
function articles(root) {
  const pub  = D.articles.filter(a=>a.status!=='draft').length;
  const dft  = D.articles.filter(a=>a.status==='draft').length;
  const feat = D.articles.filter(a=>a.featured).length;

  root.innerHTML = `
    <div class="sec-head">
      <div>
        <h2>Articles</h2>
        <div style="display:flex;gap:.5rem;margin-top:.5rem">
          <span class="status-badge published"><span class="status-dot"></span>${pub} Published</span>
          <span class="status-badge draft"><span class="status-dot"></span>${dft} Draft</span>
          <span class="status-badge featured"><span class="status-dot"></span>${feat} Featured</span>
        </div>
      </div>
      <button class="btn-primary" onclick="openArtModal(-1)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        Tulis Artikel
      </button>
    </div>

    <div class="form-card" style="padding:0;overflow:hidden">
      <!-- Filter bar -->
      <div style="padding:.875rem 1.25rem;border-bottom:1px solid var(--c-border);display:flex;gap:.5rem;flex-wrap:wrap;align-items:center">
        <button class="art-list-filter active" data-status="all" onclick="filterArtList('all',this)">Semua (${D.articles.length})</button>
        <button class="art-list-filter" data-status="published" onclick="filterArtList('published',this)">Published (${pub})</button>
        <button class="art-list-filter" data-status="draft" onclick="filterArtList('draft',this)">Draft (${dft})</button>
        <style>
          .art-list-filter{padding:.3rem .75rem;font-family:var(--f-ui);font-size:.76rem;font-weight:600;border:1.5px solid var(--c-border);border-radius:2rem;background:#fff;color:var(--c-muted);cursor:pointer;transition:all .15s}
          .art-list-filter:hover{color:var(--c-text);border-color:var(--c-text-2)}
          .art-list-filter.active{background:var(--c-blue);color:#fff;border-color:var(--c-blue)}
        </style>
      </div>
      <div id="art-list" style="padding:.5rem 0"></div>
    </div>
  `;
  renderArtList('all');
}

function filterArtList(status, btn) {
  qsAll('.art-list-filter').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderArtList(status);
}

function renderArtList(statusFilter='all') {
  const list = qs('#art-list');
  if (!list) return;
  const filtered = statusFilter==='all'
    ? D.articles
    : D.articles.filter(a=>a.status===statusFilter);

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty-state" style="margin:1rem">
        <div class="empty-icon">📝</div>
        <div>Belum ada artikel di status ini.</div>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map((a, i) => {
    const idx = D.articles.indexOf(a);
    const tags = Array.isArray(a.tags) ? a.tags : [];
    return `
      <div class="item-card" style="border-radius:0;border-left:none;border-right:none;border-top:${i?'1px solid var(--c-border)':'none'};border-bottom:none">
        <div class="item-thumb">
          <img src="${esc(a.image)}" alt="${esc(a.title)}"
               onerror="this.src='https://picsum.photos/seed/err${a.id}/200/120'">
        </div>
        <div class="item-body">
          <div class="item-meta">
            <span class="item-cat">${esc(a.category||'')}</span>
            <span class="status-badge ${a.status||'published'}">
              <span class="status-dot"></span>
              ${a.status==='draft'?'Draft':'Published'}
            </span>
            ${a.featured?'<span class="status-badge featured"><span class="status-dot"></span>Featured</span>':''}
            <span style="font-size:.68rem;color:var(--c-muted)">${fmtDate(a.date)} · ${a.readTime||5} min</span>
          </div>
          <div class="item-title">${esc(a.title)}</div>
          <div class="item-tags">
            ${tags.slice(0,4).map(t=>`<span class="item-tag-pill">${esc(t)}</span>`).join('')}
            ${tags.length>4?`<span class="item-tag-pill">+${tags.length-4}</span>`:''}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:.5rem;flex-shrink:0">
          <div class="reorder-btns">
            <button class="btn-reorder" onclick="moveArt(${idx},-1)" ${idx===0?'disabled':''} title="Naik">▲</button>
            <button class="btn-reorder" onclick="moveArt(${idx},1)"  ${idx===D.articles.length-1?'disabled':''} title="Turun">▼</button>
          </div>
          <button class="btn-icon-edit" onclick="openArtModal(${idx})">Edit</button>
          <button class="btn-icon-del"  onclick="deleteArt(${idx})">Hapus</button>
        </div>
      </div>
    `;
  }).join('');
}

window.moveArt = function(idx, dir) {
  const arr = D.articles;
  const newIdx = idx + dir;
  if (newIdx<0||newIdx>=arr.length) return;
  [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
  saveData(); renderArtList('all');
  qsAll('.art-list-filter').forEach(b=>{ if(b.dataset.status==='all') b.classList.add('active'); else b.classList.remove('active'); });
};

window.openArtModal = function(idx) {
  const isNew = idx===-1;
  const cats = (D.articleCategories||window.DEFAULT_DATA.articleCategories||[]);
  const a = isNew ? {
    status:'published', featured:false, tags:[], date:new Date().toISOString().slice(0,10), readTime:5
  } : D.articles[idx];
  const tags = Array.isArray(a.tags)?a.tags:[];

  const catOptions = cats.map(c =>
    `<option value="${esc(c)}" ${(a.category||''===c)?'selected':''}>${esc(c)}</option>`
  ).join('');

  openModal(
    isNew ? 'Tulis Artikel Baru' : 'Edit Artikel',
    `<!-- Status & Featured toggles -->
    <div class="toggle-row">
      <div class="toggle-info">
        <div class="toggle-label">Status Publikasi</div>
        <div class="toggle-desc">ON = Published · OFF = Draft (tidak ditampilkan di website)</div>
      </div>
      <label class="toggle-switch">
        <input type="checkbox" id="m-status" ${(a.status!=='draft')?'checked':''}>
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row" style="margin-bottom:1.25rem">
      <div class="toggle-info">
        <div class="toggle-label">Featured Article ⭐</div>
        <div class="toggle-desc">Ditampilkan lebih besar di bagian atas daftar artikel</div>
      </div>
      <label class="toggle-switch">
        <input type="checkbox" id="m-featured" ${a.featured?'checked':''}>
        <span class="toggle-slider"></span>
      </label>
    </div>

    <!-- Core fields -->
    <div class="fg">
      <label>JUDUL ARTIKEL</label>
      <input id="m-title" value="${esc(a.title||'')}" placeholder="Tulis judul yang menarik...">
    </div>
    <div class="fg-row">
      <div class="fg">
        <label>KATEGORI</label>
        <select id="m-cat">
          <option value="">-- Pilih Kategori --</option>
          ${catOptions}
        </select>
      </div>
      <div class="fg">
        <label>TANGGAL PUBLISH</label>
        <input type="date" id="m-date" value="${esc(a.date||new Date().toISOString().slice(0,10))}">
      </div>
    </div>

    <!-- Tags chip input -->
    <div class="fg">
      <label>TAGS</label>
      <div class="tag-input-wrap" id="m-tags-wrap"></div>
      <div class="tag-hint">Ketik tag lalu tekan <strong>Enter</strong> atau <strong>koma</strong> untuk menambah. Backspace untuk hapus tag terakhir.</div>
    </div>

    <!-- Cover image with preview -->
    <div class="fg">
      <label>COVER IMAGE URL</label>
      <div class="img-preview-wrap">
        <div class="img-preview-thumb ${a.image?'visible':''}" id="m-img-thumb">
          <img src="${esc(a.image||'')}" onerror="this.style.display='none'">
        </div>
        <div class="img-preview-input fg" style="margin-bottom:0">
          <input id="m-img" value="${esc(a.image||'')}" placeholder="https://picsum.photos/seed/.../1200/800">
        </div>
      </div>
    </div>

    <!-- Excerpt -->
    <div class="fg">
      <label>EXCERPT / RINGKASAN</label>
      <textarea id="m-excerpt" rows="4" placeholder="Ringkasan artikel yang menarik pembaca untuk melanjutkan...">${esc(a.excerpt||'')}</textarea>
    </div>

    <!-- Read time -->
    <div class="fg" style="max-width:160px">
      <label>ESTIMASI BACA (MENIT)</label>
      <input type="number" id="m-readtime" value="${a.readTime||5}" min="1" max="60">
      <div class="readtime-hint" id="m-readtime-hint">Isi manual atau otomatis dari excerpt</div>
    </div>`,

    `<button class="btn-secondary" onclick="closeModal()">Batal</button>
     <button class="btn-primary" onclick="saveArt(${idx})">
       ${isNew?'Publikasikan Artikel':'Simpan Perubahan'}
     </button>`
  );

  // Init tag input with existing tags
  setTimeout(() => {
    initTagInput('m-tags-wrap', tags);
    initImagePreview('m-img','m-img-thumb');
    // Set category selected
    if (a.category) {
      const sel = qs('#m-cat');
      if (sel) sel.value = a.category;
    }
    // Init read time hint from existing excerpt
    const excerptEl = qs('#m-excerpt');
    const rtHint = qs('#m-readtime-hint');
    if (excerptEl && rtHint) {
      excerptEl.addEventListener('input', () => {
        const est = calcReadTime(excerptEl.value);
        rtHint.textContent = `Estimasi otomatis: ~${est} menit`;
        const rtEl = qs('#m-readtime');
        if (rtEl && !rtEl._touched) rtEl.value = est;
      });
      qs('#m-readtime')?.addEventListener('change', function() { this._touched = true; });
    }
  }, 10);
};

window.saveArt = function(idx) {
  const title = val('m-title');
  if (!title) return toast('Judul wajib diisi','error');

  const tags  = getTags('m-tags-wrap');
  const catEl = qs('#m-cat');

  function slugify(str) {
    return str.toLowerCase()
      .replace(/[^a-z0-9\s-]/g,'')
      .replace(/\s+/g,'-')
      .replace(/-+/g,'-')
      .trim();
  }

  const art = {
    id:       idx===-1 ? Date.now() : D.articles[idx].id,
    slug:     slugify(title),
    status:   checked('m-status') ? 'published' : 'draft',
    featured: checked('m-featured'),
    category: catEl?.value||'',
    tags:     tags,
    date:     val('m-date')||new Date().toISOString().slice(0,10),
    readTime: parseInt(val('m-readtime'))||5,
    title:    title,
    excerpt:  val('m-excerpt'),
    image:    val('m-img')
  };

  if (idx===-1) D.articles.unshift(art);
  else          D.articles[idx] = art;

  saveData();
  closeModal();
  articles(qs('#admin-content'));
  updateSidebarBadges();
  toast(idx===-1 ? 'Artikel berhasil dipublikasikan! ✓' : 'Artikel diperbarui! ✓');
};

window.deleteArt = function(idx) {
  if (!confirm(`Hapus artikel "${D.articles[idx]?.title||''}"?`)) return;
  D.articles.splice(idx,1);
  saveData();
  articles(qs('#admin-content'));
  updateSidebarBadges();
  toast('Artikel dihapus');
};

/* ══════════════════════════════════════════════
   SECTION: PROJECTS
   ══════════════════════════════════════════════ */
function projects(root) {
  root.innerHTML = `
    <div class="sec-head">
      <h2>Projects</h2>
      <button class="btn-primary" onclick="openProjModal(-1)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        Tambah Project
      </button>
    </div>
    <div class="form-card" style="padding:0;overflow:hidden">
      <div id="proj-list" style="padding:.5rem 0"></div>
    </div>
  `;
  renderProjList();
}

function renderProjList() {
  const list = qs('#proj-list');
  if (!list) return;
  if (!D.projects.length) {
    list.innerHTML = `<div class="empty-state" style="margin:1rem"><div class="empty-icon">🎨</div><div>Belum ada project.</div></div>`;
    return;
  }
  list.innerHTML = D.projects.map((p,i) => `
    <div class="item-card" style="border-radius:0;border-left:none;border-right:none;border-top:${i?'1px solid var(--c-border)':'none'};border-bottom:none">
      <div class="item-thumb">
        <img src="${esc(p.image)}" alt="${esc(p.title)}" onerror="this.src='https://picsum.photos/seed/err${p.id}/200/120'">
      </div>
      <div class="item-body">
        <div class="item-meta"><span class="item-cat">${esc(p.subtitle)}</span></div>
        <div class="item-title">${esc(p.title)}</div>
        <div class="item-desc">${esc(p.description)}</div>
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;flex-shrink:0">
        <div class="reorder-btns">
          <button class="btn-reorder" onclick="moveProj(${i},-1)" ${i===0?'disabled':''}>▲</button>
          <button class="btn-reorder" onclick="moveProj(${i},1)"  ${i===D.projects.length-1?'disabled':''}>▼</button>
        </div>
        <button class="btn-icon-edit" onclick="openProjModal(${i})">Edit</button>
        <button class="btn-icon-del"  onclick="deleteProj(${i})">Hapus</button>
      </div>
    </div>
  `).join('');
}

window.moveProj = function(idx,dir) {
  const arr=D.projects, ni=idx+dir;
  if(ni<0||ni>=arr.length) return;
  [arr[idx],arr[ni]]=[arr[ni],arr[idx]];
  saveData(); renderProjList();
};

window.openProjModal = function(idx) {
  const isNew=idx===-1;
  const p=isNew?{}:D.projects[idx];
  openModal(
    isNew?'Tambah Project':'Edit Project',
    `<div class="fg"><label>JUDUL PROJECT</label><input id="m-title" value="${esc(p.title||'')}"></div>
    <div class="fg-row">
      <div class="fg"><label>SUBTITLE / TYPE</label><input id="m-subtitle" value="${esc(p.subtitle||'')}" placeholder="Desain Pengajaran"></div>
      <div class="fg"><label>KATEGORI</label>
        <select id="m-cat">
          <option value="desain-pengajaran" ${p.category==='desain-pengajaran'?'selected':''}>Desain Pengajaran</option>
          <option value="teknologi-lms"     ${p.category==='teknologi-lms'?'selected':''}>Teknologi LMS</option>
          <option value="strategi"          ${p.category==='strategi'?'selected':''}>Strategi Lain</option>
        </select>
      </div>
    </div>
    <div class="fg"><label>IMAGE URL</label>
      <div class="img-preview-wrap">
        <div class="img-preview-thumb ${p.image?'visible':''}" id="m-img-thumb"><img src="${esc(p.image||'')}"></div>
        <div class="img-preview-input fg" style="margin-bottom:0"><input id="m-img" value="${esc(p.image||'')}" placeholder="https://..."></div>
      </div>
    </div>
    <div class="fg"><label>DESKRIPSI</label><textarea id="m-desc" rows="3">${esc(p.description||'')}</textarea></div>`,
    `<button class="btn-secondary" onclick="closeModal()">Batal</button>
     <button class="btn-primary" onclick="saveProj(${idx})">${isNew?'Tambah Project':'Simpan Perubahan'}</button>`
  );
  setTimeout(() => initImagePreview('m-img','m-img-thumb'), 10);
};

window.saveProj = function(idx) {
  const title=val('m-title');
  if(!title) return toast('Judul wajib diisi','error');
  const item={id:idx===-1?Date.now():D.projects[idx].id,title,subtitle:val('m-subtitle'),
    category:qs('#m-cat').value,image:val('m-img'),description:val('m-desc')};
  if(idx===-1) D.projects.push(item); else D.projects[idx]=item;
  saveData(); closeModal(); renderProjList(); updateSidebarBadges();
  toast(idx===-1?'Project ditambahkan ✓':'Project diperbarui ✓');
};
window.deleteProj = function(idx) {
  if(!confirm(`Hapus "${D.projects[idx]?.title||''}"?`)) return;
  D.projects.splice(idx,1); saveData(); renderProjList(); updateSidebarBadges();
  toast('Project dihapus');
};

/* ══════════════════════════════════════════════
   SECTION: EXPERTISE
   ══════════════════════════════════════════════ */
function expertise(root) {
  root.innerHTML = `
    <div class="sec-head">
      <h2>Expertise</h2>
      <button class="btn-primary" onclick="openExpModal(-1)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        Tambah Keahlian
      </button>
    </div>
    <div class="form-card" style="padding:0;overflow:hidden">
      <div id="exp-list" style="padding:.5rem 0"></div>
    </div>
  `;
  renderExpList();
}

const iconLabels={monitor:'💻 Monitor',book:'📚 Buku',share:'🔗 Share',chart:'📊 Chart'};

function renderExpList() {
  const list=qs('#exp-list');
  if(!list) return;
  if(!D.expertise.length){
    list.innerHTML=`<div class="empty-state" style="margin:1rem"><div class="empty-icon">⭐</div><div>Belum ada keahlian.</div></div>`;
    return;
  }
  list.innerHTML=D.expertise.map((e,i)=>`
    <div class="item-card" style="border-radius:0;border-left:none;border-right:none;border-top:${i?'1px solid var(--c-border)':'none'};border-bottom:none">
      <div style="font-size:1.5rem;width:40px;text-align:center;flex-shrink:0">${(iconLabels[e.icon]||'⚡').split(' ')[0]}</div>
      <div class="item-body">
        <div class="item-title">${esc(e.title)}</div>
        <div class="item-desc">${esc(e.desc)}</div>
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;flex-shrink:0">
        <div class="reorder-btns">
          <button class="btn-reorder" onclick="moveExp(${i},-1)" ${i===0?'disabled':''}>▲</button>
          <button class="btn-reorder" onclick="moveExp(${i},1)" ${i===D.expertise.length-1?'disabled':''}>▼</button>
        </div>
        <button class="btn-icon-edit" onclick="openExpModal(${i})">Edit</button>
        <button class="btn-icon-del"  onclick="deleteExp(${i})">Hapus</button>
      </div>
    </div>
  `).join('');
}

window.moveExp=function(idx,dir){const arr=D.expertise,ni=idx+dir;if(ni<0||ni>=arr.length)return;[arr[idx],arr[ni]]=[arr[ni],arr[idx]];saveData();renderExpList();};
window.openExpModal=function(idx){
  const isNew=idx===-1,e=isNew?{}:D.expertise[idx];
  const ico=e.icon||'monitor';
  openModal(isNew?'Tambah Keahlian':'Edit Keahlian',
    `<div class="fg"><label>JUDUL</label><input id="m-title" value="${esc(e.title||'')}"></div>
    <div class="fg"><label>IKON</label><select id="m-icon">${Object.entries(iconLabels).map(([v,l])=>`<option value="${v}" ${ico===v?'selected':''}>${l}</option>`).join('')}</select></div>
    <div class="fg"><label>DESKRIPSI</label><textarea id="m-desc" rows="3">${esc(e.desc||'')}</textarea></div>`,
    `<button class="btn-secondary" onclick="closeModal()">Batal</button>
     <button class="btn-primary" onclick="saveExp(${idx})">${isNew?'Tambah':'Simpan'}</button>`
  );
};
window.saveExp=function(idx){
  const t=val('m-title');if(!t)return toast('Judul wajib diisi','error');
  const item={title:t,icon:qs('#m-icon').value,desc:val('m-desc')};
  if(idx===-1)D.expertise.push(item);else D.expertise[idx]=item;
  saveData();closeModal();renderExpList();updateSidebarBadges();
  toast(idx===-1?'Keahlian ditambahkan ✓':'Keahlian diperbarui ✓');
};
window.deleteExp=function(idx){
  if(!confirm('Hapus keahlian ini?'))return;
  D.expertise.splice(idx,1);saveData();renderExpList();updateSidebarBadges();
  toast('Keahlian dihapus');
};

/* ══════════════════════════════════════════════
   SECTION: DESIGN
   ══════════════════════════════════════════════ */
function design(root) {
  const p=D.profile;
  root.innerHTML=`
    <div class="form-card">
      <div class="form-card-title">CTA Banner</div>
      <div class="fg"><label>JUDUL (\\n = baris baru)</label><textarea id="f-ctatitle" rows="3">${esc(p.ctaTitle||'')}</textarea></div>
      <div class="fg"><label>DESKRIPSI</label><textarea id="f-ctadesc" rows="3">${esc(p.ctaDesc||'')}</textarea></div>
      <div class="fg-row">
        <div class="fg"><label>TOMBOL UTAMA</label><input id="f-ctap1" value="${esc(p.ctaPrimary||'')}"></div>
        <div class="fg"><label>TOMBOL SEKUNDER</label><input id="f-ctap2" value="${esc(p.ctaSecondary||'')}"></div>
      </div>
      <div class="form-actions"><button class="btn-primary" onclick="saveCTA()">Simpan CTA</button></div>
    </div>

    <div class="form-card">
      <div class="form-card-title">Angka Statistik</div>
      ${D.stats.map((s,i)=>`
        <div class="fg-row" style="margin-bottom:.75rem">
          <div class="fg"><label>STAT ${i+1} — NILAI</label><input id="sv${i}" value="${esc(s.value)}"></div>
          <div class="fg"><label>STAT ${i+1} — LABEL</label><input id="sl${i}" value="${esc(s.label)}"></div>
        </div>`).join('')}
      <div class="form-actions"><button class="btn-primary" onclick="saveStats()">Simpan Stats</button></div>
    </div>

    <div class="form-card">
      <div class="form-card-title">Kategori Artikel</div>
      <div class="fg">
        <label>DAFTAR KATEGORI (satu per baris)</label>
        <textarea id="f-cats" rows="8">${(D.articleCategories||[]).join('\n')}</textarea>
      </div>
      <div class="form-actions"><button class="btn-primary" onclick="saveCats()">Simpan Kategori</button></div>
    </div>

    <div class="form-card" style="border-color:rgba(220,38,38,.2)">
      <div class="form-card-title" style="color:var(--c-danger)">⚠️ Danger Zone</div>
      <p style="font-size:.82rem;color:var(--c-muted);margin-bottom:1.25rem;line-height:1.65">Reset semua konten ke data default. <strong>Tidak bisa diurungkan.</strong></p>
      <button class="btn-danger-outline" onclick="resetAll()">Reset ke Default</button>
    </div>
  `;
}

window.saveCTA=function(){
  D.profile.ctaTitle=val('f-ctatitle');D.profile.ctaDesc=val('f-ctadesc');
  D.profile.ctaPrimary=val('f-ctap1');D.profile.ctaSecondary=val('f-ctap2');
  saveData();toast('CTA disimpan ✓');
};
window.saveStats=function(){
  D.stats=D.stats.map((_,i)=>({value:val(`sv${i}`)||D.stats[i].value,label:val(`sl${i}`)||D.stats[i].label}));
  saveData();toast('Stats disimpan ✓');
};
window.saveCats=function(){
  const cats=val('f-cats').split('\n').map(c=>c.trim()).filter(Boolean);
  D.articleCategories=cats;saveData();toast('Kategori disimpan ✓');
};
window.resetAll=function(){
  if(!confirm('RESET semua data ke default? Tidak bisa diurungkan!'))return;
  localStorage.removeItem(STORAGE_KEY);
  D=JSON.parse(JSON.stringify(window.DEFAULT_DATA));
  renderSection(currentSec);updateSidebarBadges();
  toast('Data direset ke default ✓');
};
