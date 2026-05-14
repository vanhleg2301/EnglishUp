export type PhraseCategory = 'office' | 'tech' | 'meeting' | 'email' | 'smalltalk';
export type PhraseType = 'collocation' | 'phrasal' | 'idiom' | 'expression';

export interface Phrase {
  id: string;
  phrase: string;
  translation: string;
  type: PhraseType;
  category: PhraseCategory;
  examples: { en: string; vi: string }[];
  notes?: string;
}

export const categoryMeta: Record<PhraseCategory, { label: string; emoji: string; color: string }> = {
  office:    { label: 'Office',    emoji: '🏢', color: '#6366F1' },
  tech:      { label: 'Tech/Dev',  emoji: '💻', color: '#0EA5E9' },
  meeting:   { label: 'Meetings',  emoji: '🗣️', color: '#8B5CF6' },
  email:     { label: 'Email',     emoji: '✉️', color: '#10B981' },
  smalltalk: { label: 'Small Talk',emoji: '☕', color: '#F59E0B' },
};

export const typeLabels: Record<PhraseType, string> = {
  collocation: 'Collocation',
  phrasal:     'Phrasal Verb',
  idiom:       'Idiom',
  expression:  'Expression',
};

export const phrases: Phrase[] = [
  // ── OFFICE ──────────────────────────────────────────────────────────────
  {
    id: 'o1', phrase: 'make a decision', translation: 'Ra quyết định',
    type: 'collocation', category: 'office',
    examples: [
      { en: 'We need to make a decision by end of day.', vi: 'Chúng ta cần ra quyết định trước cuối ngày.' },
      { en: "It's not easy to make a decision with limited data.", vi: 'Rất khó ra quyết định khi dữ liệu còn hạn chế.' },
    ],
    notes: 'Không nói "do a decision" — luôn dùng "make".',
  },
  {
    id: 'o2', phrase: 'meet a deadline', translation: 'Hoàn thành đúng hạn',
    type: 'collocation', category: 'office',
    examples: [
      { en: 'The team worked overnight to meet the deadline.', vi: 'Cả team thức đêm để kịp deadline.' },
      { en: 'Can we meet the Q3 deadline?', vi: 'Chúng ta có thể kịp deadline quý 3 không?' },
    ],
  },
  {
    id: 'o3', phrase: 'miss a deadline', translation: 'Trễ deadline / không kịp hạn',
    type: 'collocation', category: 'office',
    examples: [
      { en: 'Missing a deadline sets a bad precedent.', vi: 'Trễ deadline tạo ra tiền lệ xấu.' },
      { en: 'We missed the deadline due to a last-minute bug.', vi: 'Chúng ta trễ deadline vì bug phút chót.' },
    ],
  },
  {
    id: 'o4', phrase: 'take responsibility', translation: 'Nhận trách nhiệm / chịu trách nhiệm',
    type: 'collocation', category: 'office',
    examples: [
      { en: "I'll take responsibility for the deployment failure.", vi: 'Tôi sẽ chịu trách nhiệm về lỗi triển khai này.' },
      { en: 'A good leader takes responsibility for their team.', vi: 'Một leader giỏi chịu trách nhiệm cho cả team.' },
    ],
  },
  {
    id: 'o5', phrase: 'raise a concern', translation: 'Nêu lên lo ngại / đặt vấn đề',
    type: 'collocation', category: 'office',
    examples: [
      { en: 'I want to raise a concern about the timeline.', vi: 'Tôi muốn đặt vấn đề về timeline này.' },
      { en: 'Please raise any concerns before we proceed.', vi: 'Hãy nêu lên bất kỳ lo ngại nào trước khi chúng ta tiến hành.' },
    ],
  },
  {
    id: 'o6', phrase: 'give feedback', translation: 'Đưa ra phản hồi / góp ý',
    type: 'collocation', category: 'office',
    examples: [
      { en: 'Could you give me feedback on my presentation?', vi: 'Bạn có thể góp ý cho bài thuyết trình của tôi không?' },
      { en: "It's important to give constructive feedback.", vi: 'Điều quan trọng là phải đưa ra phản hồi mang tính xây dựng.' },
    ],
  },
  {
    id: 'o7', phrase: 'follow up on', translation: 'Theo dõi / tiếp tục xử lý',
    type: 'phrasal', category: 'office',
    examples: [
      { en: "I'll follow up on this issue tomorrow.", vi: 'Tôi sẽ theo dõi vấn đề này vào ngày mai.' },
      { en: "Has anyone followed up on the client's request?", vi: 'Có ai theo dõi yêu cầu của khách hàng chưa?' },
    ],
  },
  {
    id: 'o8', phrase: 'reach out to', translation: 'Liên hệ với / tiếp cận',
    type: 'phrasal', category: 'office',
    examples: [
      { en: 'Feel free to reach out to me anytime.', vi: 'Hãy liên hệ với tôi bất cứ lúc nào.' },
      { en: "I'll reach out to the vendor for a quote.", vi: 'Tôi sẽ liên hệ nhà cung cấp để xin báo giá.' },
    ],
  },
  {
    id: 'o9', phrase: 'get back to someone', translation: 'Phản hồi lại ai đó',
    type: 'phrasal', category: 'office',
    examples: [
      { en: 'Let me check and get back to you by noon.', vi: 'Để tôi kiểm tra và phản hồi lại bạn trước trưa.' },
      { en: "I'll get back to the client with an update.", vi: 'Tôi sẽ liên hệ lại khách hàng để cập nhật.' },
    ],
  },
  {
    id: 'o10', phrase: 'keep someone posted', translation: 'Cập nhật tình hình cho ai đó',
    type: 'expression', category: 'office',
    examples: [
      { en: 'Keep me posted on how the release goes.', vi: 'Cập nhật cho tôi biết quá trình release thế nào nhé.' },
      { en: "I'll keep you posted as things develop.", vi: 'Tôi sẽ cập nhật cho bạn khi có tiến triển.' },
    ],
  },
  {
    id: 'o11', phrase: 'stay on track', translation: 'Đi đúng tiến độ / không bị lạc hướng',
    type: 'expression', category: 'office',
    examples: [
      { en: 'We need to stay on track to hit the launch date.', vi: 'Chúng ta cần đúng tiến độ để kịp ngày ra mắt.' },
      { en: 'Daily standups help the team stay on track.', vi: 'Daily standup giúp team đúng tiến độ.' },
    ],
  },
  {
    id: 'o12', phrase: 'wrap up', translation: 'Kết thúc / hoàn tất',
    type: 'phrasal', category: 'office',
    examples: [
      { en: "Let's wrap up this discussion and move on.", vi: 'Hãy kết thúc cuộc thảo luận này và tiếp tục.' },
      { en: "I'm wrapping up my tasks before the holiday.", vi: 'Tôi đang hoàn tất công việc trước kỳ nghỉ.' },
    ],
  },

  // ── TECH / DEV ───────────────────────────────────────────────────────────
  {
    id: 't1', phrase: 'push to production', translation: 'Triển khai lên môi trường production',
    type: 'expression', category: 'tech',
    examples: [
      { en: "We'll push to production after the code review.", vi: 'Chúng ta sẽ deploy sau khi review code xong.' },
      { en: 'Never push to production on a Friday.', vi: 'Đừng bao giờ deploy vào thứ Sáu.' },
    ],
    notes: 'Cũng hay nói "deploy to prod".',
  },
  {
    id: 't2', phrase: 'roll back a change', translation: 'Hoàn tác / khôi phục thay đổi',
    type: 'collocation', category: 'tech',
    examples: [
      { en: 'We had to roll back the change after it caused errors.', vi: 'Chúng ta phải hoàn tác thay đổi sau khi nó gây ra lỗi.' },
      { en: "It's important to be able to roll back quickly.", vi: 'Khả năng rollback nhanh là rất quan trọng.' },
    ],
  },
  {
    id: 't3', phrase: 'break the build', translation: 'Làm hỏng build / gây lỗi CI',
    type: 'collocation', category: 'tech',
    examples: [
      { en: 'Your commit broke the build — please check it.', vi: 'Commit của bạn làm hỏng build — hãy kiểm tra lại.' },
      { en: "Don't merge until you're sure it won't break the build.", vi: 'Đừng merge cho đến khi chắc không làm hỏng build.' },
    ],
  },
  {
    id: 't4', phrase: 'open a ticket', translation: 'Tạo ticket / mở issue',
    type: 'collocation', category: 'tech',
    examples: [
      { en: 'Please open a ticket for this bug in Jira.', vi: 'Hãy tạo ticket cho bug này trên Jira.' },
      { en: 'We should open a ticket before starting work on it.', vi: 'Chúng ta nên tạo ticket trước khi bắt đầu làm.' },
    ],
  },
  {
    id: 't5', phrase: 'review a PR', translation: 'Review pull request',
    type: 'collocation', category: 'tech',
    examples: [
      { en: "Can someone review my PR? It's been open for two days.", vi: 'Ai có thể review PR của tôi không? Nó đã mở 2 ngày rồi.' },
      { en: "I'll review your PR after standup.", vi: 'Tôi sẽ review PR của bạn sau standup.' },
    ],
  },
  {
    id: 't6', phrase: 'ship a feature', translation: 'Ra mắt / hoàn thiện một tính năng',
    type: 'collocation', category: 'tech',
    examples: [
      { en: "We're planning to ship this feature next sprint.", vi: 'Chúng ta dự định ra mắt tính năng này vào sprint tới.' },
      { en: 'The goal is to ship fast and iterate.', vi: 'Mục tiêu là ra mắt nhanh rồi cải tiến dần.' },
    ],
  },
  {
    id: 't7', phrase: 'debug the issue', translation: 'Tìm và sửa lỗi',
    type: 'collocation', category: 'tech',
    examples: [
      { en: 'I spent two hours debugging the issue in staging.', vi: 'Tôi mất hai tiếng để debug lỗi trên staging.' },
      { en: 'Let me debug the issue before we escalate.', vi: 'Để tôi debug trước khi chúng ta leo thang vấn đề.' },
    ],
  },
  {
    id: 't8', phrase: 'spin up an instance', translation: 'Khởi chạy một server / instance',
    type: 'expression', category: 'tech',
    examples: [
      { en: 'Can you spin up a new instance for testing?', vi: 'Bạn có thể khởi chạy một instance mới để test không?' },
      { en: "We'll spin up a staging environment first.", vi: 'Chúng ta sẽ dựng staging trước.' },
    ],
  },
  {
    id: 't9', phrase: 'refactor the code', translation: 'Tái cấu trúc code',
    type: 'collocation', category: 'tech',
    examples: [
      { en: 'This module needs to be refactored before adding features.', vi: 'Module này cần được refactor trước khi thêm tính năng.' },
      { en: 'We scheduled two days to refactor the auth code.', vi: 'Chúng tôi dành hai ngày để refactor code xác thực.' },
    ],
  },
  {
    id: 't10', phrase: 'write unit tests', translation: 'Viết unit test',
    type: 'collocation', category: 'tech',
    examples: [
      { en: 'Please write unit tests for every new function.', vi: 'Hãy viết unit test cho mỗi function mới.' },
      { en: 'Writing unit tests early saves debugging time later.', vi: 'Viết unit test sớm giúp tiết kiệm thời gian debug về sau.' },
    ],
  },
  {
    id: 't11', phrase: 'run the pipeline', translation: 'Chạy pipeline CI/CD',
    type: 'collocation', category: 'tech',
    examples: [
      { en: 'Run the pipeline and check if all tests pass.', vi: 'Chạy pipeline và kiểm tra xem tất cả test có pass không.' },
      { en: 'The pipeline failed at the integration test stage.', vi: 'Pipeline bị thất bại ở bước integration test.' },
    ],
  },
  {
    id: 't12', phrase: 'set up the environment', translation: 'Cài đặt môi trường',
    type: 'collocation', category: 'tech',
    examples: [
      { en: 'New hires need half a day to set up the environment.', vi: 'Nhân viên mới cần nửa ngày để setup môi trường.' },
      { en: 'Check the README to set up the local environment.', vi: 'Đọc README để setup môi trường local.' },
    ],
  },
  {
    id: 't13', phrase: 'have a code freeze', translation: 'Đóng băng code (không thêm thay đổi mới)',
    type: 'expression', category: 'tech',
    examples: [
      { en: 'We have a code freeze starting Friday before release.', vi: 'Chúng ta có code freeze từ thứ Sáu trước khi release.' },
      { en: 'No new features during the code freeze period.', vi: 'Không thêm tính năng mới trong thời gian code freeze.' },
    ],
  },

  // ── MEETINGS ─────────────────────────────────────────────────────────────
  {
    id: 'm1', phrase: 'circle back', translation: 'Quay lại vấn đề này sau',
    type: 'idiom', category: 'meeting',
    examples: [
      { en: "Let's circle back on the pricing discussion next week.", vi: 'Hãy quay lại thảo luận về giá vào tuần sau.' },
      { en: "We don't have time now — can we circle back?", vi: 'Giờ không có thời gian — chúng ta có thể quay lại sau không?' },
    ],
    notes: 'Rất phổ biến trong tech meetings.',
  },
  {
    id: 'm2', phrase: 'touch base', translation: 'Kiểm tra nhanh / cập nhật tiến độ',
    type: 'idiom', category: 'meeting',
    examples: [
      { en: "Let's touch base tomorrow morning.", vi: 'Hãy gặp nhau nhanh vào sáng mai.' },
      { en: 'I wanted to touch base with you on the project status.', vi: 'Tôi muốn kiểm tra nhanh về tiến độ dự án với bạn.' },
    ],
  },
  {
    id: 'm3', phrase: 'take it offline', translation: 'Thảo luận riêng ngoài cuộc họp này',
    type: 'expression', category: 'meeting',
    examples: [
      { en: "This is getting detailed — let's take it offline.", vi: 'Vấn đề này khá chi tiết — hãy trao đổi riêng sau nhé.' },
      { en: 'Can we take this discussion offline after the meeting?', vi: 'Chúng ta có thể thảo luận riêng sau cuộc họp không?' },
    ],
    notes: 'Dùng khi một chủ đề quá chi tiết, không phù hợp với cả nhóm.',
  },
  {
    id: 'm4', phrase: 'loop someone in', translation: 'Thêm ai đó vào cuộc / thông báo cho ai đó',
    type: 'phrasal', category: 'meeting',
    examples: [
      { en: 'Loop in the design team before we finalize this.', vi: 'Thêm team design vào trước khi chúng ta hoàn tất.' },
      { en: 'Can you loop me in on that email thread?', vi: 'Bạn có thể thêm tôi vào chuỗi email đó không?' },
    ],
  },
  {
    id: 'm5', phrase: 'bring everyone up to speed', translation: 'Cập nhật thông tin cho mọi người',
    type: 'expression', category: 'meeting',
    examples: [
      { en: 'Let me bring everyone up to speed on what happened.', vi: 'Để tôi cập nhật cho mọi người về những gì đã xảy ra.' },
      { en: 'We need five minutes to bring the new members up to speed.', vi: 'Chúng ta cần 5 phút để cập nhật cho thành viên mới.' },
    ],
  },
  {
    id: 'm6', phrase: 'move the needle', translation: 'Tạo ra sự khác biệt đáng kể / thúc đẩy tiến triển',
    type: 'idiom', category: 'meeting',
    examples: [
      { en: "Small fixes won't move the needle — we need a bigger change.", vi: 'Các sửa nhỏ sẽ không tạo ra khác biệt — cần thay đổi lớn hơn.' },
      { en: 'What can we do this quarter to really move the needle?', vi: 'Chúng ta có thể làm gì quý này để thực sự tạo ra sự khác biệt?' },
    ],
  },
  {
    id: 'm7', phrase: 'get the ball rolling', translation: 'Bắt đầu làm / khởi động',
    type: 'idiom', category: 'meeting',
    examples: [
      { en: "Let's get the ball rolling on the new project.", vi: 'Hãy bắt đầu khởi động dự án mới thôi.' },
      { en: "Who's going to get the ball rolling on this?", vi: 'Ai sẽ là người khởi động cái này?' },
    ],
  },
  {
    id: 'm8', phrase: 'on the same page', translation: 'Hiểu nhau / đồng thuận với nhau',
    type: 'idiom', category: 'meeting',
    examples: [
      { en: "I want to make sure we're all on the same page.", vi: 'Tôi muốn đảm bảo chúng ta đều hiểu nhau.' },
      { en: 'Are we on the same page about the requirements?', vi: 'Chúng ta có cùng hiểu về yêu cầu không?' },
    ],
  },
  {
    id: 'm9', phrase: 'table the discussion', translation: 'Tạm hoãn thảo luận / để lại cho lần sau',
    type: 'expression', category: 'meeting',
    examples: [
      { en: "We're running low on time — let's table this for next week.", vi: 'Gần hết giờ rồi — hãy để lại chủ đề này cho tuần sau.' },
    ],
    notes: 'Cẩn thận: ở Anh "table" có nghĩa là ĐƯA VÀO bàn thảo luận (ngược nghĩa với Mỹ).',
  },
  {
    id: 'm10', phrase: 'sync up', translation: 'Đồng bộ / cập nhật thông tin cho nhau',
    type: 'phrasal', category: 'meeting',
    examples: [
      { en: 'Can we sync up briefly before the client call?', vi: 'Chúng ta có thể nói chuyện nhanh trước khi gọi khách hàng không?' },
      { en: "Let's sync up tomorrow to align on priorities.", vi: 'Hãy sync nhau vào ngày mai để thống nhất ưu tiên.' },
    ],
  },
  {
    id: 'm11', phrase: 'run point on', translation: 'Chịu trách nhiệm chính / dẫn dắt',
    type: 'expression', category: 'meeting',
    examples: [
      { en: "Who's running point on the migration project?", vi: 'Ai đang chịu trách nhiệm chính cho dự án migration?' },
      { en: "I'll run point on the API integration.", vi: 'Tôi sẽ dẫn dắt phần tích hợp API.' },
    ],
  },

  // ── EMAIL ────────────────────────────────────────────────────────────────
  {
    id: 'e1', phrase: 'as per our discussion', translation: 'Như đã thảo luận / theo như chúng ta đã nói',
    type: 'expression', category: 'email',
    examples: [
      { en: "As per our discussion, I'm sending over the updated spec.", vi: 'Như đã thảo luận, tôi gửi bản spec đã cập nhật.' },
    ],
    notes: 'Formal, thường dùng ở đầu email để nhắc lại cam kết từ cuộc họp.',
  },
  {
    id: 'e2', phrase: 'please find attached', translation: 'Vui lòng xem file đính kèm',
    type: 'expression', category: 'email',
    examples: [
      { en: 'Please find attached the project proposal for your review.', vi: 'Vui lòng xem đề xuất dự án đính kèm.' },
    ],
    notes: "Cách nói formal trong email. Phiên bản casual hơn: \"I've attached...\".",
  },
  {
    id: 'e3', phrase: 'I wanted to follow up on', translation: 'Tôi muốn theo dõi về / nhắc lại về',
    type: 'expression', category: 'email',
    examples: [
      { en: 'I wanted to follow up on my email from last week.', vi: 'Tôi muốn nhắc lại email của tôi từ tuần trước.' },
      { en: 'I wanted to follow up on the open issues from the meeting.', vi: 'Tôi muốn theo dõi các vấn đề chưa giải quyết từ cuộc họp.' },
    ],
  },
  {
    id: 'e4', phrase: "I'm reaching out regarding", translation: 'Tôi liên hệ về vấn đề...',
    type: 'expression', category: 'email',
    examples: [
      { en: "I'm reaching out regarding the upcoming product launch.", vi: 'Tôi liên hệ về buổi ra mắt sản phẩm sắp tới.' },
      { en: "I'm reaching out regarding a potential collaboration.", vi: 'Tôi liên hệ về khả năng hợp tác.' },
    ],
    notes: 'Thường dùng khi gửi email lần đầu cho người chưa quen.',
  },
  {
    id: 'e5', phrase: 'looking forward to hearing from you', translation: 'Mong nhận được phản hồi từ bạn',
    type: 'expression', category: 'email',
    examples: [
      { en: 'Looking forward to hearing from you on this matter.', vi: 'Mong nhận được phản hồi về vấn đề này.' },
    ],
    notes: 'Kết thúc email lịch sự — đừng viết "I am look forward".',
  },
  {
    id: 'e6', phrase: 'let me know if you have any questions', translation: 'Liên hệ nếu bạn có câu hỏi nào',
    type: 'expression', category: 'email',
    examples: [
      { en: 'Let me know if you have any questions or concerns.', vi: 'Liên hệ nếu bạn có câu hỏi hoặc lo ngại nào.' },
    ],
  },
  {
    id: 'e7', phrase: "I'll keep you posted", translation: 'Tôi sẽ cập nhật thông tin cho bạn',
    type: 'expression', category: 'email',
    examples: [
      { en: "I'll keep you posted as we make progress.", vi: 'Tôi sẽ cập nhật khi có tiến triển.' },
      { en: "Once I hear back from the team, I'll keep you posted.", vi: 'Khi nhận được phản hồi từ team, tôi sẽ thông báo cho bạn.' },
    ],
  },
  {
    id: 'e8', phrase: 'per my last email', translation: 'Như tôi đã đề cập trong email trước',
    type: 'expression', category: 'email',
    examples: [
      { en: 'Per my last email, the deadline is next Monday.', vi: 'Như tôi đã đề cập, deadline là thứ Hai tuần sau.' },
    ],
    notes: 'Dùng khi phải nhắc lại điều đã nói — ngầm thể hiện sự nhẹ nhàng nhắc nhở.',
  },
  {
    id: 'e9', phrase: 'could you please advise', translation: 'Bạn có thể cho ý kiến / hướng dẫn không',
    type: 'expression', category: 'email',
    examples: [
      { en: 'Could you please advise on the best approach here?', vi: 'Bạn có thể hướng dẫn về cách tiếp cận tốt nhất không?' },
      { en: 'Could you please advise if this meets the requirements?', vi: 'Bạn có thể cho ý kiến xem điều này có đáp ứng yêu cầu không?' },
    ],
  },
  {
    id: 'e10', phrase: 'kindly note that', translation: 'Lưu ý rằng / xin lưu ý',
    type: 'expression', category: 'email',
    examples: [
      { en: 'Kindly note that the server will be down on Sunday.', vi: 'Xin lưu ý rằng server sẽ bảo trì vào Chủ nhật.' },
    ],
    notes: 'Formal, đặc biệt phổ biến ở môi trường doanh nghiệp châu Á.',
  },

  // ── SMALL TALK ───────────────────────────────────────────────────────────
  {
    id: 's1', phrase: 'swamped with work', translation: 'Ngập đầu trong công việc / bận rộn cực kỳ',
    type: 'idiom', category: 'smalltalk',
    examples: [
      { en: "Sorry for the late reply — I've been swamped with work.", vi: 'Xin lỗi vì trả lời muộn — dạo này tôi ngập đầu công việc.' },
      { en: 'End of quarter is always crazy — everyone is swamped.', vi: 'Cuối quý lúc nào cũng hỗn loạn — ai cũng bận tới tận cổ.' },
    ],
  },
  {
    id: 's2', phrase: 'hanging in there', translation: 'Cố gắng vượt qua / ráng chịu đựng',
    type: 'expression', category: 'smalltalk',
    examples: [
      { en: 'How are you holding up? — Hanging in there, thanks.', vi: 'Bạn ổn không? — Đang cố vượt qua, cảm ơn.' },
    ],
    notes: 'Câu trả lời trung dung khi mọi thứ không quá tốt nhưng cũng không tệ.',
  },
  {
    id: 's3', phrase: 'under the weather', translation: 'Không được khỏe / hơi mệt',
    type: 'idiom', category: 'smalltalk',
    examples: [
      { en: "I'm a bit under the weather today — might sign off early.", vi: 'Hôm nay tôi hơi không khỏe — có thể tôi sẽ off sớm.' },
    ],
  },
  {
    id: 's4', phrase: 'pull an all-nighter', translation: 'Thức suốt đêm (để làm việc)',
    type: 'idiom', category: 'smalltalk',
    examples: [
      { en: 'We pulled an all-nighter to fix the production issue.', vi: 'Chúng tôi thức trắng đêm để sửa lỗi production.' },
    ],
  },
  {
    id: 's5', phrase: 'bite off more than you can chew', translation: 'Nhận quá nhiều việc vượt sức mình',
    type: 'idiom', category: 'smalltalk',
    examples: [
      { en: 'I think we bit off more than we could chew with this sprint.', vi: 'Tôi nghĩ chúng ta đã nhận quá nhiều việc trong sprint này.' },
    ],
  },
  {
    id: 's6', phrase: 'get the hang of it', translation: 'Nắm bắt được / quen tay',
    type: 'idiom', category: 'smalltalk',
    examples: [
      { en: "Kubernetes is confusing at first, but you'll get the hang of it.", vi: 'Kubernetes lúc đầu khó hiểu, nhưng bạn sẽ quen thôi.' },
    ],
  },
  {
    id: 's7', phrase: 'hit the ground running', translation: 'Bắt đầu ngay với tốc độ cao / vào việc luôn',
    type: 'idiom', category: 'smalltalk',
    examples: [
      { en: 'We need someone who can hit the ground running on day one.', vi: 'Chúng tôi cần người có thể vào việc ngay từ ngày đầu.' },
    ],
    notes: 'Hay dùng trong phỏng vấn và onboarding.',
  },
  {
    id: 's8', phrase: 'at the end of the day', translation: 'Xét cho cùng / cuối cùng thì',
    type: 'expression', category: 'smalltalk',
    examples: [
      { en: 'At the end of the day, users just want the product to work.', vi: 'Xét cho cùng, người dùng chỉ muốn sản phẩm hoạt động tốt.' },
    ],
  },
  {
    id: 's9', phrase: 'give it a shot', translation: 'Thử xem / cứ thử đi',
    type: 'expression', category: 'smalltalk',
    examples: [
      { en: "I've never used Rust before, but I'll give it a shot.", vi: 'Tôi chưa dùng Rust bao giờ, nhưng tôi sẽ thử xem.' },
    ],
  },
  {
    id: 's10', phrase: 'that makes sense', translation: 'Có lý đó / tôi hiểu rồi',
    type: 'expression', category: 'smalltalk',
    examples: [
      { en: 'We cache the response to reduce latency. — That makes sense.', vi: 'Chúng ta cache response để giảm latency. — Có lý đó.' },
    ],
    notes: 'Cụm này rất tự nhiên khi phản hồi giải thích của ai đó.',
  },
  {
    id: 's11', phrase: 'fair enough', translation: 'Được thôi / có lý đấy',
    type: 'expression', category: 'smalltalk',
    examples: [
      { en: "We should skip the meeting if there's nothing to discuss. — Fair enough.", vi: 'Có thể bỏ qua cuộc họp nếu không có gì để nói. — Được thôi.' },
    ],
  },
];

export const CATEGORIES: PhraseCategory[] = ['office', 'tech', 'meeting', 'email', 'smalltalk'];
