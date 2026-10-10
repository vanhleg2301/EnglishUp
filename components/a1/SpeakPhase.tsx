'use client';

import { useEffect, useMemo, useState } from 'react';
import { Volume2, Eye, ChevronRight } from 'lucide-react';
import type { A1Day } from '@/lib/a1';
import {
  useLinePlayer, useScoredRecorder, useMicSupported, MicButton, SLOW_RATE,
} from '@/components/fastTalk/shared';

/**
 * Personal questions: answers differ per learner, so nothing is scored —
 * the learner hears what the app understood and compares with a model answer.
 */
export default function SpeakPhase({ day, onDone }: { day: A1Day; onDone: () => void }) {
  const { play, stop } = useLinePlayer();
  const mic = useMicSupported();
  const [i, setI] = useState(0);
  const [showModel, setShowModel] = useState(false);
  const prompt = day.speak[i];
  const targets = useMemo(() => [prompt.model], [prompt]);
  const { recording, attempt, toggle, reset } = useScoredRecorder(targets);

  useEffect(() => {
    play([prompt.q], { rate: SLOW_RATE });
  }, [prompt, play]);

  const next = () => {
    stop();
    reset();
    setShowModel(false);
    if (i + 1 >= day.speak.length) onDone();
    else setI(i + 1);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">4. Nói về bạn</h2>
        <p className="text-white/40 text-sm mt-0.5">Trả lời bằng thông tin thật của bạn. Câu mẫu chỉ để tham khảo, đổi tên, số, nơi chốn cho đúng với bạn.</p>
      </div>

      <p className="text-xs text-white/30 mb-2">Câu {i + 1} / {day.speak.length}</p>

      <div className="p-5 rounded-2xl border border-violet-500/25 bg-violet-500/[0.07] mb-4">
        <div className="flex items-start gap-2">
          <p className="flex-1 text-xl font-bold text-white">{prompt.q}</p>
          <button
            onClick={() => play([prompt.q], { rate: SLOW_RATE })}
            className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white flex-shrink-0"
            aria-label="Nghe câu hỏi"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-white/40 mt-1">{prompt.vi}</p>

        {attempt && (
          <div className="mt-4 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <p className="text-[11px] uppercase tracking-wider text-white/30 font-bold mb-0.5">App nghe được</p>
            <p className="text-base text-white">“{attempt.heard}”</p>
            <p className="text-xs text-white/35 mt-1">Nếu khác ý bạn, nói chậm và rõ hơn rồi thử lại.</p>
          </div>
        )}

        {showModel && (
          <div className="mt-4 pt-3 border-t border-white/[0.08]">
            <div className="flex items-start gap-2">
              <p className="flex-1 text-base font-semibold text-emerald-200">{prompt.model}</p>
              <button
                onClick={() => play([prompt.model], { rate: SLOW_RATE })}
                className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white flex-shrink-0"
                aria-label="Nghe câu mẫu"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-white/35 italic">{prompt.modelVi}</p>
          </div>
        )}
      </div>

      {!mic && (
        <p className="text-xs text-white/35 mb-3">Trình duyệt này không nhận giọng nói. Hãy nói to câu trả lời của bạn, rồi xem câu mẫu.</p>
      )}

      <div className="flex gap-2">
        {mic && <MicButton recording={recording} onClick={() => toggle(() => setShowModel(true))} label={attempt ? 'Nói lại' : 'Trả lời'} />}
        {!showModel && (
          <button
            onClick={() => { setShowModel(true); play([prompt.model], { rate: SLOW_RATE }); }}
            className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 text-sm font-semibold flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" /> Câu mẫu
          </button>
        )}
        <button
          onClick={next}
          className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/[0.09]"
        >
          {i + 1 >= day.speak.length ? 'Hoàn thành' : 'Tiếp'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
