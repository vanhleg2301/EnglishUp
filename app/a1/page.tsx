'use client';

import Link from 'next/link';
import { Sprout, CheckCircle, ChevronRight, Image as ImageIcon, BookOpenText, MessagesSquare, Mic, Library } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { a1Days, useA1Progress } from '@/lib/a1';

const METHOD = [
  { icon: ImageIcon, title: 'Hiểu trước, nhớ sau', desc: 'Gặp từ qua hình ảnh và câu đơn giản, tự đoán nghĩa.' },
  { icon: BookOpenText, title: 'Nghe thật nhiều', desc: 'Truyện ngắn lặp lại từ mới nhiều lần, vừa đủ để hiểu.' },
  { icon: MessagesSquare, title: 'Hội thoại thật', desc: 'Nghe rồi nói theo các tình huống hằng ngày.' },
  { icon: Mic, title: 'Nói về bạn', desc: 'Dùng ngay từ mới để nói về cuộc sống của mình.' },
  { icon: Library, title: 'Ôn mỗi sáng', desc: 'Từ đã học vào thẻ ôn trong Vocabulary SRS.' },
];

export default function A1Page() {
  const done = useA1Progress();
  const nextUp = a1Days.find((d) => !done.includes(d.day));
  const pct = Math.round((done.length / a1Days.length) * 100);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-16">
        <div className="pt-8 pb-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">A1 trong 20 ngày</h1>
              <p className="text-white/40 text-sm">Nghe hiểu và giao tiếp cơ bản · mỗi ngày 30–45 phút</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
          {METHOD.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className={`p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] ${i === METHOD.length - 1 ? 'col-span-2 md:col-span-1' : ''}`}>
              <Icon className="w-4 h-4 text-emerald-300 mb-1.5" />
              <p className="text-xs font-bold text-white/80">{title}</p>
              <p className="text-[11px] text-white/35 mt-0.5 leading-snug">{desc}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/[0.12] to-cyan-500/[0.06] border border-emerald-500/20 mb-6">
          <div className="flex justify-between text-xs text-white/50 mb-1.5">
            <span>{done.length}/{a1Days.length} ngày đã xong</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          {nextUp ? (
            <Link
              href={`/a1/${nextUp.day}`}
              className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm"
            >
              <span className="truncate">{done.length ? 'Học tiếp' : 'Bắt đầu'}: Ngày {nextUp.day} · {nextUp.titleVi}</span>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </Link>
          ) : (
            <p className="text-sm text-emerald-300 font-semibold">Bạn đã xong 20 ngày! Tiếp theo hãy học Fast Talk (A2+).</p>
          )}
          <p className="text-[11px] text-white/35 mt-2">Không cần tài khoản. Tiến độ được lưu trên trình duyệt/điện thoại này.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {a1Days.map((d) => {
            const completed = done.includes(d.day);
            return (
              <Link
                key={d.day}
                href={`/a1/${d.day}`}
                className={`p-4 rounded-2xl border transition-all hover:border-white/[0.16] hover:bg-white/[0.05] ${completed ? 'border-white/[0.10] bg-white/[0.04]' : 'border-white/[0.07] bg-white/[0.02]'}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none mt-0.5">{d.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-white/30 mb-0.5">NGÀY {d.day}</p>
                    <p className="font-bold text-sm text-white leading-snug">{d.titleVi}</p>
                    <p className="text-xs text-white/40 mt-0.5">{d.title}</p>
                    <p className="text-[11px] text-white/25 mt-1.5 truncate">{d.words.map((w) => w.word).join(' · ')}</p>
                  </div>
                  {completed ? <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0 mt-1" />}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
