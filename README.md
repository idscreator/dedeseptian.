# dedeseptian. — Personal Website

Static personal website for Dede Septian. Fully deployable to **GitHub Pages** — no backend, no Google APIs required.

---

## 🚀 Quick Deploy to GitHub Pages

### Step 1: Upload to GitHub

1. Go to [github.com](https://github.com) → **New repository**
2. Name it: `dedeseptian` (or your GitHub username: `yourusername.github.io`)
3. Set to **Public**
4. Upload all files — maintaining this folder structure:

```
/
├── index.html
├── admin/
│   └── index.html
├── css/
│   ├── style.css
│   └── admin.css
├── js/
│   ├── defaults.js
│   ├── main.js
│   └── admin.js
└── README.md
```

### Step 2: Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` → folder: `/ (root)`
4. Click **Save**

### Step 3: Access Your Site

- **Website:** `https://yourusername.github.io/dedeseptian/`
- **Admin:** `https://yourusername.github.io/dedeseptian/admin/`

> If you named the repo `yourusername.github.io`, the URL will be `https://yourusername.github.io/`

---

## 🔐 Admin Panel

Access the admin panel at `/admin/` to edit all website content.

**Default password:**namatahunrilis**

> ⚠️ **Important:** Change this immediately after first login via the Profile section.

### What you can edit:
| Section | Fields |
|---------|--------|
| Profile | Name, role, photo, hero headline, tagline, about bio |
| Projects | Add/edit/delete portfolio cards |
| Expertise | Add/edit/delete expertise cards |
| Articles | Add/edit/delete article cards |
| Design | CTA banner text, stats numbers |

### Security note
The admin password is stored in `localStorage` (client-side only). This is suitable for a personal website — the content is public anyway, and your editing tools are just protected from casual tampering.

---

## 📁 How It Works

| File | Purpose |
|------|---------|
| `js/defaults.js` | Default content data (used when no edits made) |
| `js/main.js` | Reads data, renders all sections dynamically |
| `js/admin.js` | Admin CRUD logic, auth, modals, toast |
| `css/style.css` | Main website styles |
| `css/admin.css` | Admin panel styles |
| `index.html` | Main website markup |
| `admin/index.html` | Admin panel markup |

**Data flow:**
1. Admin edits content → saved to `localStorage`
2. Main site reads `localStorage` on load
3. Falls back to `DEFAULT_DATA` in `defaults.js` if nothing stored

---

## 🖼️ Adding Real Photos

The default site uses placeholder photos from [picsum.photos](https://picsum.photos).

To use your own photos:
1. Go to Admin Panel → **Profile** 
2. Paste image URLs in the Image URL fields
3. Use any image hosting: Cloudinary (free), GitHub itself, Imgbb, etc.

**Free image hosting options:**
- [Cloudinary](https://cloudinary.com) — free tier, CDN-hosted
- [ImgBB](https://imgbb.com) — simple drag-and-drop
- Upload directly to GitHub repo → use the raw URL

---

## 🎨 Customizing Colors

Open `css/style.css` and edit the CSS variables at the top:

```css
:root {
  --c-accent: #2563EB;   /* Blue accent color */
  --c-text:   #0A0A14;   /* Dark text */
  --c-bg:     #FFFFFF;   /* Page background */
}
```

---

## 📧 Contact

Built by Sita using Claude. Website content by Dede Septian.
