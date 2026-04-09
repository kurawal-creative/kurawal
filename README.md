# Kurawal Project

Proyek full-stack dengan backend Express.js dan frontend React + Vite.

## Struktur Project

```
kurawal/
├── backend/          # Server Express.js dengan TypeScript
│   ├── src/
│   │   ├── app.ts    # Konfigurasi Express
│   │   └── server.ts # Entry point server
│   ├── package.json
│   └── tsconfig.json
├── frontend/         # Aplikasi React dengan Vite
│   ├── src/
│   │   ├── App.tsx   # Komponen utama
│   │   ├── pages/    # Halaman-halaman
│   │   └── types/    # Type declarations
│   ├── package.json
│   └── vite.config.ts
└── README.md         # File ini
```

## Prerequisites

-   Node.js (versi 18 atau lebih baru)
-   npm (package manager)

## Installation

1. Clone repository ini:

    ```bash
    git clone <url-repo>
    cd kurawal
    ```

2. Install dependencies untuk backend:

    ```bash
    cd backend
    npm install
    ```

3. Install dependencies untuk frontend:
    ```bash
    cd ../frontend
    npm install
    ```

## Running the App

### Development Mode

1. Jalankan backend:

    ```bash
    cd backend
    npm run dev
    ```

    Server akan berjalan di http://localhost:3000

2. Jalankan frontend (di terminal baru):
    ```bash
    cd frontend
    npm run dev
    ```
    Frontend akan berjalan di http://localhost:5173

### Production Build

1. Build frontend:

    ```bash
    cd frontend
    pnpm build
    ```

2. Jalankan backend (yang akan serve frontend build):
    ```bash
    cd backend
    npm start
    ```
    Aplikasi lengkap akan tersedia di http://localhost:3000

## API Endpoints

-   `GET /api` - Endpoint test, mengembalikan JSON {"hello": "world"}
-   `POST /api/auth/register` - Register user baru (body: {nama, email, password})
-   `POST /api/auth/login` - Login user (body: {email, password})
-   `GET /api/user/profile` - Get user profile (header: Authorization: Bearer <token>)
-   `GET /api/posts` - Get all posts (auth required)
-   `GET /api/posts/:id` - Get post by ID (auth required)
-   `POST /api/posts` - Create new post (body: {title, content}, auth required)
-   `PUT /api/posts/:id` - Update post (body: {title?, content?}, auth required, owner only)
-   `DELETE /api/posts/:id` - Delete post (auth required, owner only)

## Teknologi yang Digunakan

-   **Backend**: Express.js, TypeScript, Node.js
-   **Frontend**: React, Vite, TypeScript, React Router
-   **Package Manager**: pnpm
-   **Progress Bar**: nprogress

## Fitur

-   SPA (Single Page Application) dengan React Router
-   Progress bar saat navigasi (mirip YouTube)
-   Halaman 404 untuk route yang tidak ditemukan
-   Server-side rendering untuk static files

## Deployment

### Vercel (Frontend Only)

Proyek ini dikonfigurasi untuk deployment frontend ke Vercel. Backend Express.js perlu direstrukturisasi untuk serverless functions Vercel.

1. Push kode ke GitHub
2. Connect repository ke Vercel
3. Vercel akan otomatis mendeteksi konfigurasi di `vercel.json`
4. Frontend akan di-deploy sebagai static site

**Catatan**: Backend saat ini menggunakan Express server yang tidak kompatibel langsung dengan Vercel. Untuk deployment full-stack, pertimbangkan:

-   Restrukturisasi backend ke API routes Vercel
-   Menggunakan layanan backend terpisah (Railway, Render, dll.)
-   Menggunakan Vercel Functions untuk API endpoints

### Environment Variables

Pastikan untuk mengatur environment variables di Vercel:

-   `MONGODB_URI` - MongoDB connection string
-   `JWT_SECRET` - Secret key untuk JWT
-   `REFRESH_SECRET` - Secret key untuk refresh token
