# English Learning App — Project Documentation

> Ứng dụng học tiếng Anh dành cho người đi làm tại Việt Nam. Tập trung vào kỹ năng giao tiếp công sở, phát âm, và từ vựng thực tế.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Database | MongoDB via Mongoose 9 |
| Auth | JWT (jose) + bcryptjs |
| OAuth | Google OAuth 2.0 |
| Speech | Web Speech API (native browser) |
| Deployment | Vercel (recommended) |

## Quickstart

```bash
# 1. Cài dependencies
npm install

# 2. Tạo .env.local (xem docs/DEPLOYMENT.md)
cp .env.example .env.local

# 3. Chạy dev server
npm run dev
```

App chạy tại `http://localhost:3000`.

## Project Structure

```
english-app/
├── app/                    # Next.js App Router pages
│   ├── api/                # Route Handlers (REST API)
│   ├── admin/              # Admin panel pages
│   ├── auth/               # Login, signup, forgot password
│   └── ...                 # Feature pages
├── components/             # Reusable React components
│   ├── exercises/          # 7 exercise type components
│   └── shadowing/          # Shadowing player + word popup
├── hooks/                  # Custom React hooks
├── lib/                    # Pure utility libraries + data
├── models/                 # Mongoose schema definitions
├── contexts/               # React contexts (Auth)
├── public/                 # Static assets + PWA manifest
└── docs/                   # Project documentation (this folder)
```

## Quick Links

- [Features](./FEATURES.md) — Danh sách tính năng với trạng thái
- [Architecture](./ARCHITECTURE.md) — Kiến trúc hệ thống
- [API Reference](./API.md) — Tất cả API endpoints
- [Data Schema](./DATA_SCHEMA.md) — MongoDB models + localStorage
- [Deployment](./DEPLOYMENT.md) — Hướng dẫn deploy + performance
- [Roadmap](./ROADMAP.md) — Cải tiến tiếp theo
