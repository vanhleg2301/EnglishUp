'use client';

import { useMemo } from 'react';
import { Volume2, ChevronRight } from 'lucide-react';
import type { FastTalkUnit, FTChunk } from '@/lib/fastTalk';
import {
  useLinePlayer, useScoredRecorder, useMicSupported, MicButton, AttemptResult, NextButton,
  NATURAL_RATE, SLOW_RATE,
} from './shared';

function ChunkCard({ chunk, index, micSupported, play }: {
  chunk: FTChunk;
  index: number;
  micSupported: boolean;
  play: ReturnType<typeof useLinePlayer>['play'];
}) {
  const targets = useMemo(() => [chunk.example], [chunk]);
  const { recording, attempt, toggle } = useScoredRecorder(targets);

  return (
    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold text-white/25 mb-0.5">#{index + 1}</p>
          <p className="text-lg font-black text-white leading-snug">{chunk.en}</p>
          <p className="text-sm text-violet-200/80">{chunk.vi}</p>
        </div>
        <button
          onClick={() => play([chunk.en], { rate: SLOW_RATE })}
          className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white/80 flex-shrink-0"
          aria-label="Nghe cụm từ"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.06]">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <p className="text-sm text-white/90">{chunk.example}</p>
            <p className="text-xs text-white/35 italic mt-0.5">{chunk.exampleVi}</p>
          </div>
          <button
            onClick={() => play([chunk.example], { rate: NATURAL_RATE })}
            className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/30 hover:text-white/70 flex-shrink-0"
            aria-label="Nghe ví dụ"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
        {micSupported && (
          <div className="mt-3 space-y-2">
            <MicButton recording={recording} onClick={() => toggle()} label="Nói theo câu ví dụ" />
            {attempt && <AttemptResult attempt={attempt} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChunksPhase({ unit, onNext }: { unit: FastTalkUnit; onNext: () => void }) {
  const { play, stop } = useLinePlayer();
  const micSupported = useMicSupported();

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">2. Học cụm từ</h2>
        <p className="text-white/40 text-sm mt-0.5">
          Học nguyên cụm, đừng tách từng từ. Nghe câu ví dụ ở tốc độ thật rồi nói đè theo (shadowing).
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {unit.chunks.map((c, i) => (
          <ChunkCard key={i} chunk={c} index={i} micSupported={micSupported} play={play} />
        ))}
      </div>

      <NextButton onClick={() => { stop(); onNext(); }}>
        Tiếp: Luyện phản xạ <ChevronRight className="w-4 h-4" />
      </NextButton>
    </div>
  );
}
