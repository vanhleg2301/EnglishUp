# Features — Trạng thái tính năng

## Tổng quan

| Danh mục | Tính năng | Trạng thái |
|---|---|---|
| Auth | Email/password + Google OAuth | ✅ Done |
| Auth | Chế độ khách: dùng app không cần đăng nhập (tạm thời), tiến độ lưu localStorage | ✅ Done |
| Access | `FREE_ACCESS` mở khoá Lessons, SG Sprint, Vocabulary SRS (AI Chat vẫn cần Pro) | ✅ Done |
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
| A1 Course | A1 trong 20 ngày: nghe hiểu + giao tiếp cơ bản theo comprehensible input | ✅ Done |
| Fast Talk | 20 bài giao tiếp nhanh A2+ → B1 (đời sống + công sở), miễn phí | ✅ Done |
| Gamification | 8 badges với unlock logic | ✅ Done |
| Gamification | Leaderboard (mock data + user's real XP) | ✅ Done |
| Gamification | Certificate Canvas khi hoàn thành | ✅ Done |
| Profile | Trang profile + learning progress stats | ✅ Done |
| Profile | Reset progress với confirmation dialog | ✅ Done |
| Admin | Dashboard + stats | ✅ Done |
| Admin | User management (list, edit role, delete) | ✅ Done |
| Admin | Audit log (auto-refresh 30s) | ✅ Done |
| Admin | Lesson detail view theo exercise type | ✅ Done |
| Security | Rate limiting (10 req/15min/IP) trên login, register, forgot-password | ✅ Done |
| Reliability | React Error Boundary trong AppShell | ✅ Done |
| Gamification | Certificate cho SG Sprint hoàn thành (day 15) | ✅ Done |
| Gamification | LinkedIn sharing từ Certificate modal | ✅ Done |
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
- Hoàn thành ngày 30 → trigger Certificate Canvas với nút LinkedIn share

### A1 trong 20 ngày
- Route: `/a1` (danh sách 20 ngày) và `/a1/[day]`. Miễn phí, không cần đăng nhập, mọi ngày đều mở.
- Chủ đề: chào hỏi, số, quê quán, gia đình, nghề nghiệp, một ngày, đồ ăn, gọi món, mua sắm, quần áo, nhà ở, địa điểm, đi lại, thời tiết, hẹn gặp, sở thích, sức khoẻ, khách sạn, cuối tuần trước (quá khứ), tổng ôn và dự định (going to).
- Mỗi ngày 4 bước theo comprehensible input:
  1. **Từ mới qua ngữ cảnh**: 8 từ, mỗi từ có hình (emoji) + 2 câu ví dụ đọc chậm; người học tự đoán, bấm mới hiện nghĩa tiếng Việt.
  2. **Nghe câu chuyện**: truyện ngắn dùng lại các từ mới; từ mới tô xanh, bấm để xem nghĩa; mỗi câu có nút nghe và nút dịch; 4 câu hỏi Yes/No nghe bằng tai.
  3. **Hội thoại**: nghe cả bài (2 giọng), nói theo các câu của "Bạn" (có chấm điểm nếu trình duyệt hỗ trợ).
  4. **Nói về bạn**: 4 câu hỏi cá nhân; app hiện câu nó nghe được và câu mẫu, không chấm điểm vì câu trả lời mỗi người khác nhau.
- Hoàn thành: +30 XP (lần đầu), 8 từ vào Vocabulary SRS (`sourceDay = 2000 + day`), tiến độ lưu localStorage `a1-progress`.
- Dữ liệu: `lib/a1/` (`days1to5.ts` … `days16to20.ts`, `types.ts`). Giao diện: `components/a1/`, dùng lại TTS/ghi âm từ `components/fastTalk/shared.tsx`.

### Fast Talk (20 bài, A2+ → B1)
- Mục tiêu: giao tiếp nhanh bằng cụm từ dùng hằng ngày. 10 bài A2+ (1–10) và 10 bài B1 (11–20), xen kẽ chủ đề đời sống và công sở.
- Route: `/fast-talk` (danh sách, lọc theo trình độ/chủ đề) và `/fast-talk/[unit]`. Không khoá Pro, mọi bài đều mở.
- Mỗi bài có 4 bước:
  1. **Nghe hiểu**: hội thoại phát bằng TTS ở tốc độ thật (có nút chậm), trả lời 2 câu hỏi trước khi xem lời thoại, kèm ghi chú nối âm/nuốt âm.
  2. **Cụm từ**: 8 cụm kèm ví dụ, nghe và nói đè theo (chấm điểm nếu trình duyệt hỗ trợ nhận giọng nói).
  3. **Phản xạ**: 6 câu + 4 câu theo một khung câu; nhìn tiếng Việt, nói tiếng Anh trong 7 giây (A2+) hoặc 5 giây (B1). Điểm ≥ 70% là đạt; câu sai được hỏi lại một lần cuối vòng. Không có nhận giọng nói thì tự đánh giá.
  4. **Nhập vai**: hội thoại theo kịch bản, người kia tự đọc, người học nói ý được gợi bằng tiếng Việt.
- Hoàn thành: +40 XP (lần đầu), 8 cụm được thêm vào Vocabulary SRS (`sourceDay = 1000 + unitId`), lưu tiến độ vào localStorage `fast-talk-progress`.
- Dữ liệu: `lib/fastTalk/` (`unitsA2.ts`, `unitsB1.ts`, `types.ts`). Giao diện: `components/fastTalk/`.

### SG Sprint (15 ngày)
- Hoàn thành ngày 15 → trigger Certificate Canvas
- Badge `sg-sprint-complete` được unlock khi completeDay(15)

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
