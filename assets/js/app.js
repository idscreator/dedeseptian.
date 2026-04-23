// Landing Page Application Logic
document.addEventListener('DOMContentLoaded', async () => {
    initSmoothScroll();
    await renderContent();   // Wait for Firebase cards to render first
    initAnimations();
    setupModal();
    setupCTAInteraction();
    setupArticleSlider();
    setupWorksSlider();
});

function setupCTAInteraction() {
    const section = document.querySelector('.cta-section');
    const spotlight = document.querySelector('.cta-spotlight');

    if (!section || !spotlight) return;

    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        spotlight.style.left = `${x}px`;
        spotlight.style.top = `${y}px`;
    });
}

function initSmoothScroll() {
    const lenis = new Lenis();
    window.lenis = lenis; // Make lenis global
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Update Bottom Scroll Progress Bar
    lenis.on('scroll', (e) => {
        const progressBar = document.getElementById('scroll-progress-bar');
        if (progressBar) {
            const progress = (e.scroll / e.limit) * 100;
            progressBar.style.width = `${progress}%`;
        }
    });
}

async function renderContent() {
    const works = await Storage.getWorks();
    const articles = await Storage.getArticles();
    const settings = await Storage.getSettings();

    if (settings.branding) {
        applyBranding(settings.branding);
    }

    // Filter content: only show published or items under revision (show old version)
    // Exclude pending, draft, and archived
    const publishedWorks = works.filter(i => i.status === 'published' || i.status === 'revision' || !i.status);
    const publishedArticles = articles.filter(i => i.status === 'published' || i.status === 'revision' || !i.status);

    const worksGrid = document.getElementById('works-grid');
    const articlesGrid = document.getElementById('articles-grid');

    if (worksGrid) {
        worksGrid.innerHTML = publishedWorks.map(work => `
            <div class="card-work reveal" onclick="openDetails('work', '${work.id}')">
                <div class="card-image">
                    ${work.thumbnail ? `<img src="${work.thumbnail}" alt="${work.title}">` : ''}
                    <div class="card-overlay">
                        <div class="card-info">
                            <span class="card-category-label">${work.category}</span>
                            <h3 class="card-title-label">${work.title}</h3>
                        </div>
                        <div class="card-plus">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    if (articlesGrid) {
        articlesGrid.innerHTML = publishedArticles.map(article => `
            <div class="card-article reveal" onclick="openDetails('article', '${article.id}')">
                <div class="card-article-image">
                    ${article.thumbnail ? `<img src="${article.thumbnail}" alt="${article.altText || article.title}">` : ''}
                </div>
                <div class="card-article-content">
                    <h3 class="card-article-title">${article.title}</h3>
                    <div class="card-article-meta">
                        <span>${article.date}</span>
                        <span class="card-article-dot"></span>
                        <span>${article.category}</span>
                    </div>
                    <div class="card-article-cta">
                        Baca Selengkapnya <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function initAnimations() {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
    initHeroCanvas();

    // ── Helper: Stabilized Typing (no layout shift) ───────────────────────────
    function stabilizedTyping(elem, stagger = 0.03, delay = 0) {
        const originalHTML = elem.innerHTML;
        // Temporary container to parse HTML
        const temp = document.createElement('div');
        temp.innerHTML = originalHTML;

        // Recursively wrap text nodes in spans
        function wrapText(node) {
            if (node.nodeType === 3) { // Text node
                const text = node.textContent;
                const fragment = document.createDocumentFragment();
                for (let char of text) {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.style.opacity = '0';
                    span.style.display = 'inline-block';
                    span.style.whiteSpace = 'pre'; // Preserve spaces
                    fragment.appendChild(span);
                }
                node.parentNode.replaceChild(fragment, node);
            } else {
                for (let i = node.childNodes.length - 1; i >= 0; i--) {
                    wrapText(node.childNodes[i]);
                }
            }
        }
        wrapText(temp);
        elem.innerHTML = temp.innerHTML;

        const chars = elem.querySelectorAll('span');
        return gsap.to(chars, {
            opacity: 1,
            duration: 0.01,
            stagger: stagger,
            delay: delay,
            ease: 'none'
        });
    }

    // ════════════════════════════════════════════════
    // HERO – Perfectly Stabilized Entrance
    // ════════════════════════════════════════════════
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroTitle    = document.getElementById('hero-title');
    const heroText     = document.getElementById('hero-text');
    const heroBtns     = document.querySelector('.hero-btns');
    const heroImage    = document.querySelector('.hero-image');

    const heroTl = gsap.timeline({ delay: 0.3 });

    // 1. Badge - Reveal instantly or slight stagger
    if (heroSubtitle) {
        heroTl.add(stabilizedTyping(heroSubtitle, 0.04));
    }

    // 2. Title - The main event
    if (heroTitle) {
        heroTl.add(stabilizedTyping(heroTitle, 0.025), "-=0.2");
    }

    // 3. Description - Appears right after title
    if (heroText) {
        heroTl.fromTo(heroText, { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.3");
    }

    // 4. Buttons
    if (heroBtns) {
        heroTl.fromTo(heroBtns, { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.6");
    }

    // 5. Image
    if (heroImage) {
        gsap.fromTo(heroImage, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 1.5, delay: 0.5 });
    }

    // ════════════════════════════════════════════════
    // CTA SECTION – scroll reveal with typing
    // ════════════════════════════════════════════════
    const ctaTitle = document.getElementById('cta-title');
    const ctaText  = document.getElementById('cta-text');
    const ctaSection = document.querySelector('.cta-section');

    if (ctaSection && ctaTitle && ctaText) {
        ScrollTrigger.create({
            trigger: ctaSection,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                const ctaTl = gsap.timeline();
                ctaTl.add(stabilizedTyping(ctaTitle, 0.035));
                ctaTl.fromTo(ctaText, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "-=0.6");
                ctaTl.fromTo('.cta-buttons', { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.4");
            }
        });
    }

    // ════════════════════════════════════════════════
    // SECTION HEADERS – type/slide when scrolled into view
    // ════════════════════════════════════════════════
    document.querySelectorAll('.section-header').forEach(header => {
        const label = header.querySelector('.card-category');
        const h2    = header.querySelector('h2');
        if (label) typeOnScroll(label, label.innerText.trim());
        if (h2)    typeOnScroll(h2,    h2.innerText.trim());
    });

    // ════════════════════════════════════════════════
    // CARD GRIDS – stagger reveal when scrolled into view
    // (safe: cards rendered by Firebase before this runs)
    // ════════════════════════════════════════════════
    ['#works-grid', '#articles-grid'].forEach(gridId => {
        const grid = document.querySelector(gridId);
        if (!grid || !grid.children.length) return;
        gsap.fromTo(Array.from(grid.children),
            { opacity: 0, y: 36 },
            {
                opacity: 1, y: 0,
                duration: 0.65, ease: 'power3.out',
                stagger: 0.1,
                scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none none' }
            }
        );
    });

    // ════════════════════════════════════════════════
    // CTA SECTION – slide reveal
    // ════════════════════════════════════════════════
    const ctaCard = document.getElementById('cta-card');
    if (ctaCard) slideReveal(ctaCard, 0, true);

    // ════════════════════════════════════════════════
    // NAVBAR SHRINK ON SCROLL
    // ════════════════════════════════════════════════
    ScrollTrigger.create({
        start: 'top -50',
        onEnter: () => gsap.to('nav', { padding: '0.8rem 0', duration: 0.3 }),
        onLeaveBack: () => gsap.to('nav', { padding: '1.2rem 0', duration: 0.3 })
    });
    
    // Scroll indicator fade out
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        gsap.to(scrollIndicator, {
            opacity: 0,
            y: 20,
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: '200px top',
                scrub: true
            }
        });
        
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight * 0.9,
                behavior: 'smooth'
            });
        });
    }
}

function setupModal() {
    const modal = document.getElementById('content-modal');
    const closeBtn = document.querySelector('.close-modal');
    const modalContent = modal.querySelector('.modal-content');

    if (!closeBtn) return;

    closeBtn.onclick = () => {
        gsap.to(modalContent, { scale: 0.95, opacity: 0, duration: 0.3 });
        gsap.to(modal, {
            opacity: 0, duration: 0.3, onComplete: () => {
                modal.style.display = 'none';
                history.replaceState(null, null, ' '); // Clear slug without jump
                if (window.lenis) window.lenis.start();
                document.body.style.overflow = '';
                document.body.classList.remove('profile-modal-mode');
            }
        });
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            gsap.to(modalContent, { scale: 0.95, opacity: 0, duration: 0.3 });
            gsap.to(modal, {
                opacity: 0, duration: 0.3, onComplete: () => {
                    modal.style.display = 'none';
                    history.replaceState(null, null, ' '); // Clear slug without jump
                    if (window.lenis) window.lenis.start();
                    document.body.style.overflow = '';
                    document.body.classList.remove('profile-modal-mode');
                }
            });
        }
    };
}

async function openProfile() {
    try {
        const profile = await Storage.getProfile();
        const modal = document.getElementById('content-modal');
        const modalBody = document.getElementById('modal-body');

        if (!modal || !modalBody) return;

        const skillsHtml = (profile.skills || []).map(skill => `<span class="modal-tag-pill" style="background: var(--secondary); color: var(--text-main); border: 1px solid var(--border-color)">${skill}</span>`).join('');
        
        const experienceHtml = (profile.experience || []).map(exp => `
            <div class="timeline-item">
                <span class="timeline-year">${exp.year}</span>
                <span class="timeline-role">${exp.role}</span>
                <span class="timeline-company">${exp.company}</span>
                <p class="timeline-desc" style="margin-top:0.5rem; color: var(--text-muted); font-size: 0.95rem;">${exp.desc}</p>
            </div>
        `).join('');

        const educationHtml = (profile.education || []).map(edu => `
            <div style="margin-bottom: 2rem;">
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-google-blue); display: block; margin-bottom: 0.2rem;">${edu.year}</span>
                <span style="font-weight: 700; display: block; font-size: 1.1rem; color: var(--text-main);">${edu.degree}</span>
                <span style="font-size: 0.95rem; color: var(--text-muted);">${edu.school}</span>
            </div>
        `).join('');

        modalBody.innerHTML = `
            <div class="modal-header-img" style="background: ${profile.headerImage ? `url('${profile.headerImage}') center/cover no-repeat` : 'linear-gradient(160deg, #1a1a2e 0%, #2d2d44 100%)'}">
                <div class="modal-header-inner">
                    <div style="width:100%; height:100%; opacity:0.12; background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 24px 24px; position:absolute; top:0; left:0;"></div>
                    <div class="modal-header-overlay">
                        <span class="modal-header-cat" style="color: #1a73e8;">TENTANG SAYA</span>
                        <h1 class="modal-header-title">${profile.name || 'Dede Septian'}</h1>
                    </div>
                </div>
            </div>

                <div class="modal-body-container">
                    <!-- Block 1: Bio Summary (Full Width) -->
                    <div class="profile-about-full">
                        <p style="font-size: 1.4rem; line-height: 1.7; color: var(--text-main); font-weight: 500; max-width: 900px;">
                            ${profile.bio || ''}
                        </p>
                    </div>

                    <div class="profile-grid">
                        <!-- Block 2: Sidebar (Contact & Skills) -->
                        <div class="profile-sidebar">
                            <div style="margin-bottom: 2.5rem;">
                                <span class="modal-author-label" style="display:block; margin-bottom: 0.8rem;">Kontak</span>
                                <div class="social-icon-row" style="margin-top:0;">
                                    <a href="${profile.socials?.linkedin || '#'}" class="social-icon" target="_blank"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                                    <a href="mailto:${profile.socials?.email || ''}" class="social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></a>
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 2.5rem;">
                                <span class="modal-author-label" style="display:block; margin-bottom: 0.8rem;">Keahlian</span>
                                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                    ${skillsHtml}
                                </div>
                            </div>
                        </div>

                        <!-- Block 3: Main Content (Experience & Education) -->
                        <div class="profile-main">
                            <div style="margin-bottom: 3.5rem;">
                                <span class="modal-author-label" style="display:block; margin-bottom: 1.5rem;">Pengalaman Profesional</span>
                                <div class="timeline">
                                    ${experienceHtml}
                                </div>
                            </div>

                            <div>
                                <span class="modal-author-label" style="display:block; margin-bottom: 1.5rem;">Edukasi</span>
                                ${educationHtml}
                            </div>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        const modalContent = modal.querySelector('.modal-content');
        
        // Stop background scroll
        if (window.lenis) window.lenis.stop();
        document.body.style.overflow = 'hidden';
        document.body.classList.add('profile-modal-mode');

        gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.4 });
        gsap.fromTo(modalContent, { scale: 0.9, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'power4.out' });
    } catch (error) {
        console.error('Error opening profile:', error);
    }
}


async function openDetails(type, id) {
    const modal = document.getElementById('content-modal');
    const modalBody = document.getElementById('modal-body');
    const works = await Storage.getWorks();
    const articles = await Storage.getArticles();
    const settings = await Storage.getSettings();
    const data = type === 'work' ? works : articles;
    const item = data.find(i => i.id === id);

    if (item) {
        // Update URL hash with slug for SEO simulation
        if (item.slug) window.location.hash = `/artikel/${item.slug}`;

        const catColor = settings.categories.find(c => c.name === item.category)?.color || '#4285f4';

        const headerImg = `
            <div class="modal-header-img" style="${item.thumbnail ? '' : 'background: linear-gradient(160deg, #1a1a2e 0%, #2d2d44 100%);'}">
                ${item.thumbnail ? `<img src="${item.thumbnail}" alt="${item.altText || item.title}">` : ''}
                <div class="modal-header-overlay">
                    <span class="modal-header-cat" style="color:${catColor};">${item.category}</span>
                    <h1 class="modal-header-title">${item.title}</h1>
                </div>
            </div>
        `;

        const tagsHtml = item.tags && item.tags.length ? `
            <div class="modal-tags">
                <span class="modal-tags-label">TAG</span>
                ${item.tags.map(tag => {
                    const tagInfo = settings.tags.find(t => t.name === tag);
                    return `<span class="modal-tag-pill" style="background:${tagInfo ? tagInfo.color + '18' : 'var(--secondary)'}; color:${tagInfo ? tagInfo.color : 'var(--text-muted)'}; border:1px solid ${tagInfo ? tagInfo.color + '35' : 'var(--border-color)'}">#${tag}</span>`;
                }).join('')}
            </div>
        ` : '';

        const authorHtml = item.author ? `
            <div class="modal-author-card">
                <div class="modal-author-avatar">${item.author.charAt(0).toUpperCase()}</div>
                <div class="modal-author-info">
                    <span class="modal-author-label">Ditulis oleh</span>
                    <span class="modal-author-name">${item.author}</span>
                </div>
            </div>
        ` : '';

        const ctaHtml = item.cta ? `
            <div class="cta-box">
                <p>${item.cta}</p>
            </div>
        ` : '';

        modalBody.innerHTML = `
            ${headerImg}
            <div class="modal-inner-content">
                <div class="modal-body-container">
                    <div class="content-body">
                        ${item.content}
                    </div>
                    
                    ${tagsHtml}
                    ${ctaHtml}
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        const modalContent = modal.querySelector('.modal-content');

        // Stop background scroll
        if (window.lenis) window.lenis.stop();
        document.body.style.overflow = 'hidden';
        document.body.classList.remove('profile-modal-mode'); // Ensure removed for details modal

        gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.4 });
        gsap.fromTo(modalContent, { scale: 0.9, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' });
    }
}

// Hero Antigravity Ambient Particle Field
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');

    let width = canvas.width = hero.offsetWidth;
    let height = canvas.height = hero.offsetHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = hero.offsetWidth;
        height = canvas.height = hero.offsetHeight;
        // Re-initialize positions on resize
        particles.forEach(p => {
            p.x = Math.random() * width;
            p.y = Math.random() * height;
        });
    });

    // Website color palette from the screenshot – blues, cyan, slate, and the website accent
    const colors = [
        '#4285f4', // Google blue
        '#00a4ef', // MS blue / cyan
        '#ea4335', // warm red
        '#fbbc05', // warm yellow
        '#34a853', // green
        '#1e293b', // dark slate (subtle)
    ];

    const PARTICLE_COUNT = 160;
    const particles = [];

    // Mouse position (screen center is default so particles don't all cluster at 0,0)
    let mouse = { x: width / 2, y: height / 2, active: false };

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });

    hero.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    // Initialize persistent particle pool
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle(true));
    }

    function createParticle(random = false) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.2 + Math.random() * 0.4;
        return {
            x: random ? Math.random() * width : width / 2 + (Math.random() - 0.5) * width,
            y: random ? Math.random() * height : height / 2 + (Math.random() - 0.5) * height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            baseVx: Math.cos(angle) * speed,
            baseVy: Math.sin(angle) * speed,
            size: Math.random() * 2.5 + 1,         // elongated tick/dash shape size
            length: Math.random() * 6 + 3,          // dash length
            angle: angle,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 0.15 + Math.random() * 0.55,
            wobble: Math.random() * Math.PI * 2,    // phase for subtle pulsing
            wobbleSpeed: 0.01 + Math.random() * 0.02
        };
    }

    function drawParticle(p) {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';

        // Draw as a short dash/tick (matches Google Antigravity screenshot)
        const dx = Math.cos(p.angle) * p.length;
        const dy = Math.sin(p.angle) * p.length;
        ctx.beginPath();
        ctx.moveTo(p.x - dx / 2, p.y - dy / 2);
        ctx.lineTo(p.x + dx / 2, p.y + dy / 2);
        ctx.stroke();
        ctx.restore();
    }

    // Magnetic field radii
    const REPEL_RADIUS = 60;   // inner zone – pushes particles OUT (negative pole)
    const ATTRACT_RADIUS = 140; // outer ring – pulls particles IN (positive pole)

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
            // Wobble opacity
            p.wobble += p.wobbleSpeed;
            p.opacity = 0.15 + Math.abs(Math.sin(p.wobble)) * 0.45;

            if (mouse.active) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < REPEL_RADIUS) {
                    // ── NEGATIVE POLE: inner zone – REPEL outward ──
                    const force = (1 - dist / REPEL_RADIUS) * 0.28;
                    p.vx -= (dx / dist) * force;
                    p.vy -= (dy / dist) * force;

                } else if (dist < ATTRACT_RADIUS) {
                    // ── POSITIVE POLE: ring zone – ATTRACT toward boundary ring ──
                    const zoneFraction = (dist - REPEL_RADIUS) / (ATTRACT_RADIUS - REPEL_RADIUS);
                    const force = Math.sin(zoneFraction * Math.PI) * 0.14;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }
                // Outside ATTRACT_RADIUS → no magnetic influence
            }

            // Dampen back to base drift velocity
            p.vx += (p.baseVx - p.vx) * 0.025;
            p.vy += (p.baseVy - p.vy) * 0.025;

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Angle follows movement direction
            p.angle = Math.atan2(p.vy, p.vx);

            // Wrap around edges
            if (p.x < -20) p.x = width + 20;
            if (p.x > width + 20) p.x = -20;
            if (p.y < -20) p.y = height + 20;
            if (p.y > height + 20) p.y = -20;

            drawParticle(p);
        });

        requestAnimationFrame(animate);
    }

    animate();
}

function setupArticleSlider() {
    const grid = document.getElementById('articles-grid');
    const prev = document.getElementById('prev-article');
    const next = document.getElementById('next-article');

    if (!grid || !prev || !next) return;

    prev.addEventListener('click', () => {
        grid.scrollBy({ left: -grid.offsetWidth, behavior: 'smooth' });
    });

    next.addEventListener('click', () => {
        grid.scrollBy({ left: grid.offsetWidth, behavior: 'smooth' });
    });
}

function setupWorksSlider() {
    const grid = document.getElementById('works-grid');
    const prev = document.getElementById('prev-work');
    const next = document.getElementById('next-work');

    if (!grid || !prev || !next) return;

    prev.addEventListener('click', () => {
        grid.scrollBy({ left: -grid.offsetWidth, behavior: 'smooth' });
    });

    next.addEventListener('click', () => {
        grid.scrollBy({ left: grid.offsetWidth, behavior: 'smooth' });
    });
}
