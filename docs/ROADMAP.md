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

### P1.3 — MongoDB indexes
Thêm index `{ createdAt: -1 }` cho `auditlogs` collection.  
Thêm TTL index cho audit logs (tự xóa sau 30 ngày).

### P1.4 — Error boundary
Wrap các page phức tạp với React Error Boundary để tránh toàn app crash.

---

## Priority 2 — User Experience

### P2.1 — Push Notifications (PWA)
Gửi daily reminder lúc 8h sáng: "Bạn có 5 thẻ vocab cần ôn hôm nay!"  
Dùng Web Push API + service worker background sync.

### ✅ P2.0 — iOS App Store submission (Capacitor)
Bọc web app bằng Capacitor thành WKWebView native shell, ẩn luồng thanh toán Stripe trong app iOS (Apple Guideline 3.1.1), thêm icon/splash cho `ios/App`. Xem `docs/DEPLOYMENT.md` mục "iOS App (Capacitor)" để build/submit qua Codemagic (không cần Mac). Còn lại: đăng ký Apple Developer Program, tạo App Store Connect listing, submit review — thực hiện thủ công ngoài repo.

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

### P2.4 — LinkedIn Certificate Sharing
Thêm nút "Share to LinkedIn" sau khi download certificate.  
Pre-fill: `I just completed the 30-Day English for Tech Professionals course!`

### P2.5 — "Repeat Until Perfect" Mode trong Speaking
Nếu pronunciation score < 70%, tự động retry với prompt khuyến khích.

---

## Priority 3 — Features mới

### P3.1 — Weekly XP Report Email
Gửi email tóm tắt mỗi thứ 2: XP tuần này, streak, progress %.  
Dùng Resend hoặc SendGrid.

### P3.2 — Real SRS Backend Sync
Hiện tại vocab SRS chỉ lưu localStorage → mất khi đổi thiết bị.  
Thêm API `/api/vocab-srs` để sync với MongoDB.

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

| Issue | File | Impact |
|---|---|---|
| `any` type trong useSpeech.ts | `hooks/useSpeech.ts:98` | TypeScript safety |
| Progress.ts dùng `userId: 'local'` default | `models/Progress.ts:15` | Confusing default |
| Alert() trong useSpeech | `hooks/useSpeech.ts:106` | Bad UX, nên dùng toast |
| Không có rate limiting trên API routes | `app/api/auth/*` | Security |
| Stripe webhook chưa verify signature | `app/api/payment/*` | Security risk |
