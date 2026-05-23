# API Reference

Tất cả routes nằm trong `app/api/`. Đều là Next.js Route Handlers.

## Authentication

Mọi request cần auth phải có cookie `auth-token` (set tự động khi login).

---

## Auth Routes

### POST /api/auth/register
Tạo tài khoản mới.

**Body:** `{ name, email, password }`  
**Response:** `{ message, token }` → set cookie

---

### POST /api/auth/login
Đăng nhập bằng email/password.

**Body:** `{ email, password }`  
**Response:** `{ user: { id, name, email, role, subscription } }` → set cookie

---

### POST /api/auth/logout
Xóa cookie auth-token.

---

### GET /api/auth/me
Lấy thông tin user hiện tại từ JWT.

**Auth:** Required  
**Response:** `{ user: { id, name, email, role, subscription } }`

---

### POST /api/auth/forgot-password
Gửi reset token.

**Body:** `{ email }`

---

### POST /api/auth/reset-password
Đặt lại mật khẩu.

**Body:** `{ token, password }`

---

### GET /api/auth/google
Redirect đến Google OAuth consent screen.

---

### GET /api/auth/google/callback
Callback từ Google → tạo/update user → set cookie → redirect đến /app.

---

## Progress Routes

### GET /api/progress
Lấy progress của user hiện tại.

**Auth:** Required  
**Response:** `{ totalXP, streak, completedDays[], lastLoginDate }`  
Returns `{ totalXP: 0, streak: 0, completedDays: [] }` nếu chưa có data.

---

### POST /api/progress
Lưu kết quả hoàn thành 1 ngày học.

**Auth:** Required  
**Body:** `{ day: number, score: number, xpEarned: number }`  
**Logic:**
- Nếu `day` chưa có → thêm vào completedDays, cộng XP
- Nếu `day` đã có → update entry (không cộng thêm XP)
- Cập nhật streak dựa vào `lastLoginDate`

---

### DELETE /api/progress
Reset toàn bộ progress (xóa document).

**Auth:** Required  
**Response:** `{ totalXP: 0, streak: 0, completedDays: [] }`

---

## Admin Routes

> Tất cả admin routes kiểm tra `role === 'admin'` qua middleware.

### GET /api/admin/stats
Tổng quan: tổng user, active subscriptions, v.v.

---

### GET /api/admin/users
List tất cả users (name, email, role, subscription, createdAt).

### PATCH /api/admin/users/[id]
Update role hoặc subscription của user.

**Body:** `{ role?, subscription?: { status, plan } }`

### DELETE /api/admin/users/[id]
Xóa user khỏi DB.

---

### GET /api/admin/audit?limit=100
Lấy audit log gần nhất.

**Query:** `limit` (default 50)  
**Response:** `{ success: true, data: AuditEntry[] }`

---

## AI Chat Route

### POST /api/ai-chat
Giao tiếp với AI (Anthropic Claude).

**Auth:** Required + Pro subscription  
**Body:** `{ message: string, history: Message[] }`  
**Response:** Streaming text

---

## Payment Route

### POST /api/payment/checkout
Tạo Stripe checkout session.

**Auth:** Required  
**Body:** `{ plan: 'monthly' | 'yearly' }`  
**Response:** `{ url: string }` → redirect đến Stripe

---

## Error Responses

Tất cả error đều trả về JSON:

```json
{ "error": "Error message" }
```

| Status | Meaning |
|---|---|
| 401 | Chưa đăng nhập |
| 403 | Không có quyền (non-admin) |
| 404 | Không tìm thấy |
| 500 | Server error |
