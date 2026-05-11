export interface KeyPhrase {
  phrase: string;
  meaning: string;
}

export interface ConvLine {
  speaker: 'A' | 'B';
  name: string;
  text: string;
  translation: string;
}

export interface Conversation {
  id: string;
  title: string;
  context: string;
  setting: string;
  level: 'B1' | 'B2';
  tags: string[];
  lines: ConvLine[];
  keyPhrases: KeyPhrase[];
}

export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Can you review my PR?',
    context: 'Junior dev nhờ senior review pull request sau 2 ngày chờ',
    setting: 'Slack DM',
    level: 'B1',
    tags: ['code review', 'PR', 'teamwork'],
    lines: [
      {
        speaker: 'A', name: 'Sam',
        text: "Hey, got a sec? My PR's been sitting in the queue for two days 🙈",
        translation: 'Hey, bạn có rảnh không? PR của tôi đã nằm trong hàng đợi hai ngày rồi.',
      },
      {
        speaker: 'B', name: 'Alex',
        text: "Sorry about that, been heads-down on the refactor. I'll take a look now.",
        translation: 'Xin lỗi vì điều đó, tôi đang tập trung cao độ vào việc refactor. Tôi sẽ xem ngay bây giờ.',
      },
      {
        speaker: 'A', name: 'Sam',
        text: "No worries! Heads up — I had to work around a weird edge case in the auth flow.",
        translation: 'Không sao! Lưu ý trước nhé — tôi phải xử lý tình huống đặc biệt kỳ lạ trong luồng xác thực.',
      },
      {
        speaker: 'B', name: 'Alex',
        text: "Okay, left some comments. Nothing blocking — mostly nits and one suggestion on naming.",
        translation: 'Được rồi, tôi để lại vài comment. Không có gì chặn merge cả — chủ yếu là nits và một gợi ý về đặt tên.',
      },
      {
        speaker: 'A', name: 'Sam',
        text: "Should I address the nits first or push back on anything?",
        translation: 'Tôi nên xử lý các nits trước hay phản đối điều gì không?',
      },
      {
        speaker: 'B', name: 'Alex',
        text: "The nits are up to you, but the naming change is worth doing. The rest looks solid — LGTM once you clean that up.",
        translation: 'Nits thì tùy bạn, nhưng việc đổi tên đáng làm. Phần còn lại trông ổn — LGTM sau khi bạn dọn dẹp đó.',
      },
      {
        speaker: 'A', name: 'Sam',
        text: "Perfect. I'll squash those commits and re-request review. Shouldn't take long.",
        translation: 'Tuyệt. Tôi sẽ gộp các commit đó và yêu cầu review lại. Không mất nhiều thời gian đâu.',
      },
      {
        speaker: 'B', name: 'Alex',
        text: "Sounds good. Ship it once I approve 🚀",
        translation: 'Nghe hay đó. Deploy nó khi tôi approve nhé.',
      },
    ],
    keyPhrases: [
      { phrase: "got a sec", meaning: "Have a moment? / Are you free? (informal)" },
      { phrase: "heads-down", meaning: "Deeply focused, not available for interruptions" },
      { phrase: "heads up", meaning: "FYI / warning someone in advance" },
      { phrase: "work around", meaning: "Find an alternative solution to bypass a problem" },
      { phrase: "nits", meaning: "Nitpicks — minor style/formatting issues, not blockers" },
      { phrase: "LGTM", meaning: "Looks Good To Me — informal approval in code reviews" },
      { phrase: "squash", meaning: "Combine multiple commits into a single one" },
      { phrase: "ship it", meaning: "Deploy / release it to production" },
    ],
  },

  {
    id: 'conv-2',
    title: "I've been banging my head against this",
    context: 'Dev gặp bug production không reproduce được ở local, nhờ senior giúp',
    setting: 'Office (in-person)',
    level: 'B1',
    tags: ['debugging', 'production', 'help'],
    lines: [
      {
        speaker: 'A', name: 'Kai',
        text: "Hey, do you have a minute? I've been banging my head against this bug for three hours.",
        translation: 'Hey, bạn có rảnh không? Tôi đã vật lộn với bug này suốt ba tiếng rồi.',
      },
      {
        speaker: 'B', name: 'Dev Lead',
        text: "Sure, what's going on?",
        translation: 'Được, có chuyện gì vậy?',
      },
      {
        speaker: 'A', name: 'Kai',
        text: "The webhook keeps failing in production but I can't reproduce it locally. It's driving me nuts.",
        translation: 'Webhook cứ bị lỗi trên production nhưng tôi không thể reproduce ở local. Nó đang làm tôi điên lên.',
      },
      {
        speaker: 'B', name: 'Dev Lead',
        text: "Classic. Have you checked the logs? Sometimes the error is way more descriptive than what the client sees.",
        translation: 'Kinh điển. Bạn đã kiểm tra logs chưa? Đôi khi lỗi mô tả chi tiết hơn nhiều so với những gì client nhìn thấy.',
      },
      {
        speaker: 'A', name: 'Kai',
        text: "I did, but it's just a generic 500. Nothing useful.",
        translation: 'Rồi, nhưng chỉ là lỗi 500 chung chung. Không có gì hữu ích cả.',
      },
      {
        speaker: 'B', name: 'Dev Lead',
        text: "What changed in the last deploy?",
        translation: 'Lần deploy cuối có thay đổi gì không?',
      },
      {
        speaker: 'A', name: 'Kai',
        text: "Oh — we bumped the API client version. Could that be it?",
        translation: 'Ồ — chúng tôi đã nâng phiên bản API client. Có phải vậy không?',
      },
      {
        speaker: 'B', name: 'Dev Lead',
        text: "Could be a breaking change. Check the changelog — nine times out of ten that's it.",
        translation: 'Có thể là breaking change. Kiểm tra changelog đi — chín lần trong mười là vậy đó.',
      },
      {
        speaker: 'A', name: 'Kai',
        text: "Oh my god. There's a method signature change right there. I feel so dumb.",
        translation: 'Trời ơi. Có thay đổi method signature ngay đó. Tôi cảm thấy ngốc quá.',
      },
      {
        speaker: 'B', name: 'Dev Lead',
        text: "Don't sweat it — this happens to everyone. Just document it in the post-mortem so we don't get caught off guard again.",
        translation: 'Đừng lo — cái này xảy ra với tất cả mọi người. Chỉ cần ghi lại trong post-mortem để chúng ta không bị bất ngờ lần sau.',
      },
    ],
    keyPhrases: [
      { phrase: "banging my head against", meaning: "Struggling intensely with a problem without making progress" },
      { phrase: "driving me nuts", meaning: "Making me very frustrated / driving me crazy" },
      { phrase: "Classic", meaning: "Typical / expected (sardonic, used when something predictable goes wrong)" },
      { phrase: "nine times out of ten", meaning: "Almost always / in the vast majority of cases" },
      { phrase: "breaking change", meaning: "A code change that breaks backward compatibility" },
      { phrase: "Don't sweat it", meaning: "Don't worry about it / it's not a big deal" },
      { phrase: "post-mortem", meaning: "Incident review meeting to analyze what went wrong and prevent recurrence" },
      { phrase: "caught off guard", meaning: "Surprised by something unexpected, unprepared" },
    ],
  },

  {
    id: 'conv-3',
    title: "Let's loop everyone in",
    context: 'PM và dev lên kế hoạch meeting, cần align trước khi làm',
    setting: 'Slack DM',
    level: 'B1',
    tags: ['meeting', 'planning', 'PM'],
    lines: [
      {
        speaker: 'A', name: 'Priya (PM)',
        text: "Hey! Quick sync — are you free Thursday? I want to loop in the design team and hash out the new dashboard specs.",
        translation: 'Hey! Đồng bộ nhanh — bạn rảnh thứ Năm không? Tôi muốn kéo team design vào và thảo luận về specs dashboard mới.',
      },
      {
        speaker: 'B', name: 'Dev',
        text: "Thursday works, but I'm slammed in the morning. Afternoon is fine — anything after 2?",
        translation: 'Thứ Năm được, nhưng buổi sáng tôi bận kín. Chiều ổn — có gì sau 2 giờ không?',
      },
      {
        speaker: 'A', name: 'Priya (PM)',
        text: "2:30 works. I'll send a calendar invite. It shouldn't run long — 30-45 mins tops.",
        translation: '2:30 được. Tôi sẽ gửi lịch. Không nên kéo dài — 30-45 phút là cùng.',
      },
      {
        speaker: 'B', name: 'Dev',
        text: "Can you share the brief beforehand? I'd rather come prepared than go in blind.",
        translation: 'Bạn có thể chia sẻ brief trước không? Tôi muốn đến với sự chuẩn bị hơn là không biết gì cả.',
      },
      {
        speaker: 'A', name: 'Priya (PM)',
        text: "For sure, I'll drop it in the channel EOD tomorrow. It's mostly wireframes at this point.",
        translation: 'Chắc chắn rồi, tôi sẽ thả nó vào channel trước cuối ngày mai. Bây giờ chủ yếu là wireframes thôi.',
      },
      {
        speaker: 'B', name: 'Dev',
        text: "One more thing — should we rope in the backend team? Some of these might have API implications.",
        translation: 'Thêm một điều — chúng ta có nên kéo team backend vào không? Một số cái này có thể ảnh hưởng đến API.',
      },
      {
        speaker: 'A', name: 'Priya (PM)',
        text: "Good call. I'll add Ravi. The more context upfront, the less back-and-forth later.",
        translation: 'Ý kiến hay. Tôi sẽ thêm Ravi. Càng nhiều context từ đầu, càng ít qua lại sau này.',
      },
    ],
    keyPhrases: [
      { phrase: "loop in", meaning: "Include someone in a conversation or decision" },
      { phrase: "hash out", meaning: "Discuss and work through a problem until resolved" },
      { phrase: "slammed", meaning: "Extremely busy, fully booked" },
      { phrase: "tops", meaning: "At most / maximum (e.g. '30 mins tops' = no more than 30 min)" },
      { phrase: "go in blind", meaning: "Enter a situation without preparation or prior knowledge" },
      { phrase: "EOD", meaning: "End Of Day — by the time work hours finish" },
      { phrase: "rope in", meaning: "Bring someone into a task or conversation (often reluctant)" },
      { phrase: "Good call", meaning: "Good idea / smart decision" },
      { phrase: "back-and-forth", meaning: "Repeated exchanges of messages or revisions" },
    ],
  },

  {
    id: 'conv-4',
    title: 'Walk me through your approach',
    context: 'Phỏng vấn kỹ thuật — interviewer hỏi về cách xử lý deadline và tech debt',
    setting: 'Video call (Tech Interview)',
    level: 'B2',
    tags: ['interview', 'career', 'tech debt'],
    lines: [
      {
        speaker: 'B', name: 'Interviewer',
        text: "Let's start with something open-ended. Tell me about a time you had to push back on scope under a tight deadline.",
        translation: 'Hãy bắt đầu với câu hỏi mở. Kể cho tôi nghe về lần bạn phải phản đối scope trong thời hạn gấp.',
      },
      {
        speaker: 'A', name: 'Candidate',
        text: "Sure. At my last gig, we had a hard deadline for a client demo — two weeks out. The feature list was too ambitious, so I flagged it early and proposed shipping an MVP instead.",
        translation: 'Được. Ở công việc trước, chúng tôi có deadline cứng cho demo client — còn hai tuần. Danh sách tính năng quá tham vọng, nên tôi cảnh báo sớm và đề xuất ship MVP thay thế.',
      },
      {
        speaker: 'B', name: 'Interviewer',
        text: "How did that go down with the team?",
        translation: 'Team đón nhận điều đó như thế nào?',
      },
      {
        speaker: 'A', name: 'Candidate',
        text: "Mixed at first. The PM was hesitant, but once I laid out the trade-offs clearly — what we'd ship vs. deprioritize — they came around.",
        translation: 'Ban đầu còn lưỡng lự. PM còn do dự, nhưng khi tôi trình bày rõ sự đánh đổi — ship gì vs. gác lại gì — họ đồng ý.',
      },
      {
        speaker: 'B', name: 'Interviewer',
        text: "And the client?",
        translation: 'Còn client thì sao?',
      },
      {
        speaker: 'A', name: 'Candidate',
        text: "Happy with the MVP. We iterated from there. Being upfront about constraints early saved us from a much messier situation.",
        translation: 'Hài lòng với MVP. Chúng tôi cải tiến từ đó. Thành thật về giới hạn từ đầu đã cứu chúng tôi khỏi tình huống tệ hơn nhiều.',
      },
      {
        speaker: 'B', name: 'Interviewer',
        text: "I like that. How do you handle tech debt in a fast-moving codebase?",
        translation: 'Tôi thích điều đó. Bạn xử lý tech debt trong codebase phát triển nhanh như thế nào?',
      },
      {
        speaker: 'A', name: 'Candidate',
        text: "You can't avoid it entirely. I document the trade-off reason as I go, and carve out time each sprint to chip away at it. Pretending it doesn't exist is the worst thing you can do.",
        translation: 'Bạn không thể tránh hoàn toàn. Tôi ghi lại lý do đánh đổi khi làm, và dành thời gian mỗi sprint để dần giải quyết nó. Giả vờ nó không tồn tại là điều tệ nhất bạn có thể làm.',
      },
      {
        speaker: 'B', name: 'Interviewer',
        text: "That's a mature take. Last one — what does a good code review culture look like to you?",
        translation: 'Đó là cái nhìn chín chắn. Cuối cùng — theo bạn, văn hóa code review tốt trông như thế nào?',
      },
    ],
    keyPhrases: [
      { phrase: "open-ended", meaning: "A broad question with no single correct answer" },
      { phrase: "push back on scope", meaning: "Challenge and negotiate to reduce requirements" },
      { phrase: "tight deadline", meaning: "A deadline that is very close and leaves little time" },
      { phrase: "last gig", meaning: "Previous job (casual/informal)" },
      { phrase: "hard deadline", meaning: "A fixed, non-negotiable deadline" },
      { phrase: "flag it early", meaning: "Raise concerns proactively before they become problems" },
      { phrase: "trade-offs", meaning: "The balance between competing options; giving up X to get Y" },
      { phrase: "came around", meaning: "Changed their mind and agreed after initial resistance" },
      { phrase: "iterated", meaning: "Improved gradually through repeated small updates" },
      { phrase: "upfront", meaning: "Honest and transparent from the very beginning" },
      { phrase: "carve out time", meaning: "Deliberately set aside time for something important" },
      { phrase: "chip away at", meaning: "Gradually reduce or work through something over time" },
      { phrase: "mature take", meaning: "A thoughtful, experienced perspective on something" },
    ],
  },

  {
    id: 'conv-5',
    title: "Let me drive for a bit",
    context: 'Hai dev pair programming để refactor một module cũ, lộn xộn',
    setting: 'Office / Screen share',
    level: 'B2',
    tags: ['pair programming', 'refactoring', 'code quality'],
    lines: [
      {
        speaker: 'A', name: 'Dev 1',
        text: "Want to pair on this? I've been going in circles and a second pair of eyes would help.",
        translation: 'Muốn cùng làm cái này không? Tôi đang loanh quanh mãi và cần thêm một góc nhìn khác.',
      },
      {
        speaker: 'B', name: 'Dev 2',
        text: "Yeah, sure. What are we tackling?",
        translation: 'Được thôi. Chúng ta đang giải quyết gì vậy?',
      },
      {
        speaker: 'A', name: 'Dev 1',
        text: "This whole module is a mess. The person who wrote this was clearly under the gun — copy-pasted logic in six places.",
        translation: 'Module này hoàn toàn lộn xộn. Người viết cái này rõ ràng đang trong áp lực — logic copy-paste ở sáu chỗ.',
      },
      {
        speaker: 'B', name: 'Dev 2',
        text: "To be fair, we don't know the context. Might've been a hotfix.",
        translation: 'Thật ra, chúng ta không biết context. Có thể là hotfix.',
      },
      {
        speaker: 'A', name: 'Dev 1',
        text: "Fair point. Okay, let me drive first — tell me if anything looks off.",
        translation: 'Đúng vậy. Được rồi, để tôi lái trước — nói tôi biết nếu có gì trông sai.',
      },
      {
        speaker: 'B', name: 'Dev 2',
        text: "Go for it.",
        translation: 'Cứ tự nhiên đi.',
      },
      {
        speaker: 'A', name: 'Dev 1',
        text: "Plan is to extract this into a hook, make it reusable. If we do it right, we can delete like 60% of this file.",
        translation: 'Kế hoạch là tách cái này thành hook, làm cho nó tái sử dụng được. Nếu làm đúng, chúng ta có thể xóa khoảng 60% file này.',
      },
      {
        speaker: 'B', name: 'Dev 2',
        text: "I love deleting code. What about the edge cases? There was a weird timing issue I remember.",
        translation: 'Tôi thích xóa code. Còn edge case thì sao? Tôi nhớ có vấn đề timing kỳ lạ.',
      },
      {
        speaker: 'A', name: 'Dev 1',
        text: "I'll spike on that first before we commit to the abstraction. Don't want to over-engineer before we know what we're dealing with.",
        translation: 'Tôi sẽ spike vấn đề đó trước khi chúng ta cố định abstraction. Không muốn over-engineer trước khi biết đang đối mặt với gì.',
      },
      {
        speaker: 'B', name: 'Dev 2',
        text: "Smart. And tests as we go — obviously.",
        translation: 'Thông minh. Và viết test theo tiến độ — hiển nhiên rồi.',
      },
      {
        speaker: 'A', name: 'Dev 1',
        text: "Obviously. No tests, no merge.",
        translation: 'Hiển nhiên. Không test, không merge.',
      },
    ],
    keyPhrases: [
      { phrase: "going in circles", meaning: "Making no progress; repeatedly hitting the same obstacles" },
      { phrase: "second pair of eyes", meaning: "Another person to review your work and catch things you missed" },
      { phrase: "under the gun", meaning: "Under time pressure; rushed and stressed" },
      { phrase: "let me drive", meaning: "I'll control the keyboard/screen in a pair programming session" },
      { phrase: "looks off", meaning: "Seems wrong or incorrect" },
      { phrase: "Go for it", meaning: "Go ahead / proceed / do it" },
      { phrase: "extract", meaning: "Move code into a separate, reusable function or module" },
      { phrase: "spike on", meaning: "Do a short research or prototyping session to explore a problem" },
      { phrase: "commit to the abstraction", meaning: "Finalize and lock in an architectural decision" },
      { phrase: "over-engineer", meaning: "Make something unnecessarily complex; build more than needed" },
    ],
  },

  {
    id: 'conv-6',
    title: "That's a rabbit hole",
    context: 'CTO đề xuất migrate sang microservices, lead dev phân tích rủi ro',
    setting: 'Slack thread (architecture discussion)',
    level: 'B2',
    tags: ['architecture', 'decision-making', 'leadership'],
    lines: [
      {
        speaker: 'A', name: 'CTO',
        text: "I've been thinking about migrating to microservices. Wanted to get the team's gut feeling.",
        translation: 'Tôi đang nghĩ về việc migrate sang microservices. Muốn nghe cảm nhận của team.',
      },
      {
        speaker: 'B', name: 'Lead Dev',
        text: "I hear you, but I'd pump the brakes a bit. We're not at a scale where microservices buy us much, and the operational overhead is real.",
        translation: 'Tôi hiểu ý bạn, nhưng tôi muốn dừng lại một chút. Chúng ta chưa ở mức scale mà microservices mang lại nhiều lợi ích, và chi phí vận hành là có thật.',
      },
      {
        speaker: 'A', name: 'CTO',
        text: "The argument is future-proofing — if we hit serious scale in 18 months—",
        translation: 'Lý lẽ là future-proofing — nếu chúng ta đạt scale lớn trong 18 tháng—',
      },
      {
        speaker: 'B', name: 'Lead Dev',
        text: "That's a bit of a rabbit hole though. Our biggest pain point right now is deployment speed, not service isolation. Solving a problem we don't have yet is risky.",
        translation: 'Nhưng đó là đào sâu vào vấn đề không cần thiết. Pain point lớn nhất hiện tại là tốc độ deploy, không phải service isolation. Giải quyết vấn đề chưa tồn tại là rủi ro.',
      },
      {
        speaker: 'A', name: 'CTO',
        text: "Fair. So you're saying — nail the monolith first?",
        translation: 'Hợp lý. Ý bạn là — làm hoàn hảo monolith trước?',
      },
      {
        speaker: 'B', name: 'Lead Dev',
        text: "Exactly. Better CI/CD, cleaner APIs, solid test coverage. Then if scale becomes a problem, we're in a much better position to carve things out.",
        translation: 'Đúng vậy. CI/CD tốt hơn, API sạch hơn, test coverage chắc chắn. Sau đó nếu scale trở thành vấn đề, chúng ta ở vị thế tốt hơn nhiều để tách các thành phần ra.',
      },
      {
        speaker: 'A', name: 'CTO',
        text: "That's a pretty compelling case. What would you prioritize first?",
        translation: 'Đó là lập luận khá thuyết phục. Bạn sẽ ưu tiên gì trước?',
      },
      {
        speaker: 'B', name: 'Lead Dev',
        text: "Honestly? The deployment pipeline. It's the bottleneck right now. Fix that and everything else gets faster.",
        translation: 'Thật ra? Pipeline deploy. Đó là điểm nghẽn hiện tại. Sửa cái đó và mọi thứ khác sẽ nhanh hơn.',
      },
      {
        speaker: 'A', name: 'CTO',
        text: "Okay, let's take that approach. Can you put together a rough proposal?",
        translation: 'Được, hãy theo hướng đó. Bạn có thể lập một đề xuất sơ bộ không?',
      },
      {
        speaker: 'B', name: 'Lead Dev',
        text: "On it.",
        translation: 'Tôi xử lý ngay.',
      },
    ],
    keyPhrases: [
      { phrase: "gut feeling", meaning: "Instinct / intuition — what you sense without hard data" },
      { phrase: "pump the brakes", meaning: "Slow down; hold back before going further" },
      { phrase: "operational overhead", meaning: "Extra work and cost required to manage a system" },
      { phrase: "future-proofing", meaning: "Designing something to still work well in the future" },
      { phrase: "rabbit hole", meaning: "A complex problem that leads deeper and deeper without resolution" },
      { phrase: "pain point", meaning: "A persistent problem or source of frustration" },
      { phrase: "nail the monolith", meaning: "Perfect / optimize the single-service architecture first" },
      { phrase: "carve things out", meaning: "Separate components or responsibilities into independent pieces" },
      { phrase: "compelling case", meaning: "A convincing, persuasive argument" },
      { phrase: "bottleneck", meaning: "The constraint that limits the overall throughput or speed" },
      { phrase: "On it", meaning: "I'll do it / I'm already working on it (immediate commitment)" },
    ],
  },
];
