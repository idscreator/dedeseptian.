// Storage Management
const STORAGE_KEYS = {
    WORKS: 'ds_works',
    ARTICLES: 'ds_articles',
    AUTH: 'ds_admin_auth',
    USER: 'ds_admin_user'
};

const InitialData = {
    profile: {
        name: 'Dede Septian',
        role: 'Praktisi Digital Learning & Knowledge Management',
        bio: 'Seorang profesional yang berdedikasi dalam membangun ekosistem pembelajaran digital yang efisien dan strategis. Berpengalaman dalam merancang arsitektur pengetahuan untuk organisasi skala besar.',
        philosophy: 'Teknologi hanyalah katalis; pengetahuan sejati tumbuh dalam budaya kolaborasi dan empati.',
        skills: ['Digital Learning Design', 'Knowledge Management Strategy', 'LMS Ecosystem', 'Instructional Design', 'AI in Education'],
        experience: [
            { year: '2022 - Sekarang', company: 'Global Tech Solution', role: 'Sr. Digital Learning Specialist', desc: 'Memimpin transformasi digital kurikulum pelatihan untuk 5.000+ karyawan dengan tingkat penyelesaian 95%.' },
            { year: '2020 - 2022', company: 'Innovation Edutech', role: 'Knowledge Management Lead', desc: 'Membangun framework berbagi pengetahuan yang meningkatkan efisiensi operasional tim sebesar 30%.' },
            { year: '2018 - 2020', company: 'Corporate Academy', role: 'Instructional Designer', desc: 'Merancang 50+ modul e-learning interaktif berbasis kompetensi untuk berbagai industri.' }
        ],
        education: [
            { year: '2017', school: 'Universitas Indonesia', degree: 'Sarjana Teknologi Pendidikan' },
            { year: '2021', school: 'Knowledge Management Institute', degree: 'Certified Knowledge Manager (CKM)' }
        ],
        socials: {
            linkedin: 'https://linkedin.com/in/idscreator',
            instagram: 'https://instagram.com/idscreator',
            tiktok: 'https://tiktok.com/@idscreator',
            email: 'idedeseptian.work@gmailcom'
        }
    },
    works: [
        {
            id: 'w1',
            title: 'Redesain Ekosistem LMS',
            category: 'Digital Learning',
            thumbnail: 'assets/images/work_mockup.png',
            summary: 'Mentransformasi pelatihan korporat melalui ekosistem pembelajaran yang terpadu.',
            content: 'Studi kasus mendalam mengenai proyek redesain LMS. Diimplementasikan untuk perusahaan Fortune 500, fokus pada pengalaman pengguna dan jalur pembelajaran berbasis data.',
            date: '2024-03-15'
        },
        {
            id: 'w2',
            title: 'Kerangka Strategi KM',
            category: 'Knowledge Management',
            thumbnail: 'https://4kwallpapers.com/images/walls/thumbs_3t/25866.png',
            summary: 'Mengembangkan kerangka kerja yang skalabel untuk berbagi pengetahuan organisasi.',
            content: 'Proyek ini melibatkan audit silo pengetahuan yang ada dan menciptakan taksonomi terstruktur serta model tata kelola untuk LSM global.',
            date: '2024-02-10'
        }
    ],
    articles: [
        {
            id: 'a1',
            title: 'Masa Depan AI dalam Pembelajaran Digital',
            seoTitle: 'Masa Depan AI dalam Pembelajaran Digital | Dede Septian',
            slug: 'masa-depan-ai-digital-learning',
            metaDescription: 'Menjelajahi transformasi revolusioner AI generatif dalam membentuk ekosistem pembelajaran personal yang adaptif dan efisien.',
            category: 'Digital Learning',
            tags: ['#AI', '#EduTech', '#Personalization'],
            excerpt: 'Menjelajahi bagaimana AI generatif membentuk ulang pengalaman belajar personal secara revolusioner di era digital.',
            author: 'Dede Septian',
            readTime: '5 mnt baca',
            thumbnail: 'https://4kwallpapers.com/images/walls/thumbs_3t/25866.png',
            altText: 'Ilustrasi AI dalam ekosistem pembelajaran digital',
            content: `
                <p>Kecerdasan Buatan (AI) bukan lagi sekadar tren teknologi masa depan; ia telah menjadi pilar utama dalam transformasi pendidikan modern. Dalam beberapa tahun terakhir, kita telah beralih dari pembelajaran massal yang kaku ke sistem yang jauh lebih personal dan adaptif.</p>
                <p>Penerapan AI Generatif memungkinkan instruktur untuk menciptakan konten pembelajaran yang disesuaikan secara otomatis untuk kebutuhan unik setiap siswa. Ini berarti materi yang terlalu sulit dapat disederhanakan, dan materi yang terlalu mudah dapat diperkaya secara instan.</p>
                <p>Namun, tantangan terbesar tetaplah pada <strong>kurasi pengetahuan</strong>. Bagaimana kita memastikan bahwa informasi yang dihasilkan AI akurat dan memiliki konteks pedagogis yang tepat? Di sinilah peran spesialis Digital Learning menjadi sangat krusial sebagai kurator dan desainer sistem.</p>
            `,
            cta: 'Ingin mendiskusikan implementasi AI di organisasi Anda? <a href="#collab">Hubungi saya untuk konsultasi</a>.',
            date: '20 April 2024'
        },
        {
            id: 'a2',
            title: 'Membangun Budaya Pengetahuan di Era Remote',
            seoTitle: 'Strategi Membangun Budaya Pengetahuan Kerja Remote',
            slug: 'budaya-pengetahuan-era-remote',
            metaDescription: 'Pelajari strategi membangun ekosistem berbagi pengetahuan yang kuat bagi tim remote untuk menjaga inovasi dan kolaborasi.',
            category: 'Knowledge Management',
            tags: ['#KM', '#RemoteWork', '#Collaboration'],
            excerpt: 'Mengapa teknologi saja tidak cukup untuk menjaga aliran pengetahuan dalam tim yang tersebar di era kerja remote.',
            author: 'Dede Septian',
            readTime: '4 mnt baca',
            thumbnail: 'https://4kwallpapers.com/images/walls/thumbs_3t/25866.png',
            altText: 'Tim kolaborasi remote menggunakan teknologi digital',
            content: `
                <p>Banyak organisasi menganggap bahwa menginstal platform seperti Slack atau Notion otomatis berarti mereka telah menerapkan Manajemen Pengetahuan (KM). Faktanya, teknologi hanyalah 20% dari solusi; sisanya adalah budaya dan proses.</p>
                <p>Dalam lingkungan kerja remote, "pengetahuan tacit" atau pengetahuan yang didapat dari percakapan santai di kantor seringkali hilang. Kita perlu merancang momen-momen kolaborasi yang sengaja dibuat untuk menangkap wawasan berharga ini ke dalam sistem formal.</p>
                <p>Strategi KM yang sukses di era remote berfokus pada <em>trust</em> dan <em>psychological safety</em>. Tanpa kedua hal ini, karyawan tidak akan mau berbagi kesalahan atau pelajaran yang mereka petik, yang merupakan sumber pembelajaran organisasi terbaik.</p>
            `,
            cta: 'Unduh panduan lengkap strategi KM Remote <a href="#">di sini</a>.',
            date: '15 April 2024'
        }
    ],
    settings: {
        categories: [
            { name: 'Digital Learning', color: '#4285f4' },
            { name: 'Knowledge Management', color: '#34a853' },
            { name: 'Technology', color: '#fbbc05' }
        ],
        tags: [
            { name: '#AI', color: '#4285f4' },
            { name: '#EduTech', color: '#34a853' },
            { name: '#RemoteWork', color: '#fbbc05' },
            { name: '#Collaboration', color: '#ea4335' },
            { name: '#Personalization', color: '#673ab7' }
        ],
        branding: {
            siteTitle: 'Dede Septian | Digital Learning',
            siteDescription: 'Portfolio Dede Septian, Spesialis Digital Learning & Knowledge Management.',
            heroLogoText: 'DS',
            heroTitle: 'Dede Septian.',
            heroSubtitle: 'Praktisi Digital Learning & Knowledge Management',
            heroText: 'Saya membangun ekosistem pembelajaran digital yang adaptif dan merancang strategi manajemen pengetahuan untuk organisasi masa depan.',
            ctaTitle: 'Mari Berkolaborasi',
            ctaText: 'Siap mengubah cara organisasi Anda belajar dan berbagi pengetahuan? Mari diskusikan bagaimana kita bisa membangun ekosistem yang tepat.',
            accentColor: '#4285F4'
        }
    },
    adminAuth: {
        users: [
            {
                id: 'u1',
                username: 'dd2',
                passwordHash: 'a0aea4f00d7661969b5fa6bf394d82e251f603c489bcbd26778d9f69863aede7', // log!n.dd2#website
                role: 'Pemilik',
                fullName: 'Dede Septian'
            }
        ]
    }
};

const Storage = {
    async init() {
        try {
            const paths = [
                { key: 'profile', data: InitialData.profile },
                { key: 'works', data: InitialData.works },
                { key: 'articles', data: InitialData.articles },
                { key: 'settings', data: InitialData.settings },
                { key: 'adminAuth', data: InitialData.adminAuth }
            ];

            for (const item of paths) {
                const docRef = db.collection('site_content').doc(item.key);
                const docSnap = await docRef.get();
                if (!docSnap.exists) {
                    console.log(`Seeding Initial ${item.key} to Firebase Firestore...`);
                    await docRef.set({ data: item.data });
                } else if (item.key === 'adminAuth') {
                    // Migration check: if old format (no users array), convert to new format
                    const existingData = docSnap.data().data;
                    if (!existingData.users) {
                        console.log("Migrating adminAuth to new multi-user format...");
                        const migratedData = {
                            users: [
                                {
                                    id: 'u1',
                                    username: existingData.username,
                                    passwordHash: existingData.passwordHash,
                                    role: 'Pemilik',
                                    fullName: 'Dede Septian'
                                }
                            ]
                        };
                        await docRef.set({ data: migratedData });
                    }
                }
            }
        } catch (e) {
            console.error("Firebase init error:", e);
        }
    },

    async getProfile() {
        try {
            const docSnap = await db.collection('site_content').doc('profile').get();
            return docSnap.exists ? { ...InitialData.profile, ...docSnap.data().data } : InitialData.profile;
        } catch (e) {
            console.error("Firebase error getting profile:", e);
            return InitialData.profile;
        }
    },

    async saveProfile(profile) {
        await db.collection('site_content').doc('profile').set({ data: profile });
    },

    async getWorks() {
        try {
            const docSnap = await db.collection('site_content').doc('works').get();
            return docSnap.exists ? docSnap.data().data : InitialData.works;
        } catch (e) {
            console.error("Firebase error getting works:", e);
            return InitialData.works;
        }
    },

    async saveWorks(works) {
        await db.collection('site_content').doc('works').set({ data: works });
    },

    async getArticles() {
        try {
            const docSnap = await db.collection('site_content').doc('articles').get();
            return docSnap.exists ? docSnap.data().data : InitialData.articles;
        } catch (e) {
            console.error("Firebase error getting articles:", e);
            return InitialData.articles;
        }
    },

    async saveArticles(articles) {
        await db.collection('site_content').doc('articles').set({ data: articles });
    },

    async getSettings() {
        try {
            const docSnap = await db.collection('site_content').doc('settings').get();
            return docSnap.exists ? docSnap.data().data : InitialData.settings;
        } catch (e) {
            console.error("Firebase error getting settings:", e);
            return InitialData.settings;
        }
    },

    async saveSettings(settings) {
        await db.collection('site_content').doc('settings').set({ data: settings });
    },

    async getAdminAuth() {
        try {
            const docSnap = await db.collection('site_content').doc('adminAuth').get();
            return docSnap.exists ? docSnap.data().data : InitialData.adminAuth;
        } catch (e) {
            console.error("Firebase error getting adminAuth:", e);
            return InitialData.adminAuth;
        }
    },

    async saveAdminAuth(auth) {
        await db.collection('site_content').doc('adminAuth').set({ data: auth });
    },

    // Multi-user authentication
    async authenticate(username, password) {
        const adminAuth = await this.getAdminAuth();
        const users = adminAuth.users || [];

        const msgUint8 = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const user = users.find(u => u.username === username && u.passwordHash === hashHex);

        if (user) {
            localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
                username: user.username,
                role: user.role,
                fullName: user.fullName,
                id: user.id
            }));
            return true;
        }
        return false;
    },

    getCurrentUser() {
        const userJson = localStorage.getItem(STORAGE_KEYS.USER);
        return userJson ? JSON.parse(userJson) : null;
    },

    isLoggedIn() {
        return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    },

    logout() {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
        localStorage.removeItem(STORAGE_KEYS.USER);
    }
};

Storage.init();
