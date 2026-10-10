'use client';

import { useMemo, useState } from 'react';
import { Play, Square, Volume2, ChevronRight } from 'lucide-react';
import type { A1Day, A1Line } from '@/lib/a1';
import {
  useLinePlayer, useScoredRecorder, useMicSupported, MicButton, AttemptResult, SpeedToggle, NextButton,
  SLOW_RATE,
} from '@/components/fastTalk/shared';

function LineCard({ line, active, showVi, mic, onPlay }: {
  line: A1Line;
  active: boolean;
  showVi: boolean;
  mic: boolean;
  onPlay: () => void;
}) {
  const targets = useMemo(() => [line.text], [line]);
  const { recording, attempt, toggle } = useScoredRecorder(targets);
  const isYou = line.speaker === 'You';

  return (
    <div className={`p-3 rounded-2xl border transition-all ${active ? 'border-emerald-500/40 bg-emerald-500/[0.08]' : isYou ? 'border-violet-500/20 bg-violet-500/[0.05]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isYou ? 'text-violet-300' : 'text-cyan-300'}`}>
            {isYou ? 'Bạn' : line.speaker}
          </p>
          <p className="text-base text-white leading-relaxed">{line.text}</p>
          {showVi && <p className="text-sm text-white/40 italic mt-0.5">{line.vi}</p>}
        </div>
        <button onClick={onPlay} className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white/80 flex-shrink-0" aria-label="Nghe câu này">
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
      {mic && isYou && (
        <div className="mt-2 space-y-2">
          <MicButton recording={recording} onClick={() => toggle()} label="Nói câu này" />
          {attempt && <AttemptResult attempt={attempt} />}
        </div>
      )}
    </div>
  );
}

export default function DialoguePhase({ day, onNext }: { day: A1Day; onNext: () => void }) {
  const { play, stop, playing } = useLinePlayer();
  const [rate, setRate] = useState(SLOW_RATE);
  const [showVi, setShowVi] = useState(false);
  const mic = useMicSupported();
  const lines = day.dialogue.lines;
  const texts = useMemo(() => lines.map((l) => l.text), [lines]);
  const pitches = useMemo(() => lines.map((l) => (l.speaker === 'You' ? 1.15 : 0.85)), [lines]);
  // Reveals a tip for practising the learner's lines without reading.
  const [practice, setPractice] = useState(false);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">3. Hội thoại</h2>
        <p className="text-white/40 text-sm mt-0.5">{day.dialogue.context} Nghe cả bài, rồi nói các câu của bạn (khung tím).</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {playing !== null ? (
          <button onClick={stop} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 text-sm font-semibold">
            <Square className="w-3.5 h-3.5" /> Dừng
          </button>
        ) : (
          <button onClick={() => play(texts, { rate, pitches })} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-100 text-sm font-semibold">
            <Play className="w-3.5 h-3.5" /> Nghe cả hội thoại
          </button>
        )}
        <SpeedToggle rate={rate} onChange={setRate} />
        <button onClick={() => setShowVi(!showVi)} className="text-xs text-white/40 hover:text-white/70 px-2">
          {showVi ? 'Ẩn' : 'Hiện'} tiếng Việt
        </button>
      </div>

      <div className="space-y-2 mb-6">
        {lines.map((line, k) => (
          <LineCard
            key={k}
            line={line}
            active={playing === k}
            showVi={showVi}
            mic={mic}
            onPlay={() => play(texts, { rate, from: k, to: k + 1, pitches })}
          />
        ))}
      </div>

      {!mic && (
        <p className="text-xs text-white/35 mb-4">
          Trình duyệt này không nhận giọng nói. Hãy nghe từng câu rồi nói to theo. Dùng Chrome hoặc Safari để được chấm điểm.
        </p>
      )}

      {!practice ? (
        <button
          onClick={() => setPractice(true)}
          className="w-full mb-3 py-3 rounded-xl border border-dashed border-white/[0.12] text-white/50 text-sm font-semibold hover:text-white/80"
        >
          Mẹo: nghe lại, che chữ đi và tự nói câu của bạn
        </button>
      ) : (
        <p className="text-xs text-white/40 mb-3">
          Bấm loa ở câu của người kia, rồi tự nói câu tiếp theo của bạn mà không nhìn chữ. Lặp lại tới khi nói trôi chảy.
        </p>
      )}

      <NextButton onClick={() => { stop(); onNext(); }}>
        Tiếp: Nói về bạn <ChevronRight className="w-4 h-4" />
      </NextButton>
    </div>
  );
}
