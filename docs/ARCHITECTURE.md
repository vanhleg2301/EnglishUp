# Architecture

## Luồng dữ liệu chính

```
Browser
  ├── Page Component (app/xxx/page.tsx)
  │     ├── Custom Hook (hooks/useXxx.ts)
  │     │     ├── fetch → API Route (app/api/xxx/route.ts)
  │     │     │     ├── getAuthUser() → verify JWT từ cookie
  │     │     │     ├── connectDB() → MongoDB connection pool
  │     │     │     └── Mongoose Model → MongoDB Atlas
  │     │     └── localStorage fallback (nếu không có auth)
  │     └── Component (components/Xxx.tsx)
  └── Middleware (middleware.ts)
        └── Verify JWT → redirect nếu chưa login / không phải admin
```

## Auth Flow

```
Login / Google OAuth
  → JWT signed với jose (HS256)
  → Set cookie `auth-token` (httpOnly, secure, 7 ngày)
  → Middleware đọc cookie ở mọi request
  → getAuthUser() dùng trong API routes để lấy userId
```

## Key Files

### Routing
- `middleware.ts` — protect routes, check admin role
- `app/layout.tsx` — root layout với AuthProvider
- `contexts/AuthContext.tsx` — user state, login/logout/me

### Data Layer
- `lib/mongodb.ts` — singleton connection (tránh tạo nhiều connection trong serverless)
- `lib/auth.ts` — `getAuthUser()`, `createToken()`, `hashPassword()`
- `models/User.ts` — User schema (email, role, subscription, OAuth)
- `models/Progress.ts` — Per-user progress (XP, streak, completedDays[])
- `models/AuditLog.ts` — Action log (login, register, admin actions)

### Content Data (static, không cần DB)
- `lib/lessonData.ts` — 30 ngày × {vocabulary[], exercises[]}
- `lib/shadowingData.ts` — Shadowing sentences theo level/category
- `lib/speakingCourseData.ts` — SG Sprint 15 ngày
- `lib/phrasesData.ts` — Cụm từ theo chủ đề
- `lib/conversationData.ts` — Hội thoại thực tế
- `lib/dailyChallengeData.ts` — Daily challenge questions
- `lib/pronunciationGuide.ts` — IPA guide
- `lib/levels.ts` — Level thresholds + getLevelInfo/getLevelProgress

### Hooks (client-side state)
- `useProgress` — fetch/save/reset progress, isDayCompleted, isDayUnlocked
- `useVocabSRS` — SM-2 flashcard state, localStorage `eng-vocab-srs`
- `useBadges` — Badge tracking, localStorage `eng-badges`
- `useDailyChallenge` — Challenge state, localStorage `eng-daily-challenge`
- `useSpeech` — `useTTS` (speak), `useSpeechRecognition`, `useLiveSpeechRecognition`

### Components
- `AppShell` — Sidebar + mobile header wrapper
- `Sidebar` — Navigation, XP/streak, level progress, user card
- `AdminLayout` — Admin sidebar wrapper
- `exercises/` — 7 exercise components (props-driven, no internal state sync)
- `shadowing/ShadowingPlayer` — Full shadowing UI với live transcript
- `CertificateCanvas` — HTML5 Canvas certificate generator
- `PremiumGate` — Blurs content + upsell cho non-pro users

## State Management Strategy

| State Type | Storage |
|---|---|
| User identity | AuthContext (memory) + cookie |
| Learning progress | MongoDB (primary) + localStorage (fallback) |
| Vocabulary SRS | localStorage `eng-vocab-srs` |
| Badges | localStorage `eng-badges` |
| Daily challenge | localStorage `eng-daily-challenge` |
| Shadowing scores | localStorage `eng-shadowing` |

## Exercise Types

Mỗi loại bài tập là 1 React component độc lập trong `components/exercises/`:

| File | Type | Description |
|---|---|---|
| `MultipleChoice.tsx` | multiple-choice | 4 options, pick one |
| `FillBlank.tsx` | fill-blank | Type missing word |
| `WordOrder.tsx` | word-order | Drag/click words to order |
| `WordMatch.tsx` | word-match | Match columns |
| `ListenChoose.tsx` | listen-choose | Hear → choose meaning |
| `Speaking.tsx` | speaking | Record + score vs target |
| `PronunciationCheck.tsx` | pronunciation | Word-by-word scoring |
