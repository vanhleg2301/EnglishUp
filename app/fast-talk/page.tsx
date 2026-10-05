'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Rocket, CheckCircle, ChevronRight, Headphones, BookOpen, Zap, Users, Library } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { fastTalkUnits, useFastTalkProgress, type FastTalkLevel, type FastTalkTrack } from '@/lib/fastTalk';

const METHOD = [
  { icon: Headphones, title: 'Nghe ở tốc độ thật', desc: 'Nghe trước khi đọc, làm quen với nối âm và nuốt âm.' },
  { icon: BookOpen, title: 'Học theo cụm', desc: 'Học cả cụm người bản xứ hay dùng, không học từ đơn lẻ.' },
  { icon: Zap, title: 'Luyện phản xạ', desc: 'Nói trong vài giây, không kịp dịch từng chữ.' },
  { icon: Users, title: 'Nhập vai', desc: 'Dùng ngay cụm vừa học trong tình huống thật.' },
  { icon: Library, title: 'Ôn cách quãng', desc: 'Cụm từ tự vào thẻ ôn để không quên.' },
];

export default function FastTalkPage() {
  const done = useFastTalkProgress();
  const [level, setLevel] = useState<FastTalkLevel | 'all'>('all');
  const [track, setTrack] = useState<FastTalkTrack | 'all'>('all');

  const units = useMemo(
    () => fastTalkUnits.filter((u) => (level === 'all' || u.level === level) && (track === 'all' || u.track === track)),
    [level, track],
  );
  const nextUp = fastTalkUnits.find((u) => !done.includes(u.id));
  const pct = Math.round((done.length / fastTalkUnits.length) * 100);

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${active ? 'bg-white/[0.10] text-white' : 'text-white/40 hover:text-white/70'}`;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-16">
        <div className="pt-8 pb-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-violet-300" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Fast Talk</h1>
              <p className="text-white/40 text-sm">Giao tiếp nhanh bằng cụm từ hằng ngày · A2+ → B1 · 20 bài</p>
            </div>
          </div>
        </div>

        {/* Method */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
          {METHOD.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className={`p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] ${i === METHOD.length - 1 ? 'col-span-2 md:col-span-1' : ''}`}>
              <Icon className="w-4 h-4 text-violet-300 mb-1.5" />
              <p className="text-xs font-bold text-white/80">{title}</p>
              <p className="text-[11px] text-white/35 mt-0.5 leading-snug">{desc}</p>
            </div>
          ))}
        </div>

        {/* Progress + continue */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/[0.12] to-cyan-500/[0.06] border border-violet-500/20 mb-6">
          <div className="flex justify-between text-xs text-white/50 mb-1.5">
            <span>{done.length}/{fastTalkUnits.length} bài đã xong</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          {nextUp ? (
            <Link
              href={`/fast-talk/${nextUp.id}`}
              className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm"
            >
              <span className="truncate">{done.length ? 'Học tiếp' : 'Bắt đầu'}: Bài {nextUp.id} · {nextUp.title}</span>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </Link>
          ) : (
            <p className="text-sm text-emerald-300 font-semibold">Bạn đã hoàn thành cả 20 bài. Hãy ôn lại cụm từ trong Vocabulary SRS.</p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="inline-flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-0.5">
            <button className={chip(level === 'all')} onClick={() => setLevel('all')}>Tất cả</button>
            <button className={chip(level === 'A2+')} onClick={() => setLevel('A2+')}>A2+</button>
            <button className={chip(level === 'B1')} onClick={() => setLevel('B1')}>B1</button>
          </div>
          <div className="inline-flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-0.5">
            <button className={chip(track === 'all')} onClick={() => setTrack('all')}>Mọi chủ đề</button>
            <button className={chip(track === 'life')} onClick={() => setTrack('life')}>Đời sống</button>
            <button className={chip(track === 'work')} onClick={() => setTrack('work')}>Công sở</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {units.map((u) => {
            const completed = done.includes(u.id);
            return (
              <Link
                key={u.id}
                href={`/fast-talk/${u.id}`}
                className={`p-4 rounded-2xl border transition-all hover:border-white/[0.16] hover:bg-white/[0.05] ${completed ? 'border-white/[0.10] bg-white/[0.04]' : 'border-white/[0.07] bg-white/[0.02]'}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none mt-0.5">{u.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold text-white/30">BÀI {u.id}</span>
                      <span className={`text-[10px] font-bold px-1.5 rounded ${u.level === 'B1' ? 'bg-cyan-500/15 text-cyan-300' : 'bg-violet-500/15 text-violet-300'}`}>{u.level}</span>
                      <span className="text-[10px] text-white/30">{u.track === 'life' ? 'Đời sống' : 'Công sở'}</span>
                    </div>
                    <p className="font-bold text-sm text-white leading-snug">{u.title}</p>
                    <p className="text-xs text-white/40 mt-0.5">{u.titleVi}</p>
                    <p className="text-[11px] text-white/25 mt-1.5 truncate">{u.chunks.slice(0, 3).map((c) => c.en).join(' · ')}</p>
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
