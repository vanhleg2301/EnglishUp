export interface WordEntry {
  phonetic: string;
  definition: string;
  examples: { sentence: string; translation: string }[];
}

export const wordDictionary: Record<string, WordEntry> = {
  reschedule: {
    phonetic: '/ˌriːˈskɛdʒuːl/',
    definition: 'Dời lịch, sắp xếp lại thời gian',
    examples: [
      { sentence: "Can we reschedule the meeting to next Tuesday?", translation: "Chúng ta có thể dời cuộc họp sang thứ Ba tuần sau không?" },
      { sentence: "The flight was rescheduled due to bad weather.", translation: "Chuyến bay bị hoãn do thời tiết xấu." },
      { sentence: "I'll need to reschedule my appointment with the doctor.", translation: "Tôi cần dời lịch hẹn với bác sĩ lại." },
    ],
  },
  urgent: {
    phonetic: '/ˈɜːrdʒənt/',
    definition: 'Khẩn cấp, cần xử lý ngay',
    examples: [
      { sentence: "There is an urgent matter that requires your attention.", translation: "Có một vấn đề khẩn cấp cần sự chú ý của bạn." },
      { sentence: "She sent an urgent email to the whole team.", translation: "Cô ấy gửi email khẩn cấp cho toàn bộ nhóm." },
      { sentence: "Is this really urgent, or can it wait until tomorrow?", translation: "Đây có thực sự khẩn cấp không, hay có thể đợi đến ngày mai?" },
    ],
  },
  clarify: {
    phonetic: '/ˈklærɪfaɪ/',
    definition: 'Làm rõ, giải thích cụ thể hơn',
    examples: [
      { sentence: "Could you clarify what you mean by 'as soon as possible'?", translation: "Bạn có thể làm rõ ý bạn khi nói 'càng sớm càng tốt' không?" },
      { sentence: "Let me clarify my position on this matter.", translation: "Để tôi làm rõ quan điểm của mình về vấn đề này." },
      { sentence: "The manager asked her to clarify the report's findings.", translation: "Quản lý yêu cầu cô ấy làm rõ kết quả của báo cáo." },
    ],
  },
  expectations: {
    phonetic: '/ˌɛkspɛkˈteɪʃənz/',
    definition: 'Kỳ vọng, những điều mong đợi',
    examples: [
      { sentence: "The results exceeded everyone's expectations.", translation: "Kết quả vượt quá kỳ vọng của mọi người." },
      { sentence: "We need to set clear expectations from the start.", translation: "Chúng ta cần đặt ra kỳ vọng rõ ràng ngay từ đầu." },
      { sentence: "His performance did not meet our expectations.", translation: "Hiệu suất của anh ấy không đáp ứng kỳ vọng của chúng tôi." },
    ],
  },
  postpone: {
    phonetic: '/poʊstˈpoʊn/',
    definition: 'Hoãn lại, trì hoãn',
    examples: [
      { sentence: "We had to postpone the launch until next quarter.", translation: "Chúng tôi phải hoãn buổi ra mắt đến quý tiếp theo." },
      { sentence: "The game was postponed due to heavy rain.", translation: "Trận đấu bị hoãn vì mưa to." },
      { sentence: "Don't postpone what you can do today.", translation: "Đừng trì hoãn những gì bạn có thể làm hôm nay." },
    ],
  },
  unforeseen: {
    phonetic: '/ˌʌnfɔːrˈsiːn/',
    definition: 'Không lường trước được, bất ngờ',
    examples: [
      { sentence: "Unforeseen circumstances delayed the project by two weeks.", translation: "Các tình huống không lường trước được đã làm trì hoãn dự án hai tuần." },
      { sentence: "We need a contingency plan for unforeseen events.", translation: "Chúng ta cần một kế hoạch dự phòng cho các sự kiện không lường trước." },
      { sentence: "The cost overrun was due to unforeseen complications.", translation: "Chi phí vượt mức là do các biến chứng không lường trước." },
    ],
  },
  compelling: {
    phonetic: '/kəmˈpɛlɪŋ/',
    definition: 'Thuyết phục, hấp dẫn, cuốn hút',
    examples: [
      { sentence: "She made a compelling argument for the new strategy.", translation: "Cô ấy đưa ra một lý lẽ thuyết phục cho chiến lược mới." },
      { sentence: "The film had a compelling storyline.", translation: "Bộ phim có cốt truyện cuốn hút." },
      { sentence: "We need compelling evidence before making a decision.", translation: "Chúng ta cần bằng chứng thuyết phục trước khi ra quyết định." },
    ],
  },
  concrete: {
    phonetic: '/ˈkɒŋkriːt/',
    definition: 'Cụ thể, rõ ràng (không mơ hồ)',
    examples: [
      { sentence: "Please give me a concrete example of what you mean.", translation: "Hãy cho tôi một ví dụ cụ thể về điều bạn muốn nói." },
      { sentence: "We need concrete data, not just estimates.", translation: "Chúng ta cần dữ liệu cụ thể, không chỉ là ước tính." },
      { sentence: "The plan lacks concrete steps for implementation.", translation: "Kế hoạch thiếu các bước cụ thể để thực hiện." },
    ],
  },
  outsource: {
    phonetic: '/ˈaʊtsɔːrs/',
    definition: 'Thuê ngoài, ủy thác cho bên thứ ba',
    examples: [
      { sentence: "Many companies outsource their customer service operations.", translation: "Nhiều công ty thuê ngoài hoạt động dịch vụ khách hàng." },
      { sentence: "We decided to outsource the IT support to cut costs.", translation: "Chúng tôi quyết định thuê ngoài hỗ trợ IT để giảm chi phí." },
      { sentence: "Outsourcing can be risky if quality is not managed carefully.", translation: "Thuê ngoài có thể rủi ro nếu chất lượng không được quản lý cẩn thận." },
    ],
  },
  compromise: {
    phonetic: '/ˈkɒmprəmaɪz/',
    definition: 'Ảnh hưởng tiêu cực; hoặc thỏa hiệp',
    examples: [
      { sentence: "We cannot compromise on quality to meet the deadline.", translation: "Chúng ta không thể ảnh hưởng đến chất lượng để đáp ứng thời hạn." },
      { sentence: "Both sides agreed to a compromise after long negotiations.", translation: "Cả hai bên đồng ý thỏa hiệp sau các cuộc đàm phán dài." },
      { sentence: "The security breach compromised thousands of accounts.", translation: "Vụ vi phạm bảo mật đã ảnh hưởng đến hàng nghìn tài khoản." },
    ],
  },
  projections: {
    phonetic: '/prəˈdʒɛkʃənz/',
    definition: 'Dự báo, ước tính tương lai',
    examples: [
      { sentence: "Our sales projections for next year look very optimistic.", translation: "Dự báo doanh số của chúng tôi cho năm tới trông rất lạc quan." },
      { sentence: "The projections were based on last year's performance data.", translation: "Các dự báo dựa trên dữ liệu hiệu suất năm ngoái." },
      { sentence: "We need to revise our financial projections downward.", translation: "Chúng ta cần điều chỉnh giảm các dự báo tài chính." },
    ],
  },
  exceed: {
    phonetic: '/ɪkˈsiːd/',
    definition: 'Vượt quá, vượt hơn mức mong đợi',
    examples: [
      { sentence: "Our revenue exceeded the target by 20 percent.", translation: "Doanh thu của chúng tôi vượt mục tiêu 20 phần trăm." },
      { sentence: "Please do not exceed the allocated budget.", translation: "Vui lòng không vượt quá ngân sách được phân bổ." },
      { sentence: "Her performance consistently exceeds expectations.", translation: "Hiệu suất của cô ấy liên tục vượt kỳ vọng." },
    ],
  },
  elaborate: {
    phonetic: '/ɪˈlæbəreɪt/',
    definition: 'Giải thích chi tiết, trình bày kỹ hơn',
    examples: [
      { sentence: "Could you elaborate on your proposal?", translation: "Bạn có thể giải thích chi tiết hơn về đề xuất của mình không?" },
      { sentence: "He elaborated on the risks involved in the project.", translation: "Anh ấy giải thích chi tiết về các rủi ro liên quan đến dự án." },
      { sentence: "The report elaborates on the findings of the research.", translation: "Báo cáo trình bày chi tiết về kết quả nghiên cứu." },
    ],
  },
  rationale: {
    phonetic: '/ˌræʃəˈnæl/',
    definition: 'Lý do, cơ sở lý luận đằng sau quyết định',
    examples: [
      { sentence: "What is the rationale behind this policy change?", translation: "Lý do đằng sau sự thay đổi chính sách này là gì?" },
      { sentence: "Please explain the rationale for your recommendation.", translation: "Vui lòng giải thích cơ sở lý luận cho đề xuất của bạn." },
      { sentence: "The rationale for the merger was to expand market share.", translation: "Lý do cho việc sáp nhập là để mở rộng thị phần." },
    ],
  },
  strategic: {
    phonetic: '/strəˈtiːdʒɪk/',
    definition: 'Mang tính chiến lược, quan trọng cho mục tiêu lâu dài',
    examples: [
      { sentence: "This partnership is a strategic move for our company.", translation: "Quan hệ đối tác này là một bước đi chiến lược cho công ty chúng tôi." },
      { sentence: "We need a strategic plan to enter the Asian market.", translation: "Chúng ta cần một kế hoạch chiến lược để thâm nhập thị trường châu Á." },
      { sentence: "The CEO made a strategic decision to pivot the business model.", translation: "CEO đưa ra quyết định chiến lược để chuyển đổi mô hình kinh doanh." },
    ],
  },
  outweigh: {
    phonetic: '/ˌaʊtˈweɪ/',
    definition: 'Vượt trội hơn về mức độ/tầm quan trọng',
    examples: [
      { sentence: "The benefits of this plan outweigh the risks.", translation: "Lợi ích của kế hoạch này vượt trội hơn rủi ro." },
      { sentence: "In this case, the advantages clearly outweigh the disadvantages.", translation: "Trong trường hợp này, ưu điểm rõ ràng vượt trội hơn nhược điểm." },
      { sentence: "Does the cost outweigh the potential gain?", translation: "Chi phí có vượt trội hơn lợi nhuận tiềm năng không?" },
    ],
  },
  drawbacks: {
    phonetic: '/ˈdrɔːbæks/',
    definition: 'Nhược điểm, hạn chế',
    examples: [
      { sentence: "Every approach has its drawbacks.", translation: "Mỗi cách tiếp cận đều có nhược điểm của nó." },
      { sentence: "The main drawback of this solution is the high cost.", translation: "Nhược điểm chính của giải pháp này là chi phí cao." },
      { sentence: "We need to consider the potential drawbacks carefully.", translation: "Chúng ta cần xem xét cẩn thận các nhược điểm tiềm ẩn." },
    ],
  },
  resilience: {
    phonetic: '/rɪˈzɪliəns/',
    definition: 'Sự kiên cường, khả năng phục hồi',
    examples: [
      { sentence: "The team showed great resilience during the crisis.", translation: "Nhóm đã thể hiện sự kiên cường tuyệt vời trong cuộc khủng hoảng." },
      { sentence: "Resilience is one of the most valuable traits in business.", translation: "Sự kiên cường là một trong những phẩm chất quý giá nhất trong kinh doanh." },
      { sentence: "She built resilience through years of overcoming challenges.", translation: "Cô ấy xây dựng sự kiên cường qua nhiều năm vượt qua thử thách." },
    ],
  },
  breakthrough: {
    phonetic: '/ˈbreɪkθruː/',
    definition: 'Bước đột phá, thành tựu vượt bậc',
    examples: [
      { sentence: "Scientists announced a major breakthrough in cancer research.", translation: "Các nhà khoa học công bố một bước đột phá lớn trong nghiên cứu ung thư." },
      { sentence: "We are close to a breakthrough in the negotiations.", translation: "Chúng ta đang gần đạt được bước đột phá trong đàm phán." },
      { sentence: "This technology represents a genuine breakthrough.", translation: "Công nghệ này đại diện cho một bước đột phá thực sự." },
    ],
  },
  entitled: {
    phonetic: '/ɪnˈtaɪtəld/',
    definition: 'Có quyền, được hưởng quyền lợi',
    examples: [
      { sentence: "As a customer, you are entitled to a full refund.", translation: "Là khách hàng, bạn có quyền được hoàn tiền đầy đủ." },
      { sentence: "Every employee is entitled to 15 days of annual leave.", translation: "Mỗi nhân viên có quyền được nghỉ 15 ngày phép hàng năm." },
      { sentence: "He felt entitled to special treatment because of his seniority.", translation: "Anh ta cảm thấy mình có quyền được đối xử đặc biệt vì thâm niên." },
    ],
  },
  seamlessly: {
    phonetic: '/ˈsiːmləsli/',
    definition: 'Liền mạch, trơn tru không có gián đoạn',
    examples: [
      { sentence: "The new software integrates seamlessly with our existing systems.", translation: "Phần mềm mới tích hợp liền mạch với các hệ thống hiện tại của chúng ta." },
      { sentence: "She transitioned seamlessly from one role to the next.", translation: "Cô ấy chuyển đổi liền mạch từ vai trò này sang vai trò khác." },
      { sentence: "The two teams worked seamlessly together on the project.", translation: "Hai nhóm làm việc liền mạch với nhau trong dự án." },
    ],
  },
  elusive: {
    phonetic: '/ɪˈluːsɪv/',
    definition: 'Khó nắm bắt, khó đạt được, khó tìm thấy',
    examples: [
      { sentence: "Work-life balance can be elusive for busy professionals.", translation: "Cân bằng công việc-cuộc sống có thể khó đạt được đối với người bận rộn." },
      { sentence: "Success remained elusive despite years of effort.", translation: "Thành công vẫn khó nắm bắt dù nhiều năm nỗ lực." },
      { sentence: "The solution to the problem proved elusive.", translation: "Giải pháp cho vấn đề hóa ra rất khó tìm." },
    ],
  },
  inevitably: {
    phonetic: '/ɪnˈɛvɪtəbli/',
    definition: 'Không thể tránh khỏi, tất yếu sẽ xảy ra',
    examples: [
      { sentence: "Change inevitably brings both opportunities and challenges.", translation: "Sự thay đổi tất yếu mang lại cả cơ hội lẫn thách thức." },
      { sentence: "Cutting corners will inevitably lead to quality issues.", translation: "Làm ẩu tất yếu sẽ dẫn đến vấn đề chất lượng." },
      { sentence: "New technology inevitably disrupts traditional industries.", translation: "Công nghệ mới tất yếu làm gián đoạn các ngành truyền thống." },
    ],
  },
  paramount: {
    phonetic: '/ˈpærəmaʊnt/',
    definition: 'Tối quan trọng, quan trọng hơn tất cả',
    examples: [
      { sentence: "Customer safety is paramount in everything we do.", translation: "An toàn của khách hàng là tối quan trọng trong mọi việc chúng tôi làm." },
      { sentence: "It is paramount that we maintain confidentiality.", translation: "Điều tối quan trọng là chúng ta phải duy trì tính bảo mật." },
      { sentence: "Transparency is paramount during a period of change.", translation: "Minh bạch là tối quan trọng trong giai đoạn thay đổi." },
    ],
  },
  paradigm: {
    phonetic: '/ˈpærədaɪm/',
    definition: 'Mô hình, khuôn mẫu tư duy (học thuật)',
    examples: [
      { sentence: "This technology represents a paradigm shift in communication.", translation: "Công nghệ này đại diện cho sự thay đổi mô hình trong giao tiếp." },
      { sentence: "The old paradigm of working nine-to-five is changing.", translation: "Mô hình làm việc 9-5 cũ đang thay đổi." },
      { sentence: "We need to challenge the existing paradigm.", translation: "Chúng ta cần thách thức mô hình hiện tại." },
    ],
  },
  leverage: {
    phonetic: '/ˈlɛvərɪdʒ/',
    definition: 'Tận dụng, khai thác tối đa lợi thế',
    examples: [
      { sentence: "We can leverage our existing network to expand quickly.", translation: "Chúng ta có thể tận dụng mạng lưới hiện có để mở rộng nhanh chóng." },
      { sentence: "The company leveraged its brand reputation to enter new markets.", translation: "Công ty tận dụng danh tiếng thương hiệu để thâm nhập thị trường mới." },
      { sentence: "How can we leverage technology to improve efficiency?", translation: "Làm thế nào chúng ta có thể tận dụng công nghệ để cải thiện hiệu quả?" },
    ],
  },
  personalised: {
    phonetic: '/ˈpɜːrsənəlaɪzd/',
    definition: 'Được cá nhân hóa, điều chỉnh theo từng người',
    examples: [
      { sentence: "We offer personalised recommendations based on your history.", translation: "Chúng tôi cung cấp đề xuất cá nhân hóa dựa trên lịch sử của bạn." },
      { sentence: "A personalised approach leads to better customer satisfaction.", translation: "Cách tiếp cận cá nhân hóa dẫn đến sự hài lòng của khách hàng tốt hơn." },
      { sentence: "The training program was personalised to each employee's needs.", translation: "Chương trình đào tạo được cá nhân hóa theo nhu cầu của từng nhân viên." },
    ],
  },
  infrastructure: {
    phonetic: '/ˈɪnfrəstrʌktʃər/',
    definition: 'Cơ sở hạ tầng, hệ thống cơ bản',
    examples: [
      { sentence: "The country invested heavily in transport infrastructure.", translation: "Đất nước đầu tư mạnh vào cơ sở hạ tầng giao thông." },
      { sentence: "Poor infrastructure is holding back economic growth.", translation: "Cơ sở hạ tầng kém đang kìm hãm tăng trưởng kinh tế." },
      { sentence: "We need to upgrade our digital infrastructure.", translation: "Chúng ta cần nâng cấp cơ sở hạ tầng kỹ thuật số." },
    ],
  },
  acquisition: {
    phonetic: '/ˌækwɪˈzɪʃən/',
    definition: 'Việc thu hút, tiếp nhận; hoặc mua lại (công ty)',
    examples: [
      { sentence: "Customer acquisition cost is a key metric for startups.", translation: "Chi phí thu hút khách hàng là chỉ số quan trọng cho các startup." },
      { sentence: "The acquisition of the rival company was announced yesterday.", translation: "Việc mua lại công ty đối thủ được thông báo hôm qua." },
      { sentence: "Language acquisition in children happens naturally.", translation: "Việc tiếp nhận ngôn ngữ ở trẻ em xảy ra một cách tự nhiên." },
    ],
  },
  commitment: {
    phonetic: '/kəˈmɪtmənt/',
    definition: 'Cam kết, sự tận tâm, lịch trình đã có',
    examples: [
      { sentence: "I have a prior commitment that evening.", translation: "Tôi đã có lịch trước vào buổi tối hôm đó." },
      { sentence: "The team's commitment to quality is impressive.", translation: "Sự cam kết về chất lượng của nhóm thật ấn tượng." },
      { sentence: "She made a commitment to finish the project on time.", translation: "Cô ấy cam kết hoàn thành dự án đúng hạn." },
    ],
  },
  reshape: {
    phonetic: '/riːˈʃeɪp/',
    definition: 'Định hình lại, thay đổi cấu trúc/hình dạng',
    examples: [
      { sentence: "Technology is reshaping the way we work.", translation: "Công nghệ đang định hình lại cách chúng ta làm việc." },
      { sentence: "The pandemic reshaped global supply chains.", translation: "Đại dịch đã định hình lại chuỗi cung ứng toàn cầu." },
      { sentence: "This policy will reshape the education system.", translation: "Chính sách này sẽ định hình lại hệ thống giáo dục." },
    ],
  },
  transparency: {
    phonetic: '/trænsˈpærənsi/',
    definition: 'Sự minh bạch, tính rõ ràng không che giấu',
    examples: [
      { sentence: "We value transparency in all our business dealings.", translation: "Chúng tôi coi trọng tính minh bạch trong mọi giao dịch kinh doanh." },
      { sentence: "Transparency builds trust with customers.", translation: "Sự minh bạch xây dựng niềm tin với khách hàng." },
      { sentence: "There is a lack of transparency in the decision-making process.", translation: "Có sự thiếu minh bạch trong quá trình ra quyết định." },
    ],
  },
};

export function lookupWord(word: string): WordEntry | null {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (wordDictionary[clean]) return wordDictionary[clean];

  // try stemmed forms
  const stems = [
    clean.replace(/ing$/, ''),
    clean.replace(/ed$/, ''),
    clean.replace(/ly$/, ''),
    clean.replace(/s$/, ''),
    clean.replace(/tion$/, 't'),
  ];
  for (const stem of stems) {
    if (wordDictionary[stem]) return wordDictionary[stem];
  }
  return null;
}
