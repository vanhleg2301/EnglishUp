# Deployment Guide

## Environment Variables

Tạo file `.env.local` với các biến sau:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/english-app?retryWrites=true&w=majority

# JWT
JWT_SECRET=<random 64-char string>

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Google OAuth
GOOGLE_CLIENT_ID=<từ Google Cloud Console>
GOOGLE_CLIENT_SECRET=<từ Google Cloud Console>

# Anthropic AI (cho AI Chat feature)
ANTHROPIC_API_KEY=<sk-ant-...>

# Stripe (cho payment)
STRIPE_SECRET_KEY=<sk_live_...>
STRIPE_WEBHOOK_SECRET=<whsec_...>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<pk_live_...>
```

## Deploy lên Vercel (khuyến nghị)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link project
vercel link

# 3. Set env vars (hoặc qua Vercel Dashboard)
vercel env add MONGODB_URI
vercel env add JWT_SECRET
# ... (thêm từng var)

# 4. Deploy
vercel --prod
```

## MongoDB Atlas Setup

1. Tạo cluster (M0 Free tier đủ cho dev)
2. Database: `english-app`, Collections tự tạo khi có dữ liệu
3. Network Access: Thêm `0.0.0.0/0` cho Vercel (hoặc Vercel IP ranges)
4. **Indexes cần tạo thủ công:**
   - `users`: `{ email: 1 }` (unique) — tự động từ schema
   - `progresses`: `{ userId: 1 }` (unique) — tự động từ schema
   - `auditlogs`: `{ createdAt: -1 }` — thêm thủ công để sort nhanh
   - `auditlogs`: TTL index `{ createdAt: 1 }` với `expireAfterSeconds: 2592000` (30 ngày)

## Performance — Tối ưu cho internet kém

### 1. Service Worker (đã cài)
File `public/sw.js` + `components/SwRegister.tsx` đã register SW.
Đảm bảo cache static assets + API responses quan trọng:

```js
// Trong sw.js, thêm cache strategy cho lesson data:
const CACHE_NAME = 'english-app-v1';
const PRECACHE = ['/app', '/lesson/1', '/vocabulary', '/shadowing'];
```

### 2. Font optimization
Dùng `next/font` (nếu chưa dùng):
```ts
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
```

### 3. Code splitting
Lazy load các component nặng:
```ts
const CertificateCanvas = dynamic(() => import('@/components/CertificateCanvas'), { ssr: false });
const ShadowingPlayer = dynamic(() => import('@/components/shadowing/ShadowingPlayer'), { ssr: false });
```

### 4. Image optimization
Thay `<img>` bằng `<Image>` từ `next/image`.

### 5. API caching headers
Lesson data tĩnh nên cache dài:
```ts
return NextResponse.json(data, {
  headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }
});
```

### 6. MongoDB connection pooling
File `lib/mongodb.ts` đã implement singleton pattern — không tạo connection mới mỗi request.

### 7. Next.js config tối ưu
```ts
// next.config.ts
const config = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
};
```

## Monitoring

- **Errors:** Vercel Analytics hoặc Sentry
- **DB:** MongoDB Atlas built-in metrics
- **Uptime:** Vercel tự monitor, thêm UptimeRobot nếu muốn alert

## PWA — Install trên iOS

1. Mở Safari → đến app URL
2. Share button → "Add to Home Screen"
3. App cần có `manifest.json` và icon 192x192, 512x512 trong `/public`
4. HTTPS là bắt buộc cho PWA

## Checklist trước khi go-live

- [ ] `JWT_SECRET` dài ≥ 32 chars, random
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Google OAuth callback URL trỏ đúng domain production
- [ ] Stripe webhook endpoint registered
- [ ] Test `npm run build` thành công locally
- [ ] `NEXT_PUBLIC_APP_URL` đúng domain
- [ ] MongoDB indexes đã tạo
