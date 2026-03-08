<div align="center">

<img src="https://img.shields.io/badge/BaseraX-Hostel%20ERP-1A73E8?style=for-the-badge&logoColor=white" alt="BaseraX"/>

# BaseraX
### Hostel Management, Reimagined.

*A full-stack ERP platform that replaces paper registers, WhatsApp messages, and manual processes with a unified digital system for students, parents, wardens, and admins.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-basera--x.vercel.app-1A73E8?style=flat-square&logo=vercel&logoColor=white)](https://basera-x.vercel.app)
[![API Health](https://img.shields.io/badge/API-Live%20on%20Render-22c55e?style=flat-square&logo=render&logoColor=white)](https://baserax-1.onrender.com/api/health)
[![TypeScript](https://img.shields.io/badge/TypeScript-95%25-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://github.com/snehalchetry/BaseraX)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](LICENSE)

</div>

---

## 🏫 What is BaseraX?

Hostels in India still run on paper. Outing slips get lost. Maintenance complaints go unheard. Parents have zero visibility. Wardens drown in manual work.

**BaseraX fixes all of that.** One platform. Four roles. Zero paperwork.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🚪 Outing Requests
Students submit digital outing requests. Parents approve first, then wardens. Full timeline tracking with comments at every stage. Auto-generated pass codes on approval.

</td>
<td width="50%">

### 🔧 Maintenance Complaints
File complaints by category — electrical, plumbing, furniture, internet, and more. Attach photos, set priority, and track resolution status in real time.

</td>
</tr>
<tr>
<td width="50%">

### 🍽️ Food Menu
Wardens publish the weekly mess menu. Students see breakfast, lunch, snacks, and dinner for every day — no more "what's for dinner?" confusion.

</td>
<td width="50%">

### 🔔 Smart Notifications
Real-time alerts keep everyone in the loop — request updates, approvals, rejections, and complaint status changes delivered instantly.

</td>
</tr>
<tr>
<td width="50%">

### 👥 Role-Based Dashboards
Students, parents, wardens, and admins each get a purpose-built view with exactly the data and actions relevant to them.

</td>
<td width="50%">

### 🔐 Secure Auth
JWT-based authentication with access + refresh token rotation. Rate limiting, helmet headers, and input validation on every endpoint.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Tech |
|:---|:---|
| **Frontend** | React 18, TypeScript, Vite |
| **Backend** | Node.js, Express 5 |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | JWT — access + refresh tokens |
| **File Uploads** | Multer |
| **Logging** | Winston |
| **Frontend Deploy** | Vercel |
| **Backend Deploy** | Render |

</div>

---

## 📁 Project Structure

```
BaseraX/
├── client/                        # React + TypeScript (Vite)
│   ├── src/
│   │   ├── api/                   # Axios client & endpoint functions
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Route-level page components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── context/               # Auth & user context
│   │   └── types/                 # Shared TypeScript interfaces
│   └── vercel.json                # SPA rewrite rules
│
└── server/                        # Node.js + Express 5
    └── src/
        ├── controllers/           # Request handlers
        ├── routes/                # API route definitions
        ├── services/              # Business logic layer
        ├── models/                # Supabase query functions
        ├── middleware/            # auth, roleGuard, rateLimiter, validate
        ├── validators/            # express-validator schemas
        ├── utils/                 # ApiError, logger, passGenerator
        ├── config/                # db.ts (Supabase), env.ts
        ├── types/                 # Shared TypeScript types
        ├── app.ts                 # Express app setup
        └── server.ts              # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `18+`
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/snehalchetry/BaseraX.git
cd BaseraX
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Configure your `.env`:

```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

JWT_SECRET=your_super_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

Run the database migration — paste `supabase_migration.sql` into **Supabase → SQL Editor** and execute.

```bash
npm run dev      # starts on http://localhost:5000
```

### 3. Set up the frontend

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev      # starts on http://localhost:5173
```

---

## 🌐 Deployment

### Backend → Render

| Setting | Value |
|:---|:---|
| Root Directory | `server` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Node Version | `18` |

Add all `.env` variables in Render dashboard, plus:
```
CLIENT_URL = https://basera-x.vercel.app
NODE_ENV   = production
```

### Frontend → Vercel

Connect the GitHub repo and add:
```
VITE_API_URL = https://baserax-1.onrender.com/api
```

---

## 🧱 Challenges We Ran Into

| # | Challenge | Fix |
|:--|:---|:---|
| 01 | Backend never pushed to GitHub — Render had nothing to deploy | `git push` + set Root Directory to `server/` on Render |
| 02 | `app.ts` SPA fallback crashing on Render (`ENOENT: client/dist`) | Removed frontend serving entirely |
| 03 | CORS origin left as `yourdomain.com` placeholder | Read origin from `CLIENT_URL` environment variable |
| 04 | `app.use('/api/*')` crashes in Express 5 (`PathError`) | Updated to Express 5 syntax: `/api/*path` |
| 05 | Axios `baseURL: '/api'` hitting Vercel instead of Render | Switched to `import.meta.env.VITE_API_URL` |
| 06 | Direct URL navigation returning 404 on Vercel | Added `vercel.json` with SPA rewrite rule |
| 07 | Migrated from MongoDB + Mongoose to Supabase mid-build | Rewrote all models and services using `@supabase/supabase-js` |
| 08 | Unix commands (`grep`, `find`) failing on Windows PowerShell | Switched to PowerShell equivalents |

---

## 👤 Author

<div align="center">

**Snehal Chetry**

[![GitHub](https://img.shields.io/badge/GitHub-snehalchetry-181717?style=flat-square&logo=github)](https://github.com/snehalchetry)

*Built with ☕ and way too many Render redeploys.*

</div>

---

<div align="center">
<sub>MIT License · © 2026 Snehal Chetry</sub>
</div>
