'use client';

import { useEffect, useMemo, useState } from 'react';
import { Volume2, ChevronRight, Eye } from 'lucide-react';
import type { FastTalkUnit } from '@/lib/fastTalk';
import {
  useLinePlayer, useScoredRecorder, useMicSupported, MicButton, AttemptResult,
  NATURAL_RATE, type Attempt,
} from './shared';

export default function RoleplayPhase({ unit, onDone }: { unit: FastTalkUnit; onDone: (avgScore: number | null) => void }) {
  const lines = unit.roleplay.lines;
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showVi, setShowVi] = useState(false);
  const [scores, setScores] = useState<Record<number, number>>({});
  const { play, stop } = useLinePlayer();
  const micSupported = useMicSupported();

  const line = lines[pos];
  const isYou = line.speaker === 'you';
  const targets = useMemo(() => [line.text], [line]);
  const { recording, attempt, toggle, reset } = useScoredRecorder(targets);

  // The other person speaks automatically when it's their turn.
  useEffect(() => {
    if (lines[pos].speaker === 'them') play([lines[pos].text], { rate: NATURAL_RATE });
  }, [pos, lines, play]);

  const handleMic = () => {
    toggle((a: Attempt) => {
      setScores((prev) => ({ ...prev, [pos]: Math.max(prev[pos] ?? 0, a.score) }));
      setRevealed(true);
    });
  };

  const next = () => {
    stop();
    reset();
    setRevealed(false);
    if (pos + 1 >= lines.length) {
      const values = Object.values(scores);
      onDone(values.length ? Math.round(values.reduce((s, v) => s + v, 0) / values.length) : null);
      return;
    }
    setPos(pos + 1);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">4. Nhập vai</h2>
        <p className="text-white/40 text-sm mt-0.5">{unit.roleplay.scenario} Dùng cụm từ vừa học để trả lời.</p>
      </div>

      <div className="flex justify-end mb-2">
        <button onClick={() => setShowVi(!showVi)} className="text-xs text-white/40 hover:text-white/70">
          {showVi ? 'Ẩn' : 'Hiện'} tiếng Việt cho người kia
        </button>
      </div>

      {/* Conversation so far */}
      <div className="space-y-2 mb-4">
        {lines.slice(0, pos).map((l, i) => (
          <div key={i} className={`flex ${l.speaker === 'you' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-sm ${l.speaker === 'you' ? 'bg-violet-500/20 text-violet-100' : 'bg-white/[0.05] text-white/80'}`}>
              {l.text}
              {scores[i] !== undefined && <span className="ml-2 text-[10px] font-bold text-white/40">{scores[i]}%</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Current turn */}
      {!isYou ? (
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 mb-1">Người kia nói</p>
          <div className="flex items-start gap-2">
            <p className="flex-1 text-base text-white">{line.text}</p>
            <button
              onClick={() => play([line.text], { rate: NATURAL_RATE })}
              className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white/80 flex-shrink-0"
              aria-label="Nghe lại"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          {showVi && <p className="text-xs text-white/40 italic mt-1">{line.vi}</p>}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-violet-500/[0.08] border border-violet-500/25 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-300 mb-1">Lượt của bạn, hãy nói ý này</p>
          <p className="text-base text-white font-semibold">{line.vi}</p>
          {revealed && (
            <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-start gap-2">
              <p className="flex-1 text-sm text-emerald-200">Câu mẫu: {line.text}</p>
              <button
                onClick={() => play([line.text], { rate: NATURAL_RATE })}
                className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white/80 flex-shrink-0"
                aria-label="Nghe câu mẫu"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {isYou && attempt && <div className="mb-4"><AttemptResult attempt={attempt} /></div>}

      <div className="flex gap-2">
        {isYou && micSupported && (
          <MicButton recording={recording} onClick={handleMic} label={attempt ? 'Nói lại' : 'Nói'} />
        )}
        {isYou && !revealed && (
          <button
            onClick={() => { setRevealed(true); play([line.text], { rate: NATURAL_RATE }); }}
            className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 text-sm font-semibold flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" /> Câu mẫu
          </button>
        )}
        <button
          onClick={next}
          className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/[0.09]"
        >
          {pos + 1 >= lines.length ? 'Hoàn thành bài' : 'Tiếp'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
