# Features — Trạng thái tính năng

## Tổng quan

| Danh mục | Tính năng | Trạng thái |
|---|---|---|
| Auth | Email/password + Google OAuth | ✅ Done |
| Auth | Forgot password / reset | ✅ Done |
| Learning | 30-day lesson roadmap | ✅ Done |
| Learning | 7 loại bài tập (MCQ, fill-blank, word-order, listen-choose, word-match, speaking, pronunciation) | ✅ Done |
| Learning | XP + streak system | ✅ Done |
| Learning | Per-user progress (MongoDB) + reset | ✅ Done |
| Learning | Level system (Beginner → Master) | ✅ Done |
| Daily Challenge | Random daily challenge + countdown | ✅ Done |
| Shadowing | Player với waveform animation | ✅ Done |
| Shadowing | Live transcript (interim results) | ✅ Done |
| Shadowing | Word-by-word highlight khi phát âm | ✅ Done |
| Shadowing | Accent Coach: highlight đúng/sai từng từ | ✅ Done |
| Shadowing | Difficulty rating per sentence | ✅ Done |
| Shadowing | A2 → C1 levels (office, travel, business, daily) | ✅ Done |
| Vocabulary SRS | SM-2 flashcard algorithm (Again/Hard/Good/Easy) | ✅ Done |
| Vocabulary SRS | Auto-add từ từ completed lessons | ✅ Done |
| AI Chat | Giao tiếp với AI (Anthropic API) | ✅ Done |
| AI Chat | Premium gate (free vs Pro) | ✅ Done |
| Speaking | SG Sprint — 15-day speaking course | ✅ Done |
| Gamification | 8 badges với unlock logic | ✅ Done |
| Gamification | Leaderboard (mock data + user's real XP) | ✅ Done |
| Gamification | Certificate Canvas khi hoàn thành | ✅ Done |
| Profile | Trang profile + learning progress stats | ✅ Done |
| Profile | Reset progress với confirmation dialog | ✅ Done |
| Admin | Dashboard + stats | ✅ Done |
| Admin | User management (list, edit role, delete) | ✅ Done |
| Admin | Audit log (auto-refresh 30s) | ✅ Done |
| Admin | Lesson detail view theo exercise type | ✅ Done |
| Onboarding | Goal selection + quick level check | ✅ Done |
| PWA | Installable trên iOS/Android | ✅ Done |
| PWA | Service Worker + offline caching | ✅ Done |
| iOS App | Capacitor native shell (WKWebView) cho App Store submission | ✅ Done |
| Phrases | Cụm từ thông dụng theo chủ đề | ✅ Done |
| Conversation | Hội thoại thực tế với audio | ✅ Done |
| IPA Phonetics | Bảng phiên âm + pronunciation guide | ✅ Done |
| Sources | Trang nguồn tài liệu tham khảo | ✅ Done |
| Landing Page | Landing page với pricing | ✅ Done |

## Chi tiết các tính năng chính

### Lesson System (30 ngày)
- Mỗi ngày gồm: vocabulary phase → exercise phase → completion
- Unlock tuần tự: ngày N+1 chỉ mở khi hoàn thành ngày N
- Score được lưu per user vào MongoDB
- Hoàn thành ngày 30 → trigger Certificate Canvas

### Vocabulary SRS (Spaced Repetition)
- Algorithm SM-2 đơn giản hóa
- 4 mức: Again(1d) / Hard(3d) / Good(7d) / Easy(14d)
- Từ vựng tự động thêm từ completed lessons
- Stats: total, due today, reviewed today, mastered
- Lưu vào localStorage `eng-vocab-srs`

### Shadowing
- 4 levels: A2, B1, B2, C1
- Categories: office, travel, daily, business
- Live transcript với `useLiveSpeechRecognition` (interim results)
- Accent Coach: so sánh word-by-word sau khi nói xong
- `scorePronunciation()`: Levenshtein-like matching per word

### Badge System
| Badge | Trigger |
|---|---|
| 7-Day Streak | streak >= 7 |
| 30-Day Streak | streak >= 30 |
| First Conversation | mở conversation lần đầu |
| Pronunciation Pro | score >= 80% trong 5 shadow liên tiếp |
| Shadowing Master | hoàn thành tất cả câu B2 |
| Vocab Master | ôn 50+ flashcard SRS |
| SG Sprint Complete | hoàn thành 15 ngày SG Sprint |
| Perfect Week | streak >= 7 ngày |

### Level System
| Level | XP Range |
|---|---|
| Beginner 🌱 | 0 – 499 |
| Elementary 📗 | 500 – 1,499 |
| Intermediate 🔵 | 1,500 – 3,999 |
| Advanced 💜 | 4,000 – 9,999 |
| Master 👑 | 10,000+ |
