'use client';

import { useCallback, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon, BookOpenText, MessagesSquare, Mic, Award, ChevronRight, Lightbulb } from 'lucide-react';
import AppShell from '@/components/AppShell';
import WordsPhase from '@/components/a1/WordsPhase';
import StoryPhase from '@/components/a1/StoryPhase';
import DialoguePhase from '@/components/a1/DialoguePhase';
import SpeakPhase from '@/components/a1/SpeakPhase';
import { getA1Day, a1Days, markA1DayDone, A1_XP, A1_SRS_SOURCE_OFFSET, type A1Day } from '@/lib/a1';
import { useVocabSRS } from '@/hooks/useVocabSRS';
import { useProgress } from '@/hooks/useProgress';

type Phase = 'intro' | 'words' | 'story' | 'dialogue' | 'speak' | 'complete';

const STEPS: { id: Phase; label: string; desc: string; icon: React.ElementType }[] = [
  { id: 'words', label: 'Từ mới qua ngữ cảnh', desc: '8 từ: nhìn hình, nghe câu, tự đoán nghĩa', icon: ImageIcon },
  { id: 'story', label: 'Nghe câu chuyện', desc: 'Truyện ngắn dùng lại từ mới, trả lời Yes/No', icon: BookOpenText },
  { id: 'dialogue', label: 'Hội thoại', desc: 'Nghe và nói theo một cuộc trò chuyện thật', icon: MessagesSquare },
  { id: 'speak', label: 'Nói về bạn', desc: 'Trả lời câu hỏi về chính bạn', icon: Mic },
];

export default function A1DayPage() {
  const params = useParams();
  const day = getA1Day(Number(params.day));

  if (!day) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
          <p className="text-white/40">Không tìm thấy bài học</p>
          <Link href="/a1" className="text-emerald-300 text-sm">Quay lại danh sách</Link>
        </div>
      </AppShell>
    );
  }

  // Keyed so moving to the next day starts a fresh session instead of reusing state.
  return <DaySession key={day.day} day={day} />;
}

function DaySession({ day }: { day: A1Day }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [earnedXP, setEarnedXP] = useState(0);
  const { addNewCards } = useVocabSRS();
  const { addXP } = useProgress();

  const finish = useCallback(() => {
    addNewCards(
      day.words.map((w) => ({ word: w.word, translation: w.vi, phonetic: '', example: w.examples[0], exampleTranslation: '' })),
      A1_SRS_SOURCE_OFFSET + day.day,
    );
    if (markA1DayDone(day.day)) {
      addXP(A1_XP);
      setEarnedXP(A1_XP);
    }
    setPhase('complete');
  }, [day, addNewCards, addXP]);

  const stepIndex = STEPS.findIndex((s) => s.id === phase);
  const nextDay = a1Days.find((d) => d.day === day.day + 1);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 md:px-6 pb-24">
        <div className="pt-6 pb-4 flex items-center gap-3">
          <Link
            href="/a1"
            className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/70"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">Ngày {day.day} / 20 · A1</p>
            <h1 className="text-base font-bold text-white truncate">{day.title}</h1>
          </div>
          <span className="text-2xl">{day.emoji}</span>
        </div>

        {stepIndex >= 0 && (
          <div className="flex gap-1.5 mb-6">
            {STEPS.map((s, i) => (
              <div key={s.id} className={`h-1.5 flex-1 rounded-full ${i < stepIndex ? 'bg-emerald-400/60' : i === stepIndex ? 'bg-emerald-400' : 'bg-white/[0.08]'}`} />
            ))}
          </div>
        )}

        {phase === 'intro' && (
          <div>
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-3xl mx-auto mb-3 flex items-center justify-center text-4xl bg-emerald-500/15 border border-emerald-500/30">
                {day.emoji}
              </div>
              <h2 className="text-2xl font-black text-white">{day.titleVi}</h2>
              <p className="text-white/50 text-sm mt-2 px-4">Sau bài này bạn có thể: {day.goal}</p>
            </div>
            <div className="space-y-2 mb-5">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white/80">{i + 1}. {s.label}</p>
                      <p className="text-xs text-white/35">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-white/30 text-center mb-4">Khoảng 30–45 phút. Đeo tai nghe, học ở chỗ có thể nói to.</p>
            <button
              onClick={() => setPhase('words')}
              className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 active:scale-95 transition-transform"
            >
              Bắt đầu ngày {day.day}
            </button>
          </div>
        )}

        {phase === 'words' && <WordsPhase day={day} onNext={() => setPhase('story')} />}
        {phase === 'story' && <StoryPhase day={day} onNext={() => setPhase('dialogue')} />}
        {phase === 'dialogue' && <DialoguePhase day={day} onNext={() => setPhase('speak')} />}
        {phase === 'speak' && <SpeakPhase day={day} onDone={finish} />}

        {phase === 'complete' && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-emerald-500/15 border border-emerald-500/30">
              <Award className="w-10 h-10 text-emerald-300" />
            </div>
            <h2 className="text-2xl font-black text-white">Xong ngày {day.day}!</h2>
            {earnedXP > 0 && <p className="text-emerald-300 text-sm font-semibold mt-1">+{earnedXP} XP</p>}

            <div className="mt-6 p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 text-left">
              <p className="text-xs font-bold text-amber-200 flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-3.5 h-3.5" /> Ghi nhớ hôm nay
              </p>
              <p className="text-sm text-white/70">{day.tip}</p>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-left">
              <p className="text-xs font-bold text-white/60 mb-2">Từ đã học</p>
              <div className="flex flex-wrap gap-1.5">
                {day.words.map((w) => (
                  <span key={w.word} className="text-xs px-2 py-1 rounded-lg bg-white/[0.05] text-white/70">
                    {w.emoji} {w.word} <span className="text-white/35">· {w.vi}</span>
                  </span>
                ))}
              </div>
              <p className="text-xs text-white/35 mt-3">Đã thêm vào thẻ ôn tập (Vocabulary SRS). Mai mở Vocabulary để ôn trước khi học ngày mới.</p>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              {nextDay && (
                <Link
                  href={`/a1/${nextDay.day}`}
                  className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 flex items-center justify-center gap-2"
                >
                  Ngày {nextDay.day}: {nextDay.titleVi} <ChevronRight className="w-4 h-4" />
                </Link>
              )}
              <button
                onClick={() => setPhase('story')}
                className="w-full py-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-white/70 font-semibold text-sm"
              >
                Nghe lại câu chuyện
              </button>
              <Link href="/a1" className="text-sm text-white/40 hover:text-white/70 py-2">Về danh sách 20 ngày</Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
