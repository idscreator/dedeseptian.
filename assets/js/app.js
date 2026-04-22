// Landing Page Application Logic
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    renderContent();
    initAnimations();
    setupModal();
    setupCTAInteraction();
});

function setupCTAInteraction() {
    const card = document.querySelector('.cta-card');
    const spotlight = document.querySelector('.cta-spotlight');

    if (!card || !spotlight) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
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
}

async function renderContent() {
    const works = await Storage.getWorks();
    const articles = await Storage.getArticles();
    const settings = await Storage.getSettings();

    if (settings.branding) {
        applyBranding(settings.branding);
    }

    const worksGrid = document.getElementById('works-grid');
    const articlesGrid = document.getElementById('articles-grid');

    if (worksGrid) {
        worksGrid.innerHTML = works.map(work => `
            <div class="card-work reveal" onclick="openDetails('work', '${work.id}')">
                <div class="card-image">
                    ${work.thumbnail ? `<img src="${work.thumbnail}" alt="${work.title}">` : ''}
                </div>
                <div class="card-body">
                    <span class="category-tag" style="background: ${(settings.categories.find(c => c.name === work.category)?.color || '#f1f3f4')}20; color: ${(settings.categories.find(c => c.name === work.category)?.color || 'var(--text-muted)')};">
                        ${work.category}
                    </span>
                    <h3>${work.title}</h3>
                    <p>${work.summary}</p>
                    <div class="cta-work">
                        Lihat Detail Proyek &rarr;
                    </div>
                </div>
            </div>
        `).join('');
    }

    if (articlesGrid) {
        articlesGrid.innerHTML = articles.map(article => `
            <div class="card-article reveal" onclick="openDetails('article', '${article.id}')">
                <div class="card-image">
                    ${article.thumbnail ? `<img src="${article.thumbnail}" alt="${article.altText || article.title}">` : ''}
                </div>
                <div class="card-body">
                    <div class="article-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>${article.date}</span>
                    </div>
                    <h3>${article.title}</h3>
                    <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-muted);">${article.summary || ''}</p>
                    <span class="category-tag" style="background: ${(settings.categories.find(c => c.name === article.category)?.color || '#f1f3f4')}20; color: ${(settings.categories.find(c => c.name === article.category)?.color || 'var(--text-muted)')};">
                        ${article.category}
                    </span>
                    <div class="cta-article">
                        Baca Selengkapnya &rarr;
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Fade in reveals
    gsap.utils.toArray('.reveal').forEach((elem) => {
        gsap.fromTo(elem,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: elem,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Navbar scroll effect
    ScrollTrigger.create({
        start: 'top -50',
        onEnter: () => gsap.to('nav', { padding: '0.8rem 0', duration: 0.3 }),
        onLeaveBack: () => gsap.to('nav', { padding: '1.2rem 0', duration: 0.3 })
    });
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

        if (!modal || !modalBody) {
            console.error('Modal elements not found');
            return;
        }

        const skillsHtml = (profile.skills || []).map(skill => `<span class="skill-pill">${skill}</span>`).join('');
        const experienceHtml = (profile.experience || []).map(exp => `
            <div class="timeline-item">
                <span class="timeline-year">${exp.year}</span>
                <span class="timeline-role">${exp.role}</span>
                <span class="timeline-company">${exp.company}</span>
                <p class="timeline-desc">${exp.desc}</p>
            </div>
        `).join('');
        const educationHtml = (profile.education || []).map(edu => `
            <div>
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-google-blue); display: block;">${edu.year}</span>
                <span style="font-weight: 700; display: block;">${edu.degree}</span>
                <span style="font-size: 0.9rem; color: var(--text-muted);">${edu.school}</span>
            </div>
        `).join('');

        modalBody.innerHTML = `
            <div class="modal-header-img" style="height: 200px; background: linear-gradient(135deg, #4285F4, #34A853);"></div>
            <div class="modal-inner-content">
                <div class="profile-grid">
                    <div class="profile-sidebar">
                        <div style="margin-top: -80px; margin-bottom: 2rem;">
                            <div style="width: 120px; height: 120px; background: white; border-radius: 24px; display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: 800; color: var(--accent-google-blue); box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 4px solid white;">
                                ${profile.name ? profile.name.split(' ').map(n => n[0]).join('') : 'DS'}
                            </div>
                        </div>
                        <h1 style="font-size: 2.2rem; margin-bottom: 0.5rem;">${profile.name || 'Dede Septian'}</h1>
                        <p style="color: var(--accent-google-blue); font-weight: 700; font-size: 1rem; margin-bottom: 1.5rem;">${profile.role || ''}</p>
                        
                        <div style="margin-bottom: 2.5rem;">
                            <span class="section-title-sm">Keahlian</span>
                            <div style="display: flex; flex-wrap: wrap;">
                                ${skillsHtml}
                            </div>
                        </div>

                        <div>
                            <span class="section-title-sm">Kontak</span>
                            <div class="social-icon-row">
                                <a href="${profile.socials?.linkedin || '#'}" class="social-icon" title="LinkedIn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                </a>
                                <a href="${profile.socials?.tiktok || '#'}" class="social-icon" title="TikTok">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                                </a>
                                <a href="${profile.socials?.instagram || '#'}" class="social-icon" title="Instagram">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                </a>
                                <a href="mailto:${profile.socials?.email || ''}" class="social-icon" title="Email">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="profile-main">
                        <div style="margin-bottom: 3rem;">
                            <span class="section-title-sm">Tentang</span>
                            <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-main);">${profile.bio || ''}</p>
                        </div>

                        <div style="margin-bottom: 3rem;">
                            <span class="section-title-sm">Pengalaman Profesional</span>
                            <div class="timeline">
                                ${experienceHtml}
                            </div>
                        </div>

                        <div>
                            <span class="section-title-sm">Pendidikan & Sertifikasi</span>
                            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                                ${educationHtml}
                            </div>
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

        const headerImg = item.thumbnail ? `
            <div class="modal-header-img">
                <img src="${item.thumbnail}" alt="${item.altText || item.title}">
            </div>
        ` : '';

        const tagsHtml = item.tags ? `
            <div class="tag-list" style="margin-top: 2rem;">
                ${item.tags.map(tag => {
                    const tagInfo = settings.tags.find(t => t.name === tag);
                    return `<span class="tag" style="font-size: 0.85rem; background: ${tagInfo ? tagInfo.color + '15' : 'var(--secondary)'}; color: ${tagInfo ? tagInfo.color : 'inherit'}; border: 1px solid ${tagInfo ? tagInfo.color + '30' : 'transparent'}; padding: 4px 12px; border-radius: 4px;">${tag}</span>`;
                }).join('')}
            </div>
        ` : '';

        const authorHtml = item.author ? `
            <div class="author-info">
                <div class="author-avatar">${item.author.charAt(0)}</div>
                <div class="author-details">
                    <span style="color: var(--text-muted); font-size: 0.75rem;">Penulis</span>
                    <span>${item.author}</span>
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
                <div class="article-meta" style="margin-bottom: 1rem;">
                    <span class="card-category" style="margin: 0; background: ${(settings.categories.find(c => c.name === item.category)?.color || '#f1f3f4')}20; color: ${(settings.categories.find(c => c.name === item.category)?.color || 'var(--accent-google-blue)')};">
                        ${item.category}
                    </span>
                    <span class="dot"></span>
                    <span>${item.date}</span>
                    ${item.readTime ? `<span class="dot"></span><span class="read-time">${item.readTime}</span>` : ''}
                </div>
                
                <h1 style="font-size: 2.8rem; margin-bottom: 2rem; line-height: 1.2;">${item.title}</h1>
                
                ${authorHtml}

                <div class="content-body">
                    ${item.content}
                </div>

                ${tagsHtml}

                ${ctaHtml}

                <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 3rem 0 2rem;">
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">&copy; 2024 dedeseptian. Artikel ini dilindungi hak cipta.</p>
                    <div style="display: flex; gap: 1rem;">
                        <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">BAGIKAN:</span>
                        <a href="#" style="color: var(--accent-google-blue); font-size: 0.8rem; text-decoration: none; font-weight: 700;">LinkedIn</a>
                        <a href="#" style="color: var(--accent-google-blue); font-size: 0.8rem; text-decoration: none; font-weight: 700;">Twitter</a>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        const modalContent = modal.querySelector('.modal-content');

        // Stop background scroll
        if (window.lenis) window.lenis.stop();
        document.body.style.overflow = 'hidden';

        gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.4 });
        gsap.fromTo(modalContent, { scale: 0.9, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' });
    }
}
