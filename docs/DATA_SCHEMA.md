# Data Schema

## MongoDB Collections

### users
```ts
{
  _id: ObjectId,
  email: string,          // unique, lowercase, trimmed
  password: string,       // bcrypt hash (empty string for Google-only accounts)
  googleId: string | null,
  name: string,
  role: 'admin' | 'user',
  subscription: {
    status: 'free' | 'active' | 'expired',
    plan: 'free' | 'monthly' | 'yearly',
    expiresAt: Date | null,
  },
  resetPasswordToken: string | null,
  resetPasswordExpires: Date | null,
  createdAt: Date,        // auto (timestamps: true)
  updatedAt: Date,
}
```

**Indexes:** `email` (unique)

---

### progresses
```ts
{
  _id: ObjectId,
  userId: string,         // user._id.toString(), unique per user
  totalXP: number,
  streak: number,
  lastLoginDate: string,  // "Mon May 24 2026" (Date.toDateString())
  completedDays: [{
    day: number,
    completed: boolean,
    score: number,        // 0-100
    xpEarned: number,
    completedAt: string,  // ISO 8601
  }],
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:** `userId` (unique)

**Khuyến nghị thêm index:** `userId` đã có unique constraint → index tự động. Nên thêm TTL index nếu muốn tự xóa data cũ.

---

### auditlogs
```ts
{
  _id: ObjectId,
  action: string,         // 'LOGIN' | 'REGISTER' | 'LOGOUT' | 'LOGIN_FAILED' | 'ADMIN_*'
  resource: string,       // endpoint hoặc resource bị tác động
  userEmail: string,
  status: 'success' | 'error' | 'warning',
  metadata: object,       // thông tin thêm (IP, user-agent, v.v.)
  createdAt: Date,
}
```

---

## localStorage Keys

| Key | Hook | Format | TTL |
|---|---|---|---|
| `eng-progress` | `useProgress` | `UserProgress` JSON | Persistent |
| `eng-vocab-srs` | `useVocabSRS` | `SRSCard[]` JSON | Persistent |
| `eng-badges` | `useBadges` | `BadgeData` JSON | Persistent |
| `eng-daily-challenge` | `useDailyChallenge` | challenge state JSON | Persistent |
| `eng-shadowing` | ShadowingPlayer | scores per sentence ID | Persistent |

### SRSCard schema (eng-vocab-srs)
```ts
{
  word: string,
  translation: string,
  phonetic: string,
  example: string,
  exampleTranslation?: string,
  sourceDay: number,
  interval: number,       // current review interval in days
  ease: number,           // ease factor (min 1.3, default 2.5)
  reviews: number,        // total reviews done
  dueDate: string,        // 'YYYY-MM-DD'
  lastReviewed?: string,  // 'YYYY-MM-DD'
}
```

### BadgeData schema (eng-badges)
```ts
{
  earned: { id: BadgeId; earnedAt: string }[],
  consecutivePronScores: number,
  completedB2Ids: string[],
  conversationOpened: boolean,
  totalVocabReviewed: number,
  sgSprintCompleted: boolean,
}
```

## TypeScript Types (`types/index.ts`)

```ts
interface UserProgress {
  totalXP: number;
  streak: number;
  completedDays: DayProgress[];
}

interface DayProgress {
  day: number;
  completed: boolean;
  score: number;
  xpEarned: number;
  completedAt: string;
}
```
