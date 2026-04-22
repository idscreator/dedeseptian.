# 🚀 dedeseptian. — Premium Personal Portfolio & Knowledge Hub

Sebuah portofolio profesional tingkat tinggi yang dirancang khusus untuk spesialis **Digital Learning & Knowledge Management**. Dibangun dengan estetika modern yang terinspirasi oleh sistem desain Microsoft dan Google, serta didukung oleh infrastruktur *real-time* yang tangguh.

---

## ✨ Fitur Unggulan

- 💎 **Premium UI/UX**: Desain bersih dengan *white-space* luas, tipografi kelas dunia, dan palet warna profesional.
- 🎭 **GSAP Masterclass Animations**:
  - *Stabilized Typing Effect*: Animasi mengetik tanpa pergeseran layout.
  - *Cascading Entrance*: Konten muncul secara mengalir dari atas ke bawah.
  - *Interactive Spotlight*: Efek pencahayaan dinamis yang mengikuti kursor pada seksi CTA.
- 🛠️ **Powerful Admin Dashboard**:
  - Pengelolaan **Karya Pilihan** (Portfolio) & **Artikel Wawasan** (Blog) secara real-time.
  - **Design Lab**: Ubah warna aksen, logo, dan teks utama langsung dari dashboard tanpa menyentuh kode.
  - **Live Preview**: Lihat perubahan desain secara instan di dalam admin panel sebelum disimpan.
- 💾 **Real-time Persistence**: Terintegrasi penuh dengan **Firebase Firestore** untuk penyimpanan data yang aman dan cepat.
- 🔐 **Account Management**: Sistem keamanan dengan hashing SHA-256 dan pengaturan profil admin mandiri.

---

## 🛠️ Arsitektur Teknologi

- **Frontend**: HTML5, Vanilla CSS (Custom Properties), JavaScript (ES6+).
- **Animasi**: [GSAP](https://greensock.com/gsap/) (ScrollTrigger, TextPlugin).
- **Backend-as-a-Service**: [Firebase](https://firebase.google.com/) (Firestore).
- **Rich Text Editor**: [Quill.js](https://quilljs.com/).

---

## 🚀 Panduan Instalasi & Deployment

### 1. Konfigurasi Firebase
1. Buat proyek baru di [Firebase Console](https://console.firebase.google.com/).
2. Aktifkan **Cloud Firestore** dalam *Production* atau *Test Mode*.
3. Daftarkan aplikasi web dan salin konfigurasi Firebase Anda.
4. Tempelkan konfigurasi tersebut ke file: `assets/js/firebase-config.js`.

### 2. Deployment ke GitHub Pages
1. Push seluruh folder ini ke repositori GitHub baru.
2. Masuk ke **Settings** > **Pages**.
3. Pilih branch `main` dan folder `/(root)`.
4. Klik **Save**. Portofolio Anda akan aktif dalam hitungan menit.

---

## 🔐 Akses Admin

Dashboard Admin dapat diakses melalui: `domain-anda.com/admin/`

**Kredensial Default:**
- **Username**: `dd2`
- **Password**: `log!n.dd2#website`

> [!IMPORTANT]
> Segera ubah password Anda melalui menu **Profil Admin** di dalam dashboard setelah login pertama kali.

---

## 📁 Struktur Folder Utama

```text
/
├── admin/                  # Dashboard Manager (HTML & Scripts)
├── assets/
│   ├── css/                # Desain sistem & style admin
│   ├── js/
│   │   ├── app.js          # Logika animasi & interaksi utama
│   │   ├── storage.js      # Jembatan data Firestore & logic auth
│   │   └── firebase-config.js
│   └── images/             # Media & aset visual
├── index.html              # Halaman Landing Utama
└── README.md
```

---

Dibuat dengan dedikasi untuk profesionalisme digital.
**© 2024 Dede Septian.**
