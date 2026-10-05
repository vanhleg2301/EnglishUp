'use client';

import { useCallback, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Headphones, BookOpen, Zap, Users, Award, ChevronRight } from 'lucide-react';
import AppShell from '@/components/AppShell';
import ListenPhase from '@/components/fastTalk/ListenPhase';
import ChunksPhase from '@/components/fastTalk/ChunksPhase';
import ReflexPhase from '@/components/fastTalk/ReflexPhase';
import RoleplayPhase from '@/components/fastTalk/RoleplayPhase';
import {
  getFastTalkUnit, fastTalkUnits, markFastTalkUnitDone,
  FAST_TALK_XP, FAST_TALK_SRS_SOURCE_OFFSET, type FastTalkUnit,
} from '@/lib/fastTalk';
import { useVocabSRS } from '@/hooks/useVocabSRS';
import { useProgress } from '@/hooks/useProgress';

type Phase = 'intro' | 'listen' | 'chunks' | 'reflex' | 'roleplay' | 'complete';

const STEPS: { id: Phase; label: string; desc: string; icon: React.ElementType }[] = [
  { id: 'listen', label: 'Nghe hiểu', desc: 'Nghe hội thoại ở tốc độ thật, trả lời câu hỏi trước khi xem chữ', icon: Headphones },
  { id: 'chunks', label: 'Cụm từ', desc: '8 cụm dùng hằng ngày, nghe và nói đè theo', icon: BookOpen },
  { id: 'reflex', label: 'Phản xạ', desc: 'Nhìn tiếng Việt, nói tiếng Anh trong vài giây', icon: Zap },
  { id: 'roleplay', label: 'Nhập vai', desc: 'Dùng cụm vừa học trong một tình huống thật', icon: Users },
];

export default function FastTalkUnitPage() {
  const params = useParams();
  const unit = getFastTalkUnit(Number(params.unit));

  if (!unit) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
          <p className="text-white/40">Không tìm thấy bài học</p>
          <Link href="/fast-talk" className="text-violet-300 text-sm">Quay lại danh sách</Link>
        </div>
      </AppShell>
    );
  }

  // Keyed so moving to the next unit starts a fresh session instead of reusing state.
  return <UnitSession key={unit.id} unit={unit} />;
}

function UnitSession({ unit }: { unit: FastTalkUnit }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [reflexPct, setReflexPct] = useState<number | null>(null);
  const [roleplayAvg, setRoleplayAvg] = useState<number | null>(null);
  const [earnedXP, setEarnedXP] = useState(0);
  const { addNewCards } = useVocabSRS();
  const { addXP } = useProgress();

  const finish = useCallback((avg: number | null) => {
    setRoleplayAvg(avg);
    addNewCards(
      unit.chunks.map((c) => ({ word: c.en, translation: c.vi, phonetic: '', example: c.example, exampleTranslation: c.exampleVi })),
      FAST_TALK_SRS_SOURCE_OFFSET + unit.id,
    );
    if (markFastTalkUnitDone(unit.id)) {
      addXP(FAST_TALK_XP);
      setEarnedXP(FAST_TALK_XP);
    }
    setPhase('complete');
  }, [unit, addNewCards, addXP]);

  const stepIndex = STEPS.findIndex((s) => s.id === phase);
  const nextUnit = fastTalkUnits.find((u) => u.id === unit.id + 1);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 md:px-6 pb-24">
        <div className="pt-6 pb-4 flex items-center gap-3">
          <Link
            href="/fast-talk"
            className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/70"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">
              Bài {unit.id} · {unit.level} · {unit.track === 'life' ? 'Đời sống' : 'Công sở'}
            </p>
            <h1 className="text-base font-bold text-white truncate">{unit.title}</h1>
          </div>
          <span className="text-2xl">{unit.emoji}</span>
        </div>

        {stepIndex >= 0 && (
          <div className="flex gap-1.5 mb-6">
            {STEPS.map((s, i) => (
              <div key={s.id} className={`h-1.5 flex-1 rounded-full ${i < stepIndex ? 'bg-violet-400/60' : i === stepIndex ? 'bg-violet-400' : 'bg-white/[0.08]'}`} />
            ))}
          </div>
        )}

        {phase === 'intro' && (
          <div>
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-3xl mx-auto mb-3 flex items-center justify-center text-4xl bg-violet-500/15 border border-violet-500/30">
                {unit.emoji}
              </div>
              <h2 className="text-2xl font-black text-white">{unit.titleVi}</h2>
              <p className="text-white/45 text-sm mt-1 px-4">{unit.situation}</p>
            </div>
            <div className="space-y-2 mb-6">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-violet-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white/80">{i + 1}. {s.label}</p>
                      <p className="text-xs text-white/35">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-white/30 text-center mb-4">Khoảng 15–20 phút. Nên đeo tai nghe và học ở chỗ có thể nói to.</p>
            <button
              onClick={() => setPhase('listen')}
              className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-600 active:scale-95 transition-transform"
            >
              Bắt đầu
            </button>
          </div>
        )}

        {phase === 'listen' && <ListenPhase unit={unit} onNext={() => setPhase('chunks')} />}
        {phase === 'chunks' && <ChunksPhase unit={unit} onNext={() => setPhase('reflex')} />}
        {phase === 'reflex' && <ReflexPhase unit={unit} onDone={(pct) => { setReflexPct(pct); setPhase('roleplay'); }} />}
        {phase === 'roleplay' && <RoleplayPhase unit={unit} onDone={finish} />}

        {phase === 'complete' && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-emerald-500/15 border border-emerald-500/30">
              <Award className="w-10 h-10 text-emerald-300" />
            </div>
            <h2 className="text-2xl font-black text-white">Hoàn thành bài {unit.id}!</h2>
            {earnedXP > 0 && <p className="text-violet-300 text-sm font-semibold mt-1">+{earnedXP} XP</p>}

            <div className="grid grid-cols-2 gap-3 my-6">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <p className="text-2xl font-black text-white">{reflexPct ?? 0}%</p>
                <p className="text-xs text-white/40 mt-0.5">Phản xạ đúng ngay lần đầu</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                <p className="text-2xl font-black text-white">{roleplayAvg !== null ? `${roleplayAvg}%` : '—'}</p>
                <p className="text-xs text-white/40 mt-0.5">Điểm nói khi nhập vai</p>
              </div>
            </div>

            <p className="text-sm text-white/50 mb-6">
              {unit.chunks.length} cụm từ đã được thêm vào thẻ ôn tập (Vocabulary SRS). Ôn lại vào ngày mai để nhớ lâu.
              {(reflexPct ?? 0) < 70 && ' Phản xạ còn chậm. Nên làm lại phần phản xạ của bài này vào ngày mai.'}
            </p>

            <div className="flex flex-col gap-2">
              {nextUnit && (
                <Link
                  href={`/fast-talk/${nextUnit.id}`}
                  className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-600 flex items-center justify-center gap-2"
                >
                  Bài tiếp: {nextUnit.title} <ChevronRight className="w-4 h-4" />
                </Link>
              )}
              <button
                onClick={() => { setReflexPct(null); setRoleplayAvg(null); setEarnedXP(0); setPhase('reflex'); }}
                className="w-full py-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-white/70 font-semibold text-sm"
              >
                Luyện phản xạ lại
              </button>
              <Link href="/fast-talk" className="text-sm text-white/40 hover:text-white/70 py-2">Về danh sách bài</Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
