/**
 * main.js — dedeseptian. website renderer
 * Reads data from localStorage (edited via admin panel),
 * falls back to DEFAULT_DATA defined in defaults.js
 */

const STORAGE_KEY = 'dedeseptian_data';

/* ──────────────────────────────────────
   DATA
   ────────────────────────────────────── */
function getData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(window.DEFAULT_DATA);
  try {
    // Deep-merge stored data with defaults so new keys are always present
    return deepMerge(structuredClone(window.DEFAULT_DATA), JSON.parse(raw));
  } catch (_) {
    return structuredClone(window.DEFAULT_DATA);
  }
}

function deepMerge(base, override) {
  const out = { ...base };
  for (const key in override) {
    if (
      override[key] !== null &&
      typeof override[key] === 'object' &&
      !Array.isArray(override[key])
    ) {
      out[key] = deepMerge(base[key] || {}, override[key]);
    } else if (override[key] !== undefined) {
      out[key] = override[key];
    }
  }
  return out;
}

/* ──────────────────────────────────────
   ICON SVGs
   ────────────────────────────────────── */
const ICONS = {
  monitor: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  book:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  share:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`,
  chart:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  pin:     `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  arrow:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
  linkedin:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  location:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
};

/* ──────────────────────────────────────
   RENDERERS
   ────────────────────────────────────── */

/** Hero section */
function renderHero(p) {
  // Highlight keyword
  let headline = p.heroHeadline || '';
  if (p.heroHighlight) {
    headline = headline.replace(
      p.heroHighlight,
      `<span class="hl">${p.heroHighlight}</span>`
    );
  }

  setField('hero-eyebrow', p.heroTagline);
  setHTML('hero-headline', headline);
  setField('hero-desc', p.heroDesc);
  setField('hero-role', p.role);
  setField('hero-location', p.location);
  setAttr('hero-img', 'src', p.profileImage);
  setAttr('hero-img', 'alt', p.name);
}

/** Stats row */
function renderStats(stats) {
  const grid = qs('[data-section="stats"]');
  if (!grid) return;
  grid.innerHTML = stats.map((s, i) => `
    <div class="stat-item anim anim-d${Math.min(i+1,3)}">
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

/** Expertise cards */
function renderExpertise(items) {
  const grid = qs('[data-section="expertise"]');
  if (!grid) return;
  grid.innerHTML = items.map((item, i) => `
    <div class="exp-card anim anim-d${Math.min(i+1,3)}">
      <div class="exp-icon">${ICONS[item.icon] || ICONS.chart}</div>
      <div class="exp-title">${item.title}</div>
      <div class="exp-desc">${item.desc}</div>
    </div>
  `).join('');
}

/** Portfolio grid (filtered) */
function renderPortfolio(projects, filter = 'all') {
  const grid = qs('[data-section="portfolio"]');
  if (!grid) return;
  const list = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  if (!list.length) {
    grid.innerHTML = `<p style="color:var(--c-text-3);font-size:.85rem;grid-column:1/-1;padding:2rem 0">Belum ada karya di kategori ini.</p>`;
    return;
  }
  grid.innerHTML = list.map((p, i) => `
    <div class="proj-card anim anim-d${Math.min(i+1,3)}" data-cat="${p.category}">
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

/** Articles grid */
function renderArticles(articles) {
  const grid = qs('[data-section="articles"]');
  if (!grid) return;
  grid.innerHTML = articles.map((a, i) => `
    <article class="art-card anim anim-d${Math.min(i+1,3)}">
      <div class="art-img">
        <img src="${a.image}" alt="${a.title}" loading="lazy"
             onerror="this.src='https://picsum.photos/seed/err${a.id}/600/400'">
      </div>
      <div class="art-body">
        <div class="art-meta">
          <div class="art-tags">
            <span class="art-tag">${a.category}</span>
            <span class="art-tag">${a.tag}</span>
          </div>
          <span class="art-date">${a.date}</span>
        </div>
        <h3 class="art-title">${a.title}</h3>
        <p class="art-excerpt">${a.excerpt}</p>
        <a href="#" class="art-more">Baca Selengkapnya</a>
      </div>
    </article>
  `).join('');
}

/** About section */
function renderAbout(p) {
  setField('about-name', p.name);
  setField('about-desc', p.aboutContent);
  setField('about-years', p.aboutYears || '7+');
  setAttr('about-img', 'src', p.aboutImage || p.profileImage);
  setAttr('about-img', 'alt', p.name);
  if (p.linkedin) setAttr('about-linkedin', 'href', p.linkedin);
  setField('about-location', p.location);
}

/** CTA banner */
function renderCTA(p) {
  setField('cta-eyebrow', p.ctaLabel);
  setField('cta-title', p.ctaTitle || 'SIAP MEMBANGUN\nMASA DEPAN\nBERSAMA?');
  setField('cta-desc', p.ctaDesc);
  setField('cta-btn-1', p.ctaPrimary);
  setField('cta-btn-2', p.ctaSecondary);
  if (p.email) {
    const btn1 = qs('[data-field="cta-btn-1"]');
    if (btn1) btn1.closest('a').href = `mailto:${p.email}`;
  }
}

/** Name placeholders (navbar logo, footer logo) */
function renderName(p) {
  qsAll('[data-field="site-name"]').forEach(el => el.textContent = p.name);
}

/* ──────────────────────────────────────
   FILTER TABS
   ────────────────────────────────────── */
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

/* ──────────────────────────────────────
   NAVBAR
   ────────────────────────────────────── */
function initNavbar() {
  const nav    = qs('.navbar');
  const burger = qs('.nav-burger');
  const links  = qs('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  burger?.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close menu on link click (mobile)
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ──────────────────────────────────────
   SCROLL ANIMATIONS
   ────────────────────────────────────── */
function observeAnims() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 55);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  qsAll('.anim:not(.visible)').forEach(el => io.observe(el));
}

/* ──────────────────────────────────────
   DOM HELPERS
   ────────────────────────────────────── */
function qs(sel)        { return document.querySelector(sel); }
function qsAll(sel)     { return document.querySelectorAll(sel); }
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

/* ──────────────────────────────────────
   INIT
   ────────────────────────────────────── */
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

  // Kick off initial animations after short delay
  requestAnimationFrame(() => {
    setTimeout(observeAnims, 80);
  });
});
