/**
 * defaults.js — dedeseptian. Content Model v2
 * Rich data structure: articles with tags[], status, featured, slug
 */
window.DEFAULT_DATA = {

  /* ─── PROFILE ────────────────────────────────── */
  profile: {
    name:          "dedeseptian.",
    displayName:   "Dede Septian",
    role:          "Digital Learning",
    profileImage:  "https://picsum.photos/seed/dede-hero/800/1000",
    aboutImage:    "https://picsum.photos/seed/dede-about/800/1000",
    location:      "Jakarta, Indonesia",
    linkedin:      "https://linkedin.com/in/dedeseptian",
    email:         "hello@dedeseptian.com",
    aboutYears:    "7+",

    // Hero
    heroTagline:   "Mitra Strategis Pembelajaran",
    heroHeadline:  "Menavigasi Masa Depan Pembelajaran.",
    heroHighlight: "Masa Depan",
    heroDesc:      "Praktisi Digital Learning & Knowledge Management. Saya berfokus pada pembangunan sistem yang memastikan setiap pengetahuan terwadahi dan setiap potensi terdidik.",
    heroCta1:      "Mulai Kolaborasi",
    heroCta2:      "Lihat Karya",

    // About
    aboutLabel:    "Siapa di Balik Layar",
    aboutContent:  "Saya adalah seorang profesional yang berdedikasi dalam menjembatani kesenjangan antara teknologi dan proses transfer pengetahuan. Dengan pengalaman lebih dari 7 tahun, saya membantu organisasi mentransformasi aset intelektual mereka menjadi keunggulan kompetitif yang berkelanjutan.",

    // CTA Banner
    ctaLabel:      "Siap Berkolaborasi?",
    ctaTitle:      "SIAP MEMBANGUN\nMASA DEPAN\nBERSAMA?",
    ctaDesc:       "Saya percaya bahwa nilai setiap pekerjaan tidak hanya pada tarif, namun pada dampak kolektif yang dihasilkan. Terbuka untuk diskusi proyek strategi.",
    ctaPrimary:    "Mulai Berkolaborasi",
    ctaSecondary:  "Jadwalkan Diskusi"
  },

  /* ─── STATS ──────────────────────────────────── */
  stats: [
    { value: "10K+",  label: "Pelajar Terjangkau" },
    { value: "25+",   label: "Sistem KM Terimplementasi" },
    { value: "15+",   label: "Tahun Berkolaborasi" },
    { value: "100%",  label: "Tingkat Kepuasan" }
  ],

  /* ─── EXPERTISE ──────────────────────────────── */
  expertise: [
    {
      icon: "monitor",
      title: "Pembelajaran Digital",
      desc:  "Merancang ekosistem pembelajaran digital yang adaptif dan berfokus pada perkembangan kompetensi berkelanjutan."
    },
    {
      icon: "book",
      title: "Manajemen Pengetahuan",
      desc:  "Strategi pengelolaan aset pengetahuan untuk meningkatkan kapasitas intelektual dan daya saing organisasi."
    },
    {
      icon: "share",
      title: "Strategi Konten",
      desc:  "Kurasi dan pengembangan konten edukasi berkualitas tinggi yang berdampak nyata bagi pertumbuhan kompetensi."
    },
    {
      icon: "chart",
      title: "Analitik Pembelajaran",
      desc:  "Pemantauan data berbasis bukti untuk mengoptimalkan proses dan kualitas transfer pengetahuan organisasi."
    }
  ],

  /* ─── PROJECTS ───────────────────────────────── */
  projects: [
    {
      id: 1, category: "desain-pengajaran",
      title: "Enterprise KM Framework",   subtitle: "Desain Pengajaran",
      image: "https://picsum.photos/seed/proj1km/800/540",
      description: "Framework manajemen pengetahuan skala enterprise dengan 3 layer knowledge architecture."
    },
    {
      id: 2, category: "teknologi-lms",
      title: "Adaptive LMS Ecosystem",    subtitle: "Teknologi LMS",
      image: "https://picsum.photos/seed/proj2lms/800/540",
      description: "Ekosistem LMS adaptif berbasis AI untuk pengalaman pembelajaran yang dipersonalisasi."
    },
    {
      id: 3, category: "desain-pengajaran",
      title: "Knowledge Assets Audit",    subtitle: "Desain Pengajaran",
      image: "https://picsum.photos/seed/proj3kaa/800/540",
      description: "Audit dan pemetaan komprehensif aset pengetahuan eksplisit dan tacit organisasi."
    },
    {
      id: 4, category: "teknologi-lms",
      title: "Digital Onboarding Flow",   subtitle: "Teknologi LMS",
      image: "https://picsum.photos/seed/proj4dob/800/540",
      description: "Alur onboarding digital terstruktur yang mempersingkat time-to-productivity hingga 40%."
    },
    {
      id: 5, category: "strategi",
      title: "KM Culture Roadmap",        subtitle: "Strategi",
      image: "https://picsum.photos/seed/proj5kmr/800/540",
      description: "Peta jalan 18-bulan transformasi budaya berbagi pengetahuan di organisasi 500+ karyawan."
    }
  ],

  /* ─── ARTICLES ───────────────────────────────── */
  articles: [
    {
      id:       1,
      slug:     "masa-depan-ai-digital-learning",
      status:   "published",
      featured: true,
      category: "Knowledge Management",
      tags:     ["AI", "Digital Learning", "Inovasi", "Future of Work"],
      date:     "2025-05-21",
      readTime: 5,
      title:    "Masa Depan AI dalam Dunia Digital Learning",
      excerpt:  "Bagaimana integrasi kecerdasan buatan mengubah cara kita merancang, menyampaikan, dan mengukur dampak pembelajaran organisasi secara fundamental.",
      image:    "https://picsum.photos/seed/art1ai/1200/800"
    },
    {
      id:       2,
      slug:     "km-vs-information-management",
      status:   "published",
      featured: false,
      category: "Knowledge Management",
      tags:     ["KM Strategy", "Information Architecture", "Organisasi"],
      date:     "2025-05-15",
      readTime: 4,
      title:    "Knowledge Management vs Information Management",
      excerpt:  "Mengurai perbedaan mendasar dari dua disiplin yang sering tertukar untuk membantu organisasi membangun sistem yang tepat.",
      image:    "https://picsum.photos/seed/art2km/800/540"
    },
    {
      id:       3,
      slug:     "konten-gen-z-tempat-kerja",
      status:   "published",
      featured: false,
      category: "Strategi Konten",
      tags:     ["Gen-Z", "Content Strategy", "Workplace Learning"],
      date:     "2025-05-10",
      readTime: 6,
      title:    "Strategi Konten untuk Gen-Z di Tempat Kerja",
      excerpt:  "Memahami pola konsumsi konten generasi terbaru untuk menciptakan learning experience yang relevan, engaging, dan berdampak.",
      image:    "https://picsum.photos/seed/art3gz/800/540"
    }
  ],

  /* ─── ARTICLE CATEGORIES (for admin dropdown) ── */
  articleCategories: [
    "Knowledge Management",
    "Digital Learning",
    "Strategi Konten",
    "Analitik Pembelajaran",
    "Teknologi LMS",
    "Organisasi & Budaya",
    "Case Study"
  ]
};
