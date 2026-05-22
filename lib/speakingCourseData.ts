export interface DialogueLine { speaker: string; role: string; text: string; translation: string; }
export interface KeyPhrase { phrase: string; meaning: string; example: string; exampleTranslation: string; }
export interface ShadowSentence { text: string; translation: string; tip: string; }
export interface SpeakingPrompt { situation: string; theyAsk: string; yourTarget: string; translation: string; }
export interface RoleplayLine { speaker: 'you' | 'them'; speakerName: string; text: string; translation: string; hint?: string; }
export interface SpeakingDay {
  day: number; title: string; subtitle: string; emoji: string; context: string;
  gradient: [string, string];
  dialogue: { context: string; lines: DialogueLine[]; };
  keyPhrases: KeyPhrase[];
  shadowSentences: ShadowSentence[];
  speakingPrompts: SpeakingPrompt[];
  roleplay: { title: string; scenario: string; yourRole: string; theirRole: string; lines: RoleplayLine[]; };
  dailyTip: { title: string; content: string; singlishNote?: string; };
}

export const speakingDays: SpeakingDay[] = [
  {
    day: 1, title: "First Day at the Office", subtitle: "Introductions & Small Talk", emoji: "👋",
    context: "You arrive at the Singapore office. Time to introduce yourself.",
    gradient: ["#06b6d4", "#3b82f6"],
    dialogue: {
      context: "Meeting your Singapore colleagues for the first time",
      lines: [
        { speaker: "Sarah", role: "HR Manager", text: "Good morning! You must be the developer from Vietnam.", translation: "Chào buổi sáng! Bạn chắc là developer từ Việt Nam." },
        { speaker: "You", role: "Developer", text: "Yes, good morning! I'm Anh, nice to meet you.", translation: "Vâng, chào buổi sáng! Tôi là Anh, rất vui được gặp." },
        { speaker: "Sarah", role: "HR Manager", text: "Welcome to nullifymatter. How was your flight?", translation: "Chào mừng đến nullifymatter. Chuyến bay của bạn thế nào?" },
        { speaker: "You", role: "Developer", text: "It was smooth, thank you for asking.", translation: "Chuyến bay suôn sẻ, cảm ơn bạn đã hỏi." },
        { speaker: "Sarah", role: "HR Manager", text: "Great! Let me show you around the office.", translation: "Tuyệt! Để tôi dẫn bạn tham quan văn phòng." },
      ]
    },
    keyPhrases: [
      { phrase: "Nice to meet you", meaning: "Greeting when meeting someone", example: "Nice to meet you, Sarah!", exampleTranslation: "Rất vui được gặp bạn, Sarah!" },
      { phrase: "How was your...?", meaning: "Asking about an experience", example: "How was your weekend?", exampleTranslation: "Cuối tuần của bạn thế nào?" },
      { phrase: "I'm based in", meaning: "Where you work/live", example: "I'm based in Ho Chi Minh City.", exampleTranslation: "Tôi làm việc ở TP Hồ Chí Minh." },
    ],
    shadowSentences: [
      { text: "Nice to meet you, I'm the developer from Vietnam.", translation: "Rất vui được gặp, tôi là developer từ Việt Nam.", tip: "Stress 'meet' and 'Vietnam'" },
      { text: "I'm really glad to be here in Singapore.", translation: "Tôi rất vui khi được đến Singapore.", tip: "Speak with warmth and enthusiasm" },
      { text: "I look forward to working with your team.", translation: "Tôi mong được làm việc cùng team của bạn.", tip: "Emphasize 'look forward'" },
    ],
    speakingPrompts: [
      { situation: "Someone asks your name", theyAsk: "What's your name?", yourTarget: "My name is Anh, I'm the developer.", translation: "Tên tôi là Anh, tôi là developer." },
      { situation: "Someone asks where you're from", theyAsk: "Where are you from?", yourTarget: "I'm from Ho Chi Minh City, Vietnam.", translation: "Tôi đến từ TP Hồ Chí Minh, Việt Nam." },
    ],
    roleplay: {
      title: "Meet Your First Colleague", scenario: "Meeting Sarah at the front desk",
      yourRole: "Developer visiting from Vietnam", theirRole: "Sarah, HR Manager",
      lines: [
        { speaker: "them", speakerName: "Sarah", text: "Hi there! Are you the new visitor from Vietnam?", translation: "Chào! Bạn có phải khách từ Việt Nam không?" },
        { speaker: "you", speakerName: "You", text: "Yes! I'm Anh, the developer. Nice to meet you.", translation: "Vâng! Tôi là Anh, developer. Rất vui.", hint: "Smile and be confident" },
        { speaker: "them", speakerName: "Sarah", text: "Welcome! How long are you staying?", translation: "Chào mừng! Bạn ở lại bao lâu?" },
        { speaker: "you", speakerName: "You", text: "I'm here for about two weeks. Very excited!", translation: "Tôi ở đây khoảng hai tuần. Rất hào hứng!", hint: "Show enthusiasm" },
      ]
    },
    dailyTip: { title: "Singapore First Impression", content: "Singaporeans appreciate punctuality and a firm handshake. Always use full names until invited to use first names.", singlishNote: "'Lah' at the end softens statements: 'No problem lah!'" }
  },
  {
    day: 2, title: "Office Tour & Setup", subtitle: "Navigating the Workplace", emoji: "🏢",
    context: "Getting settled in — finding your desk, meeting the IT team.",
    gradient: ["#06b6d4", "#3b82f6"],
    dialogue: {
      context: "IT team is helping you get set up",
      lines: [
        { speaker: "Mei", role: "IT Support", text: "Hi! I'm Mei from IT. Let me get you connected.", translation: "Chào! Tôi là Mei từ IT. Để tôi giúp bạn kết nối." },
        { speaker: "You", role: "Developer", text: "Thank you, I need access to the dev environment.", translation: "Cảm ơn, tôi cần truy cập môi trường dev." },
        { speaker: "Mei", role: "IT Support", text: "Sure. Do you need VPN access as well?", translation: "Được. Bạn có cần truy cập VPN không?" },
        { speaker: "You", role: "Developer", text: "Yes please, that would be very helpful.", translation: "Vâng nhờ bạn, điều đó sẽ rất hữu ích." },
        { speaker: "Mei", role: "IT Support", text: "I'll set it up right away. The password is temporary.", translation: "Tôi sẽ thiết lập ngay. Mật khẩu là tạm thời." },
      ]
    },
    keyPhrases: [
      { phrase: "Could you help me with...?", meaning: "Politely asking for help", example: "Could you help me with the printer?", exampleTranslation: "Bạn có thể giúp tôi với máy in không?" },
      { phrase: "I'll get that sorted", meaning: "I will fix/arrange that", example: "I'll get that sorted by tomorrow.", exampleTranslation: "Tôi sẽ giải quyết cái đó trước ngày mai." },
      { phrase: "Bear with me", meaning: "Please be patient", example: "Bear with me, the system is slow.", exampleTranslation: "Hãy kiên nhẫn với tôi, hệ thống đang chậm." },
    ],
    shadowSentences: [
      { text: "Could you help me set up my development environment?", translation: "Bạn có thể giúp tôi thiết lập môi trường phát triển?", tip: "Ask clearly and politely" },
      { text: "I need access to the project repository.", translation: "Tôi cần truy cập vào kho dự án.", tip: "Use 'access to' for permissions" },
      { text: "Thank you so much, this is really helpful.", translation: "Cảm ơn bạn rất nhiều, điều này thực sự hữu ích.", tip: "Express gratitude warmly" },
    ],
    speakingPrompts: [
      { situation: "Asking where something is", theyAsk: "Need any help finding something?", yourTarget: "Could you show me where the meeting rooms are?", translation: "Bạn có thể chỉ cho tôi phòng họp ở đâu không?" },
      { situation: "Reporting a tech issue", theyAsk: "Is everything working okay?", yourTarget: "Actually, my laptop can't connect to WiFi.", translation: "Thực ra, laptop tôi không kết nối được WiFi." },
    ],
    roleplay: {
      title: "Laptop Setup with IT", scenario: "Getting your laptop configured",
      yourRole: "New developer visitor", theirRole: "Mei, IT Support",
      lines: [
        { speaker: "them", speakerName: "Mei", text: "Hi! Need help setting up your workstation?", translation: "Chào! Cần giúp thiết lập máy trạm không?" },
        { speaker: "you", speakerName: "You", text: "Yes please! I can't connect to the network.", translation: "Vâng nhờ bạn! Tôi không kết nối được mạng.", hint: "Be polite but direct" },
        { speaker: "them", speakerName: "Mei", text: "Let me check your settings. Is this your first day?", translation: "Để tôi kiểm tra cài đặt. Hôm nay là ngày đầu tiên?" },
        { speaker: "you", speakerName: "You", text: "Yes! Just arrived this morning from Vietnam.", translation: "Vâng! Vừa đến sáng nay từ Việt Nam.", hint: "Be friendly and conversational" },
      ]
    },
    dailyTip: { title: "Tech Talk in Singapore", content: "Singapore tech offices are very international. Don't hesitate to ask for help — colleagues appreciate proactive communication.", singlishNote: "'Can or not?' means 'Is it possible?' — informal way to check." }
  },
  {
    day: 3, title: "First Team Meeting", subtitle: "Following Discussions & Participating", emoji: "💼",
    context: "Your first standup meeting with the product and HR team.",
    gradient: ["#06b6d4", "#3b82f6"],
    dialogue: {
      context: "Morning standup meeting with mixed team",
      lines: [
        { speaker: "Lisa", role: "Product Manager", text: "Let's get started. Everyone, this is Anh from Vietnam.", translation: "Bắt đầu thôi. Mọi người, đây là Anh từ Việt Nam." },
        { speaker: "You", role: "Developer", text: "Hi everyone, happy to be here for two weeks.", translation: "Xin chào mọi người, vui được ở đây hai tuần." },
        { speaker: "Lisa", role: "Product Manager", text: "Anh, can you give us a quick update on the app?", translation: "Anh, bạn có thể cập nhật nhanh về app không?" },
        { speaker: "You", role: "Developer", text: "Sure. We finished the main features last week.", translation: "Được. Chúng tôi đã hoàn thành tính năng chính tuần trước." },
        { speaker: "Lisa", role: "Product Manager", text: "Great! We'll discuss integration this afternoon.", translation: "Tuyệt! Chúng ta sẽ thảo luận về tích hợp chiều nay." },
      ]
    },
    keyPhrases: [
      { phrase: "Just to clarify", meaning: "Making sure you understand", example: "Just to clarify, the deadline is Friday?", exampleTranslation: "Để làm rõ, deadline là thứ Sáu?" },
      { phrase: "Could you elaborate?", meaning: "Ask for more details", example: "Could you elaborate on that feature?", exampleTranslation: "Bạn có thể giải thích thêm về tính năng đó?" },
      { phrase: "I'll take that action", meaning: "I will do that task", example: "I'll take that action and report back.", exampleTranslation: "Tôi sẽ thực hiện việc đó và báo cáo lại." },
    ],
    shadowSentences: [
      { text: "From my side, the API integration is complete.", translation: "Về phía tôi, tích hợp API đã hoàn thành.", tip: "Start with 'from my side' in meetings" },
      { text: "I'll need a day to look into that issue.", translation: "Tôi cần một ngày để xem xét vấn đề đó.", tip: "Be honest about timelines" },
      { text: "Can we schedule a follow-up tomorrow morning?", translation: "Chúng ta có thể sắp xếp theo dõi sáng mai không?", tip: "Proactively suggest next steps" },
    ],
    speakingPrompts: [
      { situation: "Being asked for status update", theyAsk: "What's your progress on the backend?", yourTarget: "We're about 80% done. Just finishing the database layer.", translation: "Chúng tôi hoàn thành khoảng 80%. Đang hoàn thiện tầng database." },
      { situation: "You don't understand something", theyAsk: "Did you get the brief I sent?", yourTarget: "I got it, but could you clarify the second point?", translation: "Tôi nhận được, nhưng bạn có thể làm rõ điểm thứ hai không?" },
    ],
    roleplay: {
      title: "Standup Status Update", scenario: "Giving your update in the morning standup",
      yourRole: "Developer giving status", theirRole: "Lisa, Product Manager",
      lines: [
        { speaker: "them", speakerName: "Lisa", text: "Anh, what did you work on yesterday?", translation: "Anh, hôm qua bạn làm gì?" },
        { speaker: "you", speakerName: "You", text: "I reviewed the codebase and fixed two bugs.", translation: "Tôi đã xem lại codebase và sửa hai lỗi.", hint: "Be specific and brief" },
        { speaker: "them", speakerName: "Lisa", text: "Any blockers today?", translation: "Hôm nay có vướng mắc gì không?" },
        { speaker: "you", speakerName: "You", text: "No blockers. I'll finish the feature by end of day.", translation: "Không có vướng mắc. Tôi sẽ hoàn thành tính năng cuối ngày.", hint: "Confident and clear" },
      ]
    },
    dailyTip: { title: "Meeting Etiquette", content: "In Singapore meetings, it's respectful to listen fully before responding. Taking brief notes shows engagement and professionalism." }
  },
  {
    day: 4, title: "Lunch with Colleagues", subtitle: "Social & Casual Conversation", emoji: "🍜",
    context: "Lunch at a hawker centre with HR and economics colleagues.",
    gradient: ["#8b5cf6", "#6366f1"],
    dialogue: {
      context: "Lunch at Maxwell Food Centre with colleagues",
      lines: [
        { speaker: "Rachel", role: "Economist", text: "Have you tried chicken rice yet? It's a must!", translation: "Bạn đã thử cơm gà chưa? Đó là món phải ăn!" },
        { speaker: "You", role: "Developer", text: "Not yet! What would you recommend?", translation: "Chưa! Bạn sẽ recommend gì?" },
        { speaker: "Rachel", role: "Economist", text: "Tian Tian is the most famous stall here.", translation: "Tian Tian là quầy nổi tiếng nhất ở đây." },
        { speaker: "You", role: "Developer", text: "Perfect, I'll try that. Do you eat here often?", translation: "Tuyệt vời, tôi sẽ thử. Bạn hay ăn ở đây không?" },
        { speaker: "Rachel", role: "Economist", text: "Every week! Singapore food is the best in Asia.", translation: "Mỗi tuần! Đồ ăn Singapore là tốt nhất châu Á." },
      ]
    },
    keyPhrases: [
      { phrase: "What do you recommend?", meaning: "Asking for suggestions", example: "What do you recommend from the menu?", exampleTranslation: "Bạn recommend món gì trong menu?" },
      { phrase: "I'll give it a try", meaning: "I will try something new", example: "Durian? I'll give it a try!", exampleTranslation: "Sầu riêng? Tôi sẽ thử xem!" },
      { phrase: "This is amazing!", meaning: "Expressing strong approval", example: "This laksa is amazing!", exampleTranslation: "Laksa này tuyệt vời!" },
    ],
    shadowSentences: [
      { text: "I've never tried this before but it smells wonderful.", translation: "Tôi chưa bao giờ thử cái này nhưng mùi rất tuyệt.", tip: "Show openness to new food" },
      { text: "Back in Vietnam we have something similar called pho.", translation: "Ở Việt Nam chúng tôi có món tương tự gọi là phở.", tip: "Share your culture naturally" },
      { text: "This is honestly one of the best meals I've had.", translation: "Thành thật mà nói đây là bữa ăn ngon nhất tôi từng có.", tip: "'Honestly' adds authenticity" },
    ],
    speakingPrompts: [
      { situation: "Ordering food", theyAsk: "What would you like?", yourTarget: "I'll have the chicken rice please, with extra chili.", translation: "Cho tôi cơm gà, thêm ớt nhé." },
      { situation: "Talking about food preferences", theyAsk: "Do you like spicy food?", yourTarget: "Yes, I love spicy food. In Vietnam we eat a lot of chili.", translation: "Vâng, tôi thích đồ cay. Ở Việt Nam chúng tôi ăn nhiều ớt." },
    ],
    roleplay: {
      title: "Hawker Centre Lunch", scenario: "Ordering and chatting at Maxwell Food Centre",
      yourRole: "Hungry developer exploring Singapore food", theirRole: "Rachel, colleague",
      lines: [
        { speaker: "them", speakerName: "Rachel", text: "What are you getting? The queue for chicken rice is long!", translation: "Bạn lấy gì? Hàng chờ cơm gà dài lắm!" },
        { speaker: "you", speakerName: "You", text: "I'll queue! It must be worth it. Any other must-tries?", translation: "Tôi sẽ xếp hàng! Chắc phải ngon lắm. Có gì phải thử nữa không?", hint: "Show enthusiasm for local food" },
        { speaker: "them", speakerName: "Rachel", text: "Try the char kway teow after! It's my favourite.", translation: "Thử char kway teow sau nhé! Đó là món yêu thích của tôi." },
        { speaker: "you", speakerName: "You", text: "Deal! I want to try everything while I'm here.", translation: "Đồng ý! Tôi muốn thử mọi thứ khi còn ở đây.", hint: "Be adventurous and positive" },
      ]
    },
    dailyTip: { title: "Hawker Culture", content: "Hawker centres are Singapore's social heart. Showing genuine interest in local food builds strong bonds with colleagues.", singlishNote: "'Shiok!' means 'Amazing!' or 'Delicious!' — use it and your colleagues will love you." }
  },
  {
    day: 5, title: "Project Presentation", subtitle: "Presenting Technical Work Clearly", emoji: "📊",
    context: "Presenting the app features to non-technical HR and economics team.",
    gradient: ["#8b5cf6", "#6366f1"],
    dialogue: {
      context: "Presenting app features in a meeting room",
      lines: [
        { speaker: "You", role: "Developer", text: "So, let me walk you through the main features.", translation: "Vậy, để tôi hướng dẫn bạn qua các tính năng chính." },
        { speaker: "Janet", role: "HR Director", text: "Can you explain how the data is stored?", translation: "Bạn có thể giải thích cách dữ liệu được lưu trữ không?" },
        { speaker: "You", role: "Developer", text: "Sure! Think of it like a digital filing cabinet.", translation: "Chắc chắn! Hãy nghĩ nó như tủ hồ sơ kỹ thuật số." },
        { speaker: "Janet", role: "HR Director", text: "Oh, that makes sense! Is the data secure?", translation: "Ồ, có vẻ hợp lý! Dữ liệu có bảo mật không?" },
        { speaker: "You", role: "Developer", text: "Absolutely. We encrypt everything and use role-based access.", translation: "Hoàn toàn. Chúng tôi mã hóa mọi thứ và dùng kiểm soát quyền." },
      ]
    },
    keyPhrases: [
      { phrase: "Let me walk you through", meaning: "I'll explain step by step", example: "Let me walk you through the dashboard.", exampleTranslation: "Để tôi hướng dẫn bạn qua dashboard." },
      { phrase: "Think of it as", meaning: "Using an analogy to explain", example: "Think of it as a digital library.", exampleTranslation: "Hãy nghĩ nó như một thư viện kỹ thuật số." },
      { phrase: "In simple terms", meaning: "Explaining without jargon", example: "In simple terms, it syncs automatically.", exampleTranslation: "Nói đơn giản, nó tự động đồng bộ." },
    ],
    shadowSentences: [
      { text: "I'll keep the technical jargon to a minimum.", translation: "Tôi sẽ giảm thiểu thuật ngữ kỹ thuật.", tip: "Show awareness of your audience" },
      { text: "The key benefit for your team is saving two hours daily.", translation: "Lợi ích chính cho team của bạn là tiết kiệm hai giờ mỗi ngày.", tip: "Always connect tech to business value" },
      { text: "Are there any questions so far?", translation: "Có câu hỏi nào đến đây chưa?", tip: "Pause and check understanding regularly" },
    ],
    speakingPrompts: [
      { situation: "Explaining a complex feature simply", theyAsk: "How does the login system work?", yourTarget: "It's like a key and lock. Each user has a unique digital key.", translation: "Nó như chìa khóa và ổ khóa. Mỗi người dùng có chìa khóa kỹ thuật số riêng." },
      { situation: "Handling a tough question", theyAsk: "What happens if the server crashes?", yourTarget: "Good question. We have automatic backups every hour.", translation: "Câu hỏi hay. Chúng tôi có backup tự động mỗi giờ." },
    ],
    roleplay: {
      title: "Tech Demo to HR Team", scenario: "Demo the app to non-technical colleagues",
      yourRole: "Developer presenting features", theirRole: "Janet, HR Director",
      lines: [
        { speaker: "them", speakerName: "Janet", text: "I'm not very technical. Will this be hard to use?", translation: "Tôi không rành kỹ thuật. Cái này có khó dùng không?" },
        { speaker: "you", speakerName: "You", text: "Not at all! It's designed to be very simple and intuitive.", translation: "Không hề! Nó được thiết kế rất đơn giản và trực quan.", hint: "Be reassuring and confident" },
        { speaker: "them", speakerName: "Janet", text: "What if something goes wrong? Who do I call?", translation: "Nếu có gì xảy ra thì sao? Tôi gọi ai?" },
        { speaker: "you", speakerName: "You", text: "You can reach me directly. I'll also write a simple guide.", translation: "Bạn có thể liên hệ tôi trực tiếp. Tôi cũng sẽ viết hướng dẫn đơn giản.", hint: "Offer support proactively" },
      ]
    },
    dailyTip: { title: "Presenting to Non-Tech Audiences", content: "Always lead with the business benefit, not the technology. Use analogies from everyday life. Check for understanding frequently." }
  },
  {
    day: 6, title: "Salary & Benefits Discussion", subtitle: "Professional Negotiations", emoji: "💰",
    context: "HR brings up compensation package for the project collaboration.",
    gradient: ["#8b5cf6", "#6366f1"],
    dialogue: {
      context: "One-on-one with HR about project terms",
      lines: [
        { speaker: "Sarah", role: "HR Manager", text: "We'd like to discuss the rate for this engagement.", translation: "Chúng tôi muốn thảo luận về mức phí cho dự án này." },
        { speaker: "You", role: "Developer", text: "Of course. I've prepared some thoughts on that.", translation: "Tất nhiên. Tôi đã chuẩn bị một số suy nghĩ về điều đó." },
        { speaker: "Sarah", role: "HR Manager", text: "What's your expected daily rate?", translation: "Mức phí hàng ngày mong đợi của bạn là bao nhiêu?" },
        { speaker: "You", role: "Developer", text: "Based on the scope, I was thinking around 800 SGD.", translation: "Dựa trên phạm vi, tôi nghĩ khoảng 800 SGD." },
        { speaker: "Sarah", role: "HR Manager", text: "That's reasonable. We can work with that.", translation: "Điều đó hợp lý. Chúng tôi có thể chấp nhận điều đó." },
      ]
    },
    keyPhrases: [
      { phrase: "Based on my research", meaning: "Your answer is well-informed", example: "Based on my research, the market rate is higher.", exampleTranslation: "Dựa trên nghiên cứu của tôi, mức thị trường cao hơn." },
      { phrase: "I'm open to discussion", meaning: "Willing to negotiate", example: "I'm open to discussion on the timeline.", exampleTranslation: "Tôi sẵn sàng thảo luận về timeline." },
      { phrase: "Could we revisit that?", meaning: "Ask to reconsider a point", example: "Could we revisit the payment schedule?", exampleTranslation: "Chúng ta có thể xem xét lại lịch thanh toán không?" },
    ],
    shadowSentences: [
      { text: "I believe my rate reflects the value I bring.", translation: "Tôi tin mức phí của tôi phản ánh giá trị tôi mang lại.", tip: "Be confident but not arrogant" },
      { text: "Is there flexibility on the project timeline?", translation: "Có linh hoạt về timeline dự án không?", tip: "Ask about flexibility professionally" },
      { text: "I'm looking for a long-term partnership.", translation: "Tôi đang tìm kiếm một quan hệ đối tác lâu dài.", tip: "Show interest beyond this one project" },
    ],
    speakingPrompts: [
      { situation: "Being asked about your rate", theyAsk: "What do you charge per day?", yourTarget: "For a project of this scope, I typically charge 800 to 1000 SGD.", translation: "Với dự án ở quy mô này, tôi thường tính 800 đến 1000 SGD." },
      { situation: "Negotiating terms", theyAsk: "Can we lower the rate a bit?", yourTarget: "I can consider that if we extend the contract by one week.", translation: "Tôi có thể xem xét nếu chúng ta kéo dài hợp đồng thêm một tuần." },
    ],
    roleplay: {
      title: "Contract Negotiation", scenario: "Discussing rates with HR",
      yourRole: "Developer negotiating fairly", theirRole: "Sarah, HR Manager",
      lines: [
        { speaker: "them", speakerName: "Sarah", text: "Our budget is 700 SGD per day. Is that workable?", translation: "Ngân sách của chúng tôi là 700 SGD mỗi ngày. Được không?" },
        { speaker: "you", speakerName: "You", text: "I appreciate the offer. Could we go to 800? The work is quite specialized.", translation: "Tôi đánh giá cao đề nghị. Chúng ta có thể đến 800 không? Công việc khá chuyên biệt.", hint: "Counter with reasoning" },
        { speaker: "them", speakerName: "Sarah", text: "Let me check with management. What's your flexibility?", translation: "Để tôi kiểm tra với quản lý. Bạn linh hoạt thế nào?" },
        { speaker: "you", speakerName: "You", text: "750 would work if we include travel reimbursement.", translation: "750 được nếu bao gồm hoàn trả chi phí đi lại.", hint: "Find a middle ground" },
      ]
    },
    dailyTip: { title: "Negotiation Culture in Singapore", content: "Singaporeans appreciate directness in negotiations, but always with respect. Research market rates beforehand. Never give ultimatums." }
  },
  {
    day: 7, title: "System Design Discussion", subtitle: "Technical Deep Dives", emoji: "🏗️",
    context: "Deep dive with tech-savvy colleagues on architecture decisions.",
    gradient: ["#10b981", "#14b8a6"],
    dialogue: {
      context: "Architecture discussion with the product team",
      lines: [
        { speaker: "Kevin", role: "Tech Lead", text: "Walk me through your database architecture.", translation: "Hãy giải thích kiến trúc cơ sở dữ liệu của bạn." },
        { speaker: "You", role: "Developer", text: "We use MongoDB for flexible document storage.", translation: "Chúng tôi dùng MongoDB cho lưu trữ tài liệu linh hoạt." },
        { speaker: "Kevin", role: "Tech Lead", text: "How do you handle concurrent users?", translation: "Bạn xử lý người dùng đồng thời như thế nào?" },
        { speaker: "You", role: "Developer", text: "We use connection pooling and horizontal scaling.", translation: "Chúng tôi dùng connection pooling và mở rộng theo chiều ngang." },
        { speaker: "Kevin", role: "Tech Lead", text: "Smart. What about data consistency?", translation: "Thông minh. Còn tính nhất quán dữ liệu thì sao?" },
      ]
    },
    keyPhrases: [
      { phrase: "The tradeoff here is", meaning: "Explaining pros and cons", example: "The tradeoff here is speed versus consistency.", exampleTranslation: "Sự đánh đổi ở đây là tốc độ so với tính nhất quán." },
      { phrase: "We went with X because", meaning: "Explaining a decision", example: "We went with React because of ecosystem maturity.", exampleTranslation: "Chúng tôi chọn React vì hệ sinh thái trưởng thành." },
      { phrase: "In hindsight", meaning: "Looking back at a decision", example: "In hindsight, microservices was too complex.", exampleTranslation: "Nhìn lại, microservices quá phức tạp." },
    ],
    shadowSentences: [
      { text: "We chose a monolithic architecture to move faster initially.", translation: "Chúng tôi chọn kiến trúc monolithic để di chuyển nhanh hơn ban đầu.", tip: "Explain reasoning for technical decisions" },
      { text: "The main bottleneck right now is the API response time.", translation: "Điểm nghẽn chính hiện tại là thời gian phản hồi API.", tip: "Be specific about performance issues" },
      { text: "We're planning to migrate to microservices in Q3.", translation: "Chúng tôi đang lên kế hoạch chuyển sang microservices trong Q3.", tip: "Use quarters for timeline" },
    ],
    speakingPrompts: [
      { situation: "Explaining a tech choice", theyAsk: "Why did you choose Next.js over other frameworks?", yourTarget: "Next.js gives us server-side rendering and great performance out of the box.", translation: "Next.js cung cấp server-side rendering và hiệu suất tốt ngay từ đầu." },
      { situation: "Discussing a past mistake", theyAsk: "What would you do differently?", yourTarget: "We'd invest more time in API design upfront to avoid rework.", translation: "Chúng tôi sẽ đầu tư nhiều thời gian hơn vào thiết kế API từ đầu để tránh làm lại." },
    ],
    roleplay: {
      title: "Architecture Review", scenario: "Defending your technical choices",
      yourRole: "Developer explaining architecture", theirRole: "Kevin, Tech Lead",
      lines: [
        { speaker: "them", speakerName: "Kevin", text: "Why MongoDB instead of PostgreSQL for this project?", translation: "Tại sao MongoDB thay vì PostgreSQL cho dự án này?" },
        { speaker: "you", speakerName: "You", text: "The data structure is highly flexible. SQL schemas would slow us down.", translation: "Cấu trúc dữ liệu rất linh hoạt. Schema SQL sẽ làm chậm chúng tôi.", hint: "Give clear technical reasoning" },
        { speaker: "them", speakerName: "Kevin", text: "What about complex queries and reporting?", translation: "Còn các truy vấn phức tạp và báo cáo thì sao?" },
        { speaker: "you", speakerName: "You", text: "We use MongoDB aggregation pipelines. They're powerful enough for our needs.", translation: "Chúng tôi dùng aggregation pipelines của MongoDB. Đủ mạnh cho nhu cầu của chúng tôi.", hint: "Address concerns directly" },
      ]
    },
    dailyTip: { title: "System Design Discussions", content: "In Singapore tech culture, back up decisions with data and benchmarks. It's fine to say 'I'll verify that and get back to you' — honesty beats bluffing." }
  },
  {
    day: 8, title: "After-Work Drinks", subtitle: "Relaxed Social English", emoji: "🍺",
    context: "Colleagues invite you for drinks at a rooftop bar after work.",
    gradient: ["#10b981", "#14b8a6"],
    dialogue: {
      context: "Evening at a rooftop bar in Clarke Quay",
      lines: [
        { speaker: "Amy", role: "Talent Acquisition", text: "So, what do you think of Singapore so far?", translation: "Vậy, bạn nghĩ gì về Singapore đến giờ?" },
        { speaker: "You", role: "Developer", text: "Honestly, I'm blown away. The efficiency here is incredible.", translation: "Thật sự, tôi bị ấn tượng mạnh. Hiệu quả ở đây thật đáng kinh ngạc." },
        { speaker: "Amy", role: "Talent Acquisition", text: "Ha! Yes, we do things fast here. Do you like the weather?", translation: "Ha! Vâng, chúng tôi làm nhanh ở đây. Bạn có thích thời tiết không?" },
        { speaker: "You", role: "Developer", text: "It's very warm, but I'm getting used to it!", translation: "Rất ấm, nhưng tôi đang quen dần với nó!" },
        { speaker: "Amy", role: "Talent Acquisition", text: "Just wait for the rain. Singapore storms are dramatic!", translation: "Hãy chờ cơn mưa. Bão Singapore rất ấn tượng!" },
      ]
    },
    keyPhrases: [
      { phrase: "I'm blown away", meaning: "Extremely impressed", example: "I'm blown away by the skyline here.", exampleTranslation: "Tôi bị ấn tượng mạnh bởi đường chân trời ở đây." },
      { phrase: "To be honest", meaning: "Being frank/candid", example: "To be honest, I prefer coffee over beer.", exampleTranslation: "Thật lòng mà nói, tôi thích cà phê hơn bia." },
      { phrase: "What do you do for fun?", meaning: "Asking about hobbies", example: "What do you do for fun on weekends?", exampleTranslation: "Bạn làm gì cho vui vào cuối tuần?" },
    ],
    shadowSentences: [
      { text: "I never expected Singapore to be this impressive.", translation: "Tôi không ngờ Singapore lại ấn tượng đến vậy.", tip: "Express genuine surprise positively" },
      { text: "Back home we have a strong café culture too.", translation: "Ở nhà chúng tôi cũng có văn hóa cà phê mạnh.", tip: "Connect experiences to build rapport" },
      { text: "I could definitely see myself living here someday.", translation: "Tôi hoàn toàn có thể hình dung mình sống ở đây một ngày nào đó.", tip: "Show genuine appreciation for Singapore" },
    ],
    speakingPrompts: [
      { situation: "Sharing your impression", theyAsk: "What surprised you most about Singapore?", yourTarget: "How clean everything is! And how easy the public transport is to navigate.", translation: "Mọi thứ sạch đến mức nào! Và giao thông công cộng dễ di chuyển thế nào." },
      { situation: "Talking about your interests", theyAsk: "What do you like to do after work?", yourTarget: "I love coding personal projects and exploring local food scenes.", translation: "Tôi thích code các dự án cá nhân và khám phá ẩm thực địa phương." },
    ],
    roleplay: {
      title: "Rooftop Bar Conversation", scenario: "Casual chat after work",
      yourRole: "Developer enjoying the evening", theirRole: "Amy, Talent Acquisition",
      lines: [
        { speaker: "them", speakerName: "Amy", text: "What's Ho Chi Minh City like? I've never been!", translation: "TP Hồ Chí Minh như thế nào? Tôi chưa đến bao giờ!" },
        { speaker: "you", speakerName: "You", text: "It's vibrant and chaotic in the best way. Amazing food and energy.", translation: "Nó sôi động và náo nhiệt theo cách tốt nhất. Đồ ăn và năng lượng tuyệt vời.", hint: "Describe your city with pride" },
        { speaker: "them", speakerName: "Amy", text: "Would you recommend visiting?", translation: "Bạn có recommend đến thăm không?" },
        { speaker: "you", speakerName: "You", text: "Absolutely! Come in November — best weather and great food festivals.", translation: "Chắc chắn rồi! Đến tháng 11 — thời tiết tốt nhất và lễ hội ẩm thực tuyệt vời.", hint: "Give specific helpful advice" },
      ]
    },
    dailyTip: { title: "Social English Tips", content: "Social settings are where real connections form. Ask follow-up questions to show genuine interest. Singaporeans love talking about food — it's always a safe topic!", singlishNote: "'Wah!' expresses amazement or surprise — very common in casual settings." }
  },
  {
    day: 9, title: "Handling Feedback", subtitle: "Professional Responses to Criticism", emoji: "🎯",
    context: "A colleague gives critical feedback on your work.",
    gradient: ["#10b981", "#14b8a6"],
    dialogue: {
      context: "Code review with senior developer",
      lines: [
        { speaker: "Wei", role: "Senior Dev", text: "I reviewed your pull request. Some things need fixing.", translation: "Tôi đã xem pull request của bạn. Một số thứ cần sửa." },
        { speaker: "You", role: "Developer", text: "Of course, I appreciate the feedback. What specifically?", translation: "Tất nhiên, tôi đánh giá cao phản hồi. Cụ thể là gì?" },
        { speaker: "Wei", role: "Senior Dev", text: "The error handling is inconsistent across the API.", translation: "Xử lý lỗi không nhất quán trên toàn API." },
        { speaker: "You", role: "Developer", text: "You're right, I should have standardized that. I'll fix it today.", translation: "Bạn đúng, tôi đáng lẽ phải chuẩn hóa điều đó. Tôi sẽ sửa hôm nay." },
        { speaker: "Wei", role: "Senior Dev", text: "Good attitude. The overall logic is solid though.", translation: "Thái độ tốt. Tuy nhiên logic tổng thể thì chắc chắn." },
      ]
    },
    keyPhrases: [
      { phrase: "I take that point", meaning: "Accepting valid criticism", example: "I take that point about the performance.", exampleTranslation: "Tôi chấp nhận điểm đó về hiệu suất." },
      { phrase: "That's a fair critique", meaning: "Agreeing with feedback", example: "That's a fair critique of my approach.", exampleTranslation: "Đó là đánh giá công bằng về cách tiếp cận của tôi." },
      { phrase: "I'll address that immediately", meaning: "Promising quick action", example: "I'll address that issue immediately.", exampleTranslation: "Tôi sẽ giải quyết vấn đề đó ngay lập tức." },
    ],
    shadowSentences: [
      { text: "Thank you for the detailed feedback, it's very helpful.", translation: "Cảm ơn bạn về phản hồi chi tiết, rất hữu ích.", tip: "Always thank the reviewer first" },
      { text: "I see the issue now. I'll have a fix ready by EOD.", translation: "Tôi thấy vấn đề rồi. Tôi sẽ có bản sửa trước cuối ngày.", tip: "EOD = End Of Day, common in offices" },
      { text: "Could you walk me through what you'd expect instead?", translation: "Bạn có thể hướng dẫn tôi bạn kỳ vọng gì thay thế không?", tip: "Ask for the expected outcome" },
    ],
    speakingPrompts: [
      { situation: "Receiving negative feedback", theyAsk: "This code is messy. Did you test this?", yourTarget: "You're right, I rushed that part. I'll refactor it properly today.", translation: "Bạn đúng, tôi đã làm vội phần đó. Tôi sẽ refactor đúng cách hôm nay." },
      { situation: "Defending your decision politely", theyAsk: "Why did you use this approach?", yourTarget: "I chose it for performance reasons, but I'm open to alternatives.", translation: "Tôi chọn nó vì lý do hiệu suất, nhưng tôi sẵn sàng với các lựa chọn thay thế." },
    ],
    roleplay: {
      title: "Code Review Feedback", scenario: "Receiving and responding to feedback",
      yourRole: "Developer receiving review comments", theirRole: "Wei, Senior Developer",
      lines: [
        { speaker: "them", speakerName: "Wei", text: "Your API doesn't follow REST conventions consistently.", translation: "API của bạn không tuân theo quy ước REST một cách nhất quán." },
        { speaker: "you", speakerName: "You", text: "That's fair feedback. Which endpoints are the issue?", translation: "Đó là phản hồi công bằng. Endpoint nào là vấn đề?", hint: "Stay calm and ask for specifics" },
        { speaker: "them", speakerName: "Wei", text: "The POST and PUT ones. They should return different status codes.", translation: "Các endpoint POST và PUT. Chúng nên trả về mã trạng thái khác nhau." },
        { speaker: "you", speakerName: "You", text: "Understood. I'll fix those today and re-request review.", translation: "Hiểu rồi. Tôi sẽ sửa hôm nay và yêu cầu review lại.", hint: "Commit to a timeline" },
      ]
    },
    dailyTip: { title: "Taking Feedback Professionally", content: "In Singapore workplaces, feedback is direct. Receiving it gracefully and acting on it quickly builds immense respect and trust." }
  },
  {
    day: 10, title: "Client Call", subtitle: "Professional Phone & Video English", emoji: "📱",
    context: "Joining a client video call with Singapore and regional stakeholders.",
    gradient: ["#f59e0b", "#f97316"],
    dialogue: {
      context: "Video call with external client",
      lines: [
        { speaker: "You", role: "Developer", text: "Good afternoon, can everyone hear me clearly?", translation: "Chào buổi chiều, mọi người có nghe tôi rõ không?" },
        { speaker: "Tom", role: "Client", text: "Yes, you're coming through clearly. Thanks for joining.", translation: "Vâng, bạn nghe rõ. Cảm ơn bạn đã tham gia." },
        { speaker: "You", role: "Developer", text: "Happy to be here. I'll be presenting the demo today.", translation: "Vui được tham gia. Tôi sẽ trình bày demo hôm nay." },
        { speaker: "Tom", role: "Client", text: "Before we start, can you share your screen?", translation: "Trước khi bắt đầu, bạn có thể chia sẻ màn hình không?" },
        { speaker: "You", role: "Developer", text: "Sure, one moment while I pull up the application.", translation: "Chắc chắn, một moment trong khi tôi mở ứng dụng." },
      ]
    },
    keyPhrases: [
      { phrase: "Can you hear me?", meaning: "Checking audio on calls", example: "Hi, can you hear me okay?", exampleTranslation: "Chào, bạn có nghe tôi không?" },
      { phrase: "Let me pull up", meaning: "Opening something to share", example: "Let me pull up the presentation.", exampleTranslation: "Để tôi mở bài thuyết trình." },
      { phrase: "I'll circle back on that", meaning: "Will follow up later", example: "I'll circle back on that after the call.", exampleTranslation: "Tôi sẽ quay lại vấn đề đó sau cuộc gọi." },
    ],
    shadowSentences: [
      { text: "Let me share my screen so you can see the demo.", translation: "Để tôi chia sẻ màn hình để bạn có thể xem demo.", tip: "Clear and action-oriented" },
      { text: "I'll send over the documentation after this call.", translation: "Tôi sẽ gửi tài liệu sau cuộc gọi này.", tip: "'Send over' sounds more natural than 'send'" },
      { text: "Does that answer your question or should I elaborate?", translation: "Điều đó có trả lời câu hỏi của bạn hay tôi nên giải thích thêm?", tip: "Always check if your answer was sufficient" },
    ],
    speakingPrompts: [
      { situation: "Opening a call", theyAsk: "Are you ready to start?", yourTarget: "Yes! I have my presentation ready. Should I share my screen?", translation: "Vâng! Tôi đã chuẩn bị bài thuyết trình. Tôi có nên chia sẻ màn hình không?" },
      { situation: "Answering a question you need to research", theyAsk: "What's your server uptime SLA?", yourTarget: "Great question. I'll confirm the exact number and follow up by email.", translation: "Câu hỏi hay. Tôi sẽ xác nhận con số chính xác và theo dõi qua email." },
    ],
    roleplay: {
      title: "Client Demo Call", scenario: "Running a product demo for a client",
      yourRole: "Developer running the demo", theirRole: "Tom, Client",
      lines: [
        { speaker: "them", speakerName: "Tom", text: "We're concerned about the loading speed. Can you show us?", translation: "Chúng tôi lo ngại về tốc độ tải. Bạn có thể cho chúng tôi xem không?" },
        { speaker: "you", speakerName: "You", text: "Absolutely. Watch the dashboard load — it's under two seconds.", translation: "Chắc chắn. Xem dashboard tải — dưới hai giây.", hint: "Show confidence in your product" },
        { speaker: "them", speakerName: "Tom", text: "Impressive! What about mobile performance?", translation: "Ấn tượng! Còn hiệu suất di động thì sao?" },
        { speaker: "you", speakerName: "You", text: "Even faster on mobile. We optimized specifically for that.", translation: "Thậm chí nhanh hơn trên di động. Chúng tôi tối ưu hóa đặc biệt cho điều đó.", hint: "Build on positive momentum" },
      ]
    },
    dailyTip: { title: "Video Call Professionalism", content: "Always test audio/video before joining. Have a clean background. Mute when not speaking. Take notes and follow up with a summary email." }
  },
  {
    day: 11, title: "Problem Solving Together", subtitle: "Collaborative Troubleshooting", emoji: "🔧",
    context: "A production bug surfaces. Time to collaborate under pressure.",
    gradient: ["#f59e0b", "#f97316"],
    dialogue: {
      context: "Urgent Slack call about a production issue",
      lines: [
        { speaker: "Lisa", role: "Product Manager", text: "We have a critical bug. Users can't log in.", translation: "Chúng ta có lỗi nghiêm trọng. Người dùng không thể đăng nhập." },
        { speaker: "You", role: "Developer", text: "On it. When did this start? Any recent deployments?", translation: "Tôi đang xử lý. Khi nào bắt đầu? Có deployment gần đây không?" },
        { speaker: "Lisa", role: "Product Manager", text: "About 30 minutes ago. No deployments since yesterday.", translation: "Khoảng 30 phút trước. Không có deployment từ hôm qua." },
        { speaker: "You", role: "Developer", text: "Got it. I'm checking the error logs now.", translation: "Hiểu rồi. Tôi đang kiểm tra error log ngay bây giờ." },
        { speaker: "Lisa", role: "Product Manager", text: "Keep us updated. The CEO is aware.", translation: "Cập nhật cho chúng tôi. CEO đã biết." },
      ]
    },
    keyPhrases: [
      { phrase: "I'm on it", meaning: "I'm handling it right now", example: "The server is down? I'm on it!", exampleTranslation: "Server bị down? Tôi đang xử lý!" },
      { phrase: "Root cause analysis", meaning: "Finding why something broke", example: "Let's do a root cause analysis.", exampleTranslation: "Hãy phân tích nguyên nhân gốc rễ." },
      { phrase: "ETA on the fix", meaning: "When will it be ready", example: "Can you give me an ETA on the fix?", exampleTranslation: "Bạn có thể cho tôi ETA về bản sửa không?" },
    ],
    shadowSentences: [
      { text: "I've identified the issue — it's a database connection timeout.", translation: "Tôi đã xác định vấn đề — đó là timeout kết nối database.", tip: "State clearly what you found" },
      { text: "We're about 15 minutes away from a fix.", translation: "Chúng tôi cách khoảng 15 phút so với bản sửa.", tip: "Give realistic ETAs" },
      { text: "I'll push the hotfix and monitor for 30 minutes.", translation: "Tôi sẽ push hotfix và theo dõi trong 30 phút.", tip: "Include monitoring in your plan" },
    ],
    speakingPrompts: [
      { situation: "Reporting status during incident", theyAsk: "What's the current status?", yourTarget: "I found the bug. It's a failed API call. Fix will be deployed in 10 minutes.", translation: "Tôi tìm thấy lỗi. Đó là API call thất bại. Bản sửa sẽ được triển khai trong 10 phút." },
      { situation: "Post-incident debrief", theyAsk: "How do we prevent this again?", yourTarget: "We need better monitoring and automated alerts for API failures.", translation: "Chúng ta cần giám sát tốt hơn và cảnh báo tự động cho các lỗi API." },
    ],
    roleplay: {
      title: "Production Incident Response", scenario: "Managing a critical bug under pressure",
      yourRole: "Developer leading the fix", theirRole: "Lisa, Product Manager",
      lines: [
        { speaker: "them", speakerName: "Lisa", text: "How serious is this? Should we send a status update?", translation: "Nghiêm trọng thế nào? Chúng ta có nên gửi cập nhật trạng thái không?" },
        { speaker: "you", speakerName: "You", text: "It's affecting about 30% of users. Yes, let's send a brief update.", translation: "Nó ảnh hưởng khoảng 30% người dùng. Vâng, hãy gửi cập nhật ngắn gọn.", hint: "Quantify the impact" },
        { speaker: "them", speakerName: "Lisa", text: "Can you write the customer-facing message?", translation: "Bạn có thể viết thông điệp đối mặt khách hàng không?" },
        { speaker: "you", speakerName: "You", text: "Yes. 'We are aware of a login issue and are working on a fix. ETA: 20 minutes.'", translation: "Vâng. 'Chúng tôi biết về vấn đề đăng nhập và đang khắc phục. ETA: 20 phút.'", hint: "Keep it short and reassuring" },
      ]
    },
    dailyTip: { title: "Crisis Communication", content: "During incidents, communicate frequently with clear ETAs. A short 'Working on it, update in 10 mins' beats silence. Own the problem and the solution." }
  },
  {
    day: 12, title: "End of Week Review", subtitle: "Progress Updates & Planning", emoji: "📈",
    context: "Friday afternoon review — discussing what's done and what's next.",
    gradient: ["#f59e0b", "#f97316"],
    dialogue: {
      context: "End-of-week team review meeting",
      lines: [
        { speaker: "Janet", role: "HR Director", text: "Great week, team. Anh, what's your highlight?", translation: "Tuần tốt lắm, team. Anh, điểm nổi bật của bạn là gì?" },
        { speaker: "You", role: "Developer", text: "We shipped the core features and fixed the production bug.", translation: "Chúng tôi đã ship các tính năng cốt lõi và sửa lỗi production." },
        { speaker: "Janet", role: "HR Director", text: "Excellent. What's the plan for next week?", translation: "Xuất sắc. Kế hoạch tuần tới là gì?" },
        { speaker: "You", role: "Developer", text: "Performance optimization and final testing before handover.", translation: "Tối ưu hóa hiệu suất và kiểm tra cuối trước khi bàn giao." },
        { speaker: "Janet", role: "HR Director", text: "Perfect. Let's make it count!", translation: "Hoàn hảo. Hãy tận dụng tốt!" },
      ]
    },
    keyPhrases: [
      { phrase: "We're on track", meaning: "Progressing as planned", example: "We're on track for the Friday deadline.", exampleTranslation: "Chúng ta đang đúng tiến độ cho deadline thứ Sáu." },
      { phrase: "Key takeaway", meaning: "Most important lesson", example: "The key takeaway is to test earlier.", exampleTranslation: "Bài học quan trọng nhất là kiểm tra sớm hơn." },
      { phrase: "Moving the needle", meaning: "Making real progress", example: "This feature really moved the needle.", exampleTranslation: "Tính năng này thực sự tạo ra tiến bộ thực sự." },
    ],
    shadowSentences: [
      { text: "We completed 90% of the sprint goals this week.", translation: "Chúng tôi đã hoàn thành 90% mục tiêu sprint tuần này.", tip: "Use percentages for clarity" },
      { text: "The remaining 10% will carry over to next week.", translation: "10% còn lại sẽ chuyển sang tuần tới.", tip: "'Carry over' is standard project vocabulary" },
      { text: "Overall it's been a very productive week.", translation: "Nhìn chung đây là một tuần rất hiệu quả.", tip: "End on a positive note" },
    ],
    speakingPrompts: [
      { situation: "Summarizing the week", theyAsk: "What did you accomplish this week?", yourTarget: "I completed the API, fixed three bugs, and set up the testing environment.", translation: "Tôi đã hoàn thành API, sửa ba lỗi và thiết lập môi trường kiểm tra." },
      { situation: "Planning next week", theyAsk: "What's your priority for next week?", yourTarget: "Final integration testing and writing the deployment documentation.", translation: "Kiểm tra tích hợp cuối cùng và viết tài liệu deployment." },
    ],
    roleplay: {
      title: "Friday Retrospective", scenario: "End-of-week reflection with the team",
      yourRole: "Developer sharing retrospective thoughts", theirRole: "Janet, HR Director",
      lines: [
        { speaker: "them", speakerName: "Janet", text: "What would you do differently next week?", translation: "Bạn sẽ làm gì khác đi vào tuần tới?" },
        { speaker: "you", speakerName: "You", text: "I'd start the testing earlier instead of leaving it to Friday.", translation: "Tôi sẽ bắt đầu kiểm tra sớm hơn thay vì để đến thứ Sáu.", hint: "Show self-awareness and growth mindset" },
        { speaker: "them", speakerName: "Janet", text: "Good insight. And what went really well?", translation: "Nhận thức tốt. Và điều gì thực sự tốt?" },
        { speaker: "you", speakerName: "You", text: "The team communication was excellent. Daily syncs made a big difference.", translation: "Giao tiếp nhóm rất xuất sắc. Sync hàng ngày tạo ra sự khác biệt lớn.", hint: "Acknowledge team contributions" },
      ]
    },
    dailyTip: { title: "End-of-Week Communication", content: "A brief Friday email summarizing wins, blockers removed, and next week's priorities builds trust and keeps everyone aligned." }
  },
  {
    day: 13, title: "Exploring the City", subtitle: "Weekend Casual English", emoji: "🌆",
    context: "Weekend with colleagues — exploring Sentosa and the CBD.",
    gradient: ["#f43f5e", "#ec4899"],
    dialogue: {
      context: "Exploring Gardens by the Bay with colleagues",
      lines: [
        { speaker: "Rachel", role: "Economist", text: "Have you been to Gardens by the Bay yet?", translation: "Bạn đã đến Gardens by the Bay chưa?" },
        { speaker: "You", role: "Developer", text: "Not yet! I've heard so much about it though.", translation: "Chưa! Tôi nghe nhiều về nó lắm." },
        { speaker: "Rachel", role: "Economist", text: "You'll love it. The light show at night is magical.", translation: "Bạn sẽ thích nó. Màn trình diễn ánh sáng ban đêm thật kỳ diệu." },
        { speaker: "You", role: "Developer", text: "I can't wait! What time should we go?", translation: "Tôi nóng lòng chờ đợi! Chúng ta nên đi lúc mấy giờ?" },
        { speaker: "Rachel", role: "Economist", text: "7pm is perfect. The supertrees light up at 7:45.", translation: "7 giờ tối là hoàn hảo. Supertrees sáng lên lúc 7:45." },
      ]
    },
    keyPhrases: [
      { phrase: "I've been meaning to", meaning: "Something you intended to do", example: "I've been meaning to visit Marina Bay.", exampleTranslation: "Tôi định đến thăm Marina Bay." },
      { phrase: "It's worth checking out", meaning: "Recommending something", example: "Chinatown is worth checking out on Sunday.", exampleTranslation: "Chinatown đáng đến thăm vào Chủ nhật." },
      { phrase: "Let's make a day of it", meaning: "Spend the whole day there", example: "Sentosa? Let's make a day of it!", exampleTranslation: "Sentosa? Hãy dành cả ngày ở đó!" },
    ],
    shadowSentences: [
      { text: "Singapore has so much more than I expected.", translation: "Singapore có nhiều hơn tôi mong đợi rất nhiều.", tip: "Show genuine amazement" },
      { text: "I could spend a whole week just exploring the food scene.", translation: "Tôi có thể dành cả tuần chỉ để khám phá ẩm thực.", tip: "Food talk always connects in Singapore" },
      { text: "What's your favourite hidden gem in Singapore?", translation: "Viên ngọc ẩn yêu thích của bạn ở Singapore là gì?", tip: "'Hidden gem' means a lesser-known great spot" },
    ],
    speakingPrompts: [
      { situation: "Recommending Vietnam", theyAsk: "Where should I visit in Vietnam?", yourTarget: "Da Nang for beaches, Hoi An for culture, and HCMC for the food and nightlife.", translation: "Đà Nẵng cho bãi biển, Hội An cho văn hóa, và HCM cho đồ ăn và cuộc sống về đêm." },
      { situation: "Asking for travel tips", theyAsk: "Any tips for getting around Singapore?", yourTarget: "The MRT is excellent. Get an EZ-Link card and you're set.", translation: "MRT rất tuyệt vời. Mua thẻ EZ-Link là xong." },
    ],
    roleplay: {
      title: "Weekend City Exploration", scenario: "Planning a weekend outing with colleagues",
      yourRole: "Developer eager to explore Singapore", theirRole: "Rachel, colleague and guide",
      lines: [
        { speaker: "them", speakerName: "Rachel", text: "What do you want to do on Saturday?", translation: "Bạn muốn làm gì vào thứ Bảy?" },
        { speaker: "you", speakerName: "You", text: "I want to see Gardens by the Bay and try more hawker food!", translation: "Tôi muốn xem Gardens by the Bay và thử thêm đồ ăn hawker!", hint: "Show enthusiasm for local experiences" },
        { speaker: "them", speakerName: "Rachel", text: "Perfect combo! We can go to Tiong Bahru for brunch first.", translation: "Combo hoàn hảo! Chúng ta có thể đến Tiong Bahru ăn brunch trước." },
        { speaker: "you", speakerName: "You", text: "Sounds amazing! I'll look up the best stalls there tonight.", translation: "Nghe tuyệt vời! Tôi sẽ tìm hiểu những quầy tốt nhất ở đó tối nay.", hint: "Show proactive excitement" },
      ]
    },
    dailyTip: { title: "Singapore Weekend Activities", content: "Show interest in local culture — visit hawker centres, try neighbourhood walks, attend free events. Colleagues will love being your local guide!", singlishNote: "'Shiok lah!' = 'This is absolutely amazing!' — perfect for reacting to food or sights." }
  },
  {
    day: 14, title: "Wrapping Up the Project", subtitle: "Handover & Documentation", emoji: "📋",
    context: "Preparing the handover before your last day.",
    gradient: ["#f43f5e", "#ec4899"],
    dialogue: {
      context: "Handover meeting with the full team",
      lines: [
        { speaker: "You", role: "Developer", text: "I've prepared the full technical documentation for the handover.", translation: "Tôi đã chuẩn bị tài liệu kỹ thuật đầy đủ để bàn giao." },
        { speaker: "Janet", role: "HR Director", text: "Excellent! Have you set up the admin accounts?", translation: "Xuất sắc! Bạn đã thiết lập tài khoản admin chưa?" },
        { speaker: "You", role: "Developer", text: "Yes. I'll walk Sarah and the team through it after this.", translation: "Vâng. Tôi sẽ hướng dẫn Sarah và team sau buổi họp này." },
        { speaker: "Janet", role: "HR Director", text: "Great. And remote support after you leave?", translation: "Tốt. Còn hỗ trợ từ xa sau khi bạn rời đi thì sao?" },
        { speaker: "You", role: "Developer", text: "I'll be available on Slack for 30 days post-handover.", translation: "Tôi sẽ có mặt trên Slack trong 30 ngày sau khi bàn giao." },
      ]
    },
    keyPhrases: [
      { phrase: "Let me walk you through", meaning: "Guide someone step by step", example: "Let me walk you through the admin panel.", exampleTranslation: "Để tôi hướng dẫn bạn qua bảng điều khiển admin." },
      { phrase: "The documentation covers", meaning: "What the docs include", example: "The documentation covers all API endpoints.", exampleTranslation: "Tài liệu bao gồm tất cả các endpoint API." },
      { phrase: "Feel free to reach out", meaning: "You can contact me anytime", example: "Feel free to reach out if you have questions.", exampleTranslation: "Cứ liên hệ tôi nếu bạn có câu hỏi." },
    ],
    shadowSentences: [
      { text: "Everything is documented in the shared Google Drive folder.", translation: "Mọi thứ đều được ghi lại trong thư mục Google Drive chung.", tip: "Reference specific locations for resources" },
      { text: "The deployment process takes about 10 minutes end-to-end.", translation: "Quy trình triển khai mất khoảng 10 phút từ đầu đến cuối.", tip: "Give specific timeframes" },
      { text: "I'm happy to do a screen share if you get stuck.", translation: "Tôi vui lòng thực hiện chia sẻ màn hình nếu bạn gặp khó khăn.", tip: "Offer concrete support" },
    ],
    speakingPrompts: [
      { situation: "Explaining the handover package", theyAsk: "What's included in the handover?", yourTarget: "Technical docs, admin guide, video walkthrough, and emergency contacts.", translation: "Tài liệu kỹ thuật, hướng dẫn admin, video walkthrough, và liên hệ khẩn cấp." },
      { situation: "Reassuring the team", theyAsk: "What if something breaks after you leave?", yourTarget: "All fixes are documented. I'm also reachable via email for urgent issues.", translation: "Tất cả các bản sửa đều được ghi lại. Tôi cũng có thể liên hệ qua email cho các vấn đề khẩn cấp." },
    ],
    roleplay: {
      title: "Technical Handover", scenario: "Walking the team through the system",
      yourRole: "Developer handing over the system", theirRole: "Sarah, who will manage it",
      lines: [
        { speaker: "them", speakerName: "Sarah", text: "I'm a bit nervous about maintaining this. It looks complex.", translation: "Tôi hơi lo lắng về việc bảo trì cái này. Trông có vẻ phức tạp." },
        { speaker: "you", speakerName: "You", text: "It looks complex but daily operations are very simple. Let me show you.", translation: "Trông có vẻ phức tạp nhưng vận hành hàng ngày rất đơn giản. Để tôi chỉ bạn.", hint: "Be reassuring and clear" },
        { speaker: "them", speakerName: "Sarah", text: "What's the most common issue you faced?", translation: "Vấn đề phổ biến nhất bạn gặp là gì?" },
        { speaker: "you", speakerName: "You", text: "Cache issues. I've written a one-page guide just for that scenario.", translation: "Vấn đề cache. Tôi đã viết hướng dẫn một trang chỉ cho tình huống đó.", hint: "Show you've anticipated their needs" },
      ]
    },
    dailyTip: { title: "Great Handovers", content: "The best handovers include not just what to do, but why and what to do when things go wrong. A video walkthrough is more valuable than written docs alone." }
  },
  {
    day: 15, title: "Farewell & Future Plans", subtitle: "Goodbyes & Staying Connected", emoji: "✈️",
    context: "Last day in Singapore — saying goodbye and talking about the future.",
    gradient: ["#f43f5e", "#ec4899"],
    dialogue: {
      context: "Farewell gathering at the office",
      lines: [
        { speaker: "Janet", role: "HR Director", text: "Anh, it's been an absolute pleasure working with you.", translation: "Anh, thật là một niềm vui tuyệt vời khi làm việc cùng bạn." },
        { speaker: "You", role: "Developer", text: "The feeling is mutual! This trip exceeded all my expectations.", translation: "Cảm giác là tương hỗ! Chuyến đi này vượt quá mọi kỳ vọng của tôi." },
        { speaker: "Sarah", role: "HR Manager", text: "We hope this is just the beginning of many collaborations.", translation: "Chúng tôi hy vọng đây chỉ là khởi đầu của nhiều hợp tác." },
        { speaker: "You", role: "Developer", text: "Absolutely! I'd love to come back for the next phase.", translation: "Chắc chắn rồi! Tôi rất muốn quay lại cho giai đoạn tiếp theo." },
        { speaker: "Rachel", role: "Economist", text: "Stay in touch! Singapore will always have a hawker stall for you.", translation: "Giữ liên lạc nhé! Singapore luôn có quầy hawker cho bạn." },
      ]
    },
    keyPhrases: [
      { phrase: "It's been a pleasure", meaning: "Formal goodbye expression", example: "It's been a pleasure working with you.", exampleTranslation: "Thật là niềm vui khi làm việc với bạn." },
      { phrase: "I'll be in touch", meaning: "I will contact you", example: "I'll be in touch about the next project.", exampleTranslation: "Tôi sẽ liên lạc về dự án tiếp theo." },
      { phrase: "Looking forward to next time", meaning: "Hoping to meet again", example: "Looking forward to next time in Singapore!", exampleTranslation: "Mong gặp lại lần sau ở Singapore!" },
    ],
    shadowSentences: [
      { text: "This has been one of the best professional experiences of my life.", translation: "Đây là một trong những trải nghiệm nghề nghiệp tốt nhất trong cuộc đời tôi.", tip: "Express genuine gratitude and emotion" },
      { text: "I learned so much from all of you — thank you.", translation: "Tôi học được rất nhiều từ tất cả các bạn — cảm ơn.", tip: "Be specific about what you learned" },
      { text: "I hope to see all of you again very soon.", translation: "Tôi hy vọng sẽ gặp lại tất cả các bạn rất sớm.", tip: "End with optimism and warmth" },
    ],
    speakingPrompts: [
      { situation: "Giving a farewell speech", theyAsk: "Would you like to say a few words?", yourTarget: "Thank you all for making me feel so welcome. I leave with new friends, new knowledge, and a serious hawker food addiction.", translation: "Cảm ơn tất cả vì đã khiến tôi cảm thấy được chào đón. Tôi rời đi với bạn bè mới, kiến thức mới, và nghiện đồ ăn hawker nghiêm trọng." },
      { situation: "Talking about future plans", theyAsk: "When will you come back?", yourTarget: "I'm hoping for Q4 for the second phase. I'll push for it on my end!", translation: "Tôi hy vọng Q4 cho giai đoạn thứ hai. Tôi sẽ thúc đẩy về phía tôi!" },
    ],
    roleplay: {
      title: "Farewell Conversation", scenario: "Final goodbyes at the office",
      yourRole: "Developer saying a heartfelt goodbye", theirRole: "The whole team",
      lines: [
        { speaker: "them", speakerName: "Janet", text: "We'll miss having you here. What was your favourite part?", translation: "Chúng tôi sẽ nhớ bạn ở đây. Phần yêu thích nhất của bạn là gì?" },
        { speaker: "you", speakerName: "You", text: "Honestly? The lunch conversations. You all made me feel like family.", translation: "Thật ra? Những cuộc trò chuyện trong bữa trưa. Tất cả các bạn khiến tôi cảm thấy như gia đình.", hint: "Be genuine and personal" },
        { speaker: "them", speakerName: "Sarah", text: "That's so sweet! LinkedIn? We need to stay connected.", translation: "Đó thật là dễ thương! LinkedIn? Chúng ta cần duy trì kết nối." },
        { speaker: "you", speakerName: "You", text: "Absolutely! Already sent the requests. See you in Q4!", translation: "Chắc chắn rồi! Đã gửi yêu cầu rồi. Hẹn gặp ở Q4!", hint: "End with a concrete future plan" },
      ]
    },
    dailyTip: { title: "Building Lasting Professional Relationships", content: "Connect on LinkedIn before you leave. Send a personal thank-you email to each person who helped you. A relationship maintained is a career asset for life.", singlishNote: "'Stay lah!' is what locals say when you're leaving too soon — the highest compliment!" }
  }
];
