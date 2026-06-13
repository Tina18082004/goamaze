# GoAmaze 🛒

A curated Amazon affiliate storefront built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, **MongoDB Atlas**, and **Cloudinary** — featuring a full admin panel for product management.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🛍️ Product storefront | Live data from MongoDB, with `products.json` fallback |
| 🔍 Voice search | Web Speech API mic button on the product grid |
| 🖼️ Cloudinary images | Drag-drop upload, preview, progress bar, CDN delivery |
| 🗑️ Image cleanup | Cloudinary assets auto-deleted when products are removed |
| 🔒 Admin panel | JWT-cookie auth, product CRUD, category management |
| 🌱 Auto-seed | One endpoint seeds all products, categories & default admin |
| 📱 Responsive | Mobile-first glassmorphism design |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url> goamaze
cd goamaze
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in the values below (full guide in each section):

```env
MONGODB_URI=<your atlas connection string>
JWT_SECRET=<32+ char random string>
CLOUDINARY_CLOUD_NAME=dvegrvnzl
CLOUDINARY_UPLOAD_PRESET=zudl2v7z
CLOUDINARY_API_KEY=          # optional — enables delete cleanup
CLOUDINARY_API_SECRET=       # optional — enables delete cleanup
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_NAME=GoAmaze Admin
ADMIN_EMAIL=admin@goamaze.com
ADMIN_PASSWORD=GoAmaze@2024!
```

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Seed the database

After setting `MONGODB_URI`, run the seed endpoint **once**:

```bash
curl -X POST http://localhost:3000/api/seed \
  -H "Authorization: Bearer <your JWT_SECRET value>"
```

Or use any REST client (e.g. Thunder Client, Postman, Insomnia).

This seeds:
- 16 curated products from `data/products.json`
- 5 categories (Home Decor, Lifestyle, Kitchen, Books, Entertainment)
- Default admin account (credentials from `.env.local`)

---

## 🍃 MongoDB Atlas Setup

> **Free tier (M0) is sufficient** for development and small production loads.

### Step-by-step

1. **Create account** — go to [cloud.mongodb.com](https://cloud.mongodb.com) and sign up / log in.

2. **Create a cluster**
   - Click **Create** → choose **M0 Free**
   - Pick any cloud provider + region (closest to you)
   - Give it any name (e.g. `GoAmaze`)

3. **Create a database user**
   - Left sidebar → **Database Access** → **Add New Database User**
   - Choose **Password** authentication
   - Username: `goamaze_user` (or any name)
   - Auto-generate a strong password — **save it**
   - Role: **Atlas Admin** (or `readWriteAnyDatabase`)
   - Click **Add User**

4. **Allow network access**
   - Left sidebar → **Network Access** → **Add IP Address**
   - For development: click **Allow Access from Anywhere** (`0.0.0.0/0`)
   - For production: add only your server's IP

5. **Get the connection string**
   - Left sidebar → **Clusters** → **Connect** → **Drivers**
   - Select **Node.js** / version **6.x or later**
   - Copy the URI — it looks like:
     ```
     mongodb+srv://goamaze_user:<password>@cluster0.abc12.mongodb.net/?retryWrites=true&w=majority&appName=GoAmaze
     ```
   - Replace `<password>` with your database user's password
   - Add the database name before `?`:
     ```
     mongodb+srv://goamaze_user:mypassword@cluster0.abc12.mongodb.net/goamaze?retryWrites=true&w=majority
     ```

6. **Paste into `.env.local`**
   ```env
   MONGODB_URI=mongodb+srv://goamaze_user:mypassword@cluster0.abc12.mongodb.net/goamaze?retryWrites=true&w=majority
   ```

7. **Run the seed endpoint** (see Quick Start step 4 above).

---

## ☁️ Cloudinary Setup

Your Cloudinary credentials are already configured:

```env
CLOUDINARY_CLOUD_NAME=dvegrvnzl
CLOUDINARY_UPLOAD_PRESET=zudl2v7z
```

### Verify your upload preset is unsigned

1. Log in at [cloudinary.com](https://cloudinary.com) → **Settings** → **Upload**
2. Find preset `zudl2v7z` under **Upload Presets**
3. Ensure **Signing Mode = Unsigned**
4. Optionally set **Folder = `goamaze/products`** and restrict to images only

### Enable image delete cleanup (optional)

When you delete a product in the admin panel, GoAmaze can also remove the image from Cloudinary. This requires a signed API call:

1. Cloudinary Dashboard → **Settings** → **API Keys**
2. Copy **API Key** and **API Secret**
3. Add to `.env.local`:
   ```env
   CLOUDINARY_API_KEY=your_key_here
   CLOUDINARY_API_SECRET=your_secret_here
   ```

If these are not set, product deletion still works — the Cloudinary asset simply stays (it can be cleaned up manually from the Cloudinary Media Library).

---

## 🔐 Admin Panel

### Access

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)

### Default credentials

| Field | Value |
|---|---|
| Email | `admin@goamaze.com` |
| Password | `GoAmaze@2024!` |

> **⚠️ Change these before deploying to production!**

### How to change admin credentials

**Option A — Before running seed** (recommended):
Edit `.env.local`:
```env
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=YourStrongPassword123!
```
Then run the seed endpoint.

**Option B — After seeding** (via MongoDB Atlas UI):
1. Atlas dashboard → **Browse Collections** → select `goamaze` database → `adminusers` collection
2. Find your admin document and update the `password` field
3. Note: the password is **bcrypt-hashed** — you cannot just type a plain-text password here. Use the Atlas UI's aggregation pipeline or add a `/api/admin/change-password` route.

**Option C — Easiest after seeding:**
Drop the `adminusers` collection in Atlas UI, update `.env.local`, and re-run the seed endpoint.

---

## 🎤 Voice Search

The product grid includes a **Web Speech API** mic button — no external packages required.

- Click the **🎤** button next to the search bar
- Speak your query (e.g. "desk lamp" or "kitchen")
- The search field updates in real-time
- Click **⏹** or wait for the recognition to finish

> **Browser support:** Chrome, Edge, Safari 15+. Firefox requires `media.webspeech.recognition.enable` flag. The button is hidden-graceful (shows an error toast) in unsupported browsers.

> **Language:** Configured for `en-IN` (Indian English) with automatic fallback to `en-US`.

---

## 🗂️ Project Structure

```
goamaze/
├── app/
│   ├── admin/
│   │   ├── page.tsx                     # Admin dashboard
│   │   ├── login/page.tsx               # Admin login
│   │   └── products/
│   │       ├── page.tsx                 # Product list
│   │       ├── new/page.tsx             # Add product
│   │       └── [id]/edit/page.tsx       # Edit product ← NEW
│   └── api/
│       ├── auth/login/route.ts          # POST login → JWT cookie
│       ├── auth/logout/route.ts         # POST logout → clear cookie
│       ├── products/
│       │   ├── route.ts                 # GET (list) / POST (create)
│       │   └── [id]/route.ts            # GET / PUT / DELETE + Cloudinary cleanup
│       ├── categories/route.ts          # GET categories
│       ├── upload/route.ts              # POST multipart → Cloudinary
│       ├── seed/route.ts                # POST seed (dev only)
│       ├── newsletter/route.ts          # POST subscribe
│       └── analytics/route.ts          # GET analytics
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── ImageUpload.tsx              # Drag-drop Cloudinary uploader
│   │   └── StatCard.tsx
│   ├── ProductCard.tsx                  # next/image + Cloudinary support ← UPDATED
│   ├── ProductGrid.tsx                  # MongoDB API + fallback + voice search ← UPDATED
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   └── ...
├── lib/
│   ├── cloudinary.ts                    # uploadToCloudinary + deleteFromCloudinary ← UPDATED
│   ├── db.ts                            # MongoDB connection singleton
│   └── auth.ts                          # JWT sign/verify/cookie helpers
├── models/
│   ├── Product.ts                       # Mongoose Product schema
│   ├── AdminUser.ts                     # Mongoose AdminUser (bcrypt)
│   ├── Category.ts
│   └── Subscriber.ts
├── data/
│   └── products.json                    # 16 curated products (fallback + seed source)
├── .env.local                           # 🔒 Never commit this
├── .env.example                         # Template for new devs
└── next.config.ts                       # Cloudinary + Unsplash image domains ← UPDATED
```

---

## 🔌 API Reference

### Public

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | List products (`?category=`, `?search=`, `?featured=true`, `?limit=`) |
| `GET` | `/api/products/:id` | Single product |
| `GET` | `/api/categories` | All categories |

### Admin (requires JWT cookie)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login → sets `goamaze_admin_token` cookie |
| `POST` | `/api/auth/logout` | Clears cookie |
| `POST` | `/api/products` | Create product |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product + Cloudinary asset |
| `POST` | `/api/upload` | Upload image → returns Cloudinary URL |

### Dev only

| Method | Endpoint | Auth |
|---|---|---|
| `POST` | `/api/seed` | `Authorization: Bearer <JWT_SECRET>` |

---

## 🚢 Deploy to Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Change `NEXT_PUBLIC_SITE_URL` to your Vercel domain
5. Deploy!
6. After deployment, run the seed endpoint once against your production URL

---

## 🛠️ Development Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

---

## 🔑 Generating a JWT Secret

```bash
# PowerShell (Windows)
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# macOS/Linux
openssl rand -base64 32
```

---

## 🧩 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + Vanilla CSS |
| Database | MongoDB Atlas (Mongoose 9) |
| Image CDN | Cloudinary (unsigned preset) |
| Auth | JWT via `jose` + HTTP-only cookies |
| Animation | Framer Motion |
| Validation | Zod |
| Voice Search | Web Speech API (native, no package) |

---

*Built with ❤️ by the GoAmaze team.*
