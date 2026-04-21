/**
 * main.js — dedeseptian. v2 renderer
 * Supports: featured articles, tag arrays, category tabs, gradient hero
 */

const STORAGE_KEY = 'dedeseptian_data';

/* ── DATA ──────────────────────────────────────── */
function getData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return cloneDefaults();
  try {
    return deepMerge(cloneDefaults(), JSON.parse(raw));
  } catch (_) { return cloneDefaults(); }
}

function cloneDefaults() {
  return JSON.parse(JSON.stringify(window.DEFAULT_DATA));
}

function deepMerge(base, over) {
  const out = { ...base };
  for (const k in over) {
    if (over[k] !== null && typeof over[k] === 'object' && !Array.isArray(over[k])) {
      out[k] = deepMerge(base[k] || {}, over[k]);
    } else if (over[k] !== undefined) {
      out[k] = over[k];
    }
  }
  return out;
}

/* ── SVG ICONS ─────────────────────────────────── */
const ICONS = {
  monitor: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  book:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  share:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`,
  chart:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
};

/* ── FORMAT HELPERS ────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  } catch (_) { return iso; }
}

/* ── RENDERERS ─────────────────────────────────── */

function renderHero(p) {
  let headline = p.heroHeadline || '';
  if (p.heroHighlight) {
    headline = headline.replace(
      p.heroHighlight,
      `<span class="hl">${p.heroHighlight}</span>`
    );
  }
  setHTML('hero-headline', headline);
  setField('hero-eyebrow-text', p.heroTagline);
  setField('hero-desc', p.heroDesc);
  setField('hero-role', p.role);
  setField('hero-location', p.location);
  setAttr('hero-img', 'src', p.profileImage);
  setAttr('hero-img', 'alt', p.displayName || p.name);
  setField('hero-cta1', p.heroCta1);
  setField('hero-cta2', p.heroCta2);
}

function renderStats(stats) {
  const grid = qs('[data-section="stats"]');
  if (!grid) return;
  grid.innerHTML = stats.map((s, i) => `
    <div class="stat-item anim anim-d${Math.min(i+1,4)}">
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

function renderExpertise(items) {
  const grid = qs('[data-section="expertise"]');
  if (!grid) return;
  grid.innerHTML = items.map((item, i) => `
    <div class="exp-card anim anim-d${Math.min(i+1,4)}">
      <div class="exp-icon">${ICONS[item.icon] || ICONS.chart}</div>
      <div class="exp-title">${item.title}</div>
      <div class="exp-desc">${item.desc}</div>
    </div>
  `).join('');
}

function renderPortfolio(projects, filter = 'all') {
  const grid = qs('[data-section="portfolio"]');
  if (!grid) return;
  const list = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  if (!list.length) {
    grid.innerHTML = `<p style="grid-column:1/-1;padding:3rem;text-align:center;color:var(--c-text-3);font-size:.85rem">Tidak ada karya di kategori ini.</p>`;
    return;
  }
  grid.innerHTML = list.map((p, i) => `
    <div class="proj-card anim anim-d${Math.min(i+1,3)}">
      <div class="proj-img">
        <img src="${p.image}" alt="${p.title}" loading="lazy"
             onerror="this.src='https://picsum.photos/seed/err${p.id}/600/400'">
      </div>
      <div class="proj-body">
        <div class="proj-label">${p.subtitle}</div>
        <div class="proj-title">${p.title}</div>
      </div>
    </div>
  `).join('');
  observeAnims();
}

let allArticles = [];
let currentArtFilter = 'all';

function renderArticles(articles) {
  // Only published
  allArticles = articles.filter(a => a.status !== 'draft');

  buildArtCategoryTabs(allArticles);
  renderArticleGrid(allArticles);
}

function buildArtCategoryTabs(articles) {
  const tabsEl = qs('#art-category-tabs');
  if (!tabsEl) return;

  const cats = ['all', ...new Set(articles.map(a => a.category).filter(Boolean))];
  tabsEl.innerHTML = cats.map(cat => `
    <button class="art-filter-tab ${cat === 'all' ? 'active' : ''}" data-cat="${cat}">
      ${cat === 'all' ? 'Semua' : cat}
    </button>
  `).join('');

  tabsEl.querySelectorAll('.art-filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsEl.querySelectorAll('.art-filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentArtFilter = btn.dataset.cat;
      const filtered = currentArtFilter === 'all'
        ? allArticles
        : allArticles.filter(a => a.category === currentArtFilter);
      renderArticleGrid(filtered);
    });
  });
}

function renderArticleGrid(articles) {
  const grid = qs('[data-section="articles"]');
  if (!grid) return;

  if (!articles.length) {
    grid.innerHTML = `<p style="grid-column:1/-1;padding:3rem;text-align:center;color:var(--c-text-3);font-size:.85rem">Belum ada artikel di kategori ini.</p>`;
    return;
  }

  grid.innerHTML = articles.map((a, i) => {
    const isFeatured = a.featured && i === 0 && currentArtFilter === 'all';
    const tags = Array.isArray(a.tags) ? a.tags : (a.tags ? [a.tags] : []);

    return `
      <article class="art-card${isFeatured ? ' art-featured' : ''} anim anim-d${Math.min(i+1,3)}">
        <div class="art-img">
          <img src="${a.image}" alt="${a.title}" loading="${isFeatured ? 'eager' : 'lazy'}"
               onerror="this.src='https://picsum.photos/seed/err${a.id}/800/540'">
        </div>
        <div class="art-body">
          <div class="art-category">${a.category || ''}</div>
          <div class="art-tags">
            ${tags.slice(0, isFeatured ? 4 : 3).map(t => `<span class="art-tag">${t}</span>`).join('')}
          </div>
          <h3 class="art-title">${a.title}</h3>
          <p class="art-excerpt">${a.excerpt}</p>
          <div class="art-footer">
            <span class="art-date">${fmtDate(a.date)}</span>
            <a href="#" class="art-read">${a.readTime || 5} min read</a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  observeAnims();
}

function renderAbout(p) {
  setField('about-name', p.name);
  setField('about-desc', p.aboutContent);
  setField('about-years', p.aboutYears || '7+');
  setAttr('about-img', 'src', p.aboutImage || p.profileImage);
  setAttr('about-img', 'alt', p.displayName || p.name);
  if (p.linkedin) setAttr('about-linkedin', 'href', p.linkedin);
  setField('about-location-text', p.location);
}

function renderCTA(p) {
  setField('cta-title', p.ctaTitle || 'SIAP MEMBANGUN\nMASA DEPAN\nBERSAMA?');
  setField('cta-desc', p.ctaDesc);
  setField('cta-btn-1', p.ctaPrimary);
  setField('cta-btn-2', p.ctaSecondary);
  if (p.email) {
    const btn = qs('[data-field="cta-btn-1"]')?.closest?.('a');
    if (btn) btn.href = `mailto:${p.email}`;
  }
}

function renderName(p) {
  qsAll('[data-field="site-name"]').forEach(el => (el.textContent = p.name));
}

/* ── PORTFOLIO FILTER TABS ────────────────────── */
function initFilters(data) {
  const btns = qsAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPortfolio(data.projects, btn.dataset.filter);
    });
  });
}

/* ── NAVBAR ────────────────────────────────────── */
function initNavbar() {
  const nav    = qs('.navbar');
  const burger = qs('.nav-burger');
  const links  = qs('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  burger?.addEventListener('click', () => links.classList.toggle('open'));
  links?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
}

/* ── SCROLL ANIMATIONS ─────────────────────────── */
function observeAnims() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

  qsAll('.anim:not(.visible)').forEach(el => io.observe(el));
}

/* ── DOM HELPERS ───────────────────────────────── */
const qs    = sel => document.querySelector(sel);
const qsAll = sel => document.querySelectorAll(sel);
function setField(f, v) {
  const el = qs(`[data-field="${f}"]`);
  if (el && v !== undefined) el.textContent = v;
}
function setHTML(f, v) {
  const el = qs(`[data-field="${f}"]`);
  if (el && v !== undefined) el.innerHTML = v;
}
function setAttr(f, attr, v) {
  const el = qs(`[data-field="${f}"]`);
  if (el && v) el.setAttribute(attr, v);
}

/* ── INIT ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const data = getData();
  const p    = data.profile;

  renderName(p);
  renderHero(p);
  renderStats(data.stats);
  renderExpertise(data.expertise);
  renderPortfolio(data.projects);
  renderArticles(data.articles);
  renderAbout(p);
  renderCTA(p);

  initFilters(data);
  initNavbar();

  requestAnimationFrame(() => setTimeout(observeAnims, 80));
});
