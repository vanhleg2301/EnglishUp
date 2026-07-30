# Roadmap — Cải tiến tiếp theo

## Priority 1 — Performance & Production Readiness

### P1.1 — Lazy loading heavy components
Hiện tại `CertificateCanvas` và `ShadowingPlayer` load ngay cả khi không dùng.
```ts
const CertificateCanvas = dynamic(() => import('@/components/CertificateCanvas'), { ssr: false });
```
**Impact:** Giảm initial bundle ~15-20KB, tải trang nhanh hơn trên 3G.

### P1.2 — Service Worker cache strategy
`public/sw.js` hiện chỉ register, chưa cache lesson data.  
Thêm pre-cache cho `/app`, `/lesson/1..5`, `/vocabulary` → app dùng được offline.

### P1.3 — MongoDB indexes ✅ Done
TTL index trên `auditlogs.createdAt` (tự xóa sau 30 ngày). Compound index `userId + createdAt`.  
Index `totalXP` trên `Progress` cho leaderboard query. Index `resetPasswordExpires` trên `User`.

### P1.4 — Error boundary ✅ Done
`components/ErrorBoundary.tsx` — class component wrap trong `AppShell`.  
Hiển thị friendly error UI + "Try again" button thay vì crash toàn app.

---

## Priority 2 — User Experience

### P2.1 — Push Notifications (PWA)
Gửi daily reminder lúc 8h sáng: "Bạn có 5 thẻ vocab cần ôn hôm nay!"  
Dùng Web Push API + service worker background sync.

### P2.2 — Real Leaderboard
Thay mock data bằng MongoDB aggregate query real users.  
Privacy: hiển thị tên ẩn danh (chỉ 2 ký tự đầu).
```js
db.progresses.aggregate([
  { $sort: { totalXP: -1 } },
  { $limit: 10 },
  { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } }
])
```

### P2.3 — Study Streak Reminder
Khi user vào app và streak sắp mất (chưa học hôm nay), hiện banner nhắc nhở với countdown.

### P2.4 — LinkedIn Certificate Sharing ✅ Done
Nút LinkedIn trong `CertificateCanvas` — share offsite URL + pre-filled text.  
Áp dụng cho cả 30-day lesson certificate và SG Sprint certificate.

### P2.5 — "Repeat Until Perfect" Mode trong Speaking
Nếu pronunciation score < 70%, tự động retry với prompt khuyến khích.

---

## Priority 3 — Features mới

### P3.1 — Weekly XP Report Email
Gửi email tóm tắt mỗi thứ 2: XP tuần này, streak, progress %.  
Dùng Resend hoặc SendGrid.

### P3.2 — Real SRS Backend Sync ✅ Done
API `/api/vocab-srs` sync với MongoDB. Fallback localStorage khi offline.

### P3.3 — Custom Vocabulary List
User thêm từ riêng vào SRS deck ngoài từ trong lesson.

### P3.4 — Recording Playback
Lưu recording ngắn (~10s) khi user nói trong Shadowing → cho nghe lại giọng mình.  
Dùng MediaRecorder API + Blob URL.

### P3.5 — AI Pronunciation Feedback
Gửi transcript + target text đến AI → nhận feedback chi tiết hơn scorePronunciation().

### P3.6 — Dark/Light Mode Toggle
Hiện tại chỉ có dark mode. Thêm toggle cho user chọn.

---

## Priority 4 — Admin & Operations

### P4.1 — Analytics Dashboard
Biểu đồ: DAU, lesson completion rate, phổ biến nhất của exercise types.  
Dùng MongoDB aggregate + Recharts.

### P4.2 — Content Management via Admin
Admin có thể thêm/sửa lesson và vocabulary trực tiếp từ admin panel (thay vì sửa code).  
Cần migrate lesson data từ static files vào MongoDB.

### P4.3 — A/B Testing Framework
Test different exercise sequences hoặc UI layouts để tối ưu engagement.

---

## Technical Debt

| Issue | File | Impact | Status |
|---|---|---|---|
| `any` type trong useSpeech.ts | `hooks/useSpeech.ts:98` | TypeScript safety | Open |
| Progress.ts dùng `userId: 'local'` default | `models/Progress.ts:15` | Confusing default | Open |
| Alert() trong useSpeech | `hooks/useSpeech.ts:106` | Bad UX, nên dùng toast | Open |
| Không có rate limiting trên API routes | `app/api/auth/*` | Security | ✅ Fixed |
| Stripe webhook chưa verify signature | `app/api/payment/*` | Security risk | Open |
| Không có Error Boundary | Pages crash toàn app | UX | ✅ Fixed |
| MongoDB thiếu indexes | `models/AuditLog, Progress, User` | Performance | ✅ Fixed |
