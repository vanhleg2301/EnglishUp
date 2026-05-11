'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Volume2, RotateCcw } from 'lucide-react';
import { useTTS, useSpeechRecognition, scorePronunciation } from '@/hooks/useSpeech';

interface Props {
  word: string;
  phonetic: string;
  translation: string;
  onClose: () => void;
}

type Status = 'idle' | 'listening' | 'result';

function ScoreRing({ score }: { score: number }) {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
  const label = score >= 80 ? 'Xuất sắc!' : score >= 50 ? 'Khá tốt!' : 'Cần luyện thêm';
  const emoji = score >= 80 ? '🎉' : score >= 50 ? '👍' : '💪';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 108 108">
          <circle cx="54" cy="54" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
          <motion.circle
            cx="54" cy="54" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (score / 100) * circ }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.1 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-lg">{emoji}</span>
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-2xl font-black leading-none" style={{ color }}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      <p className="text-sm font-semibold" style={{ color }}>{label}</p>
    </div>
  );
}

export default function PronunciationPanel({ word, phonetic, translation, onClose }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [heard, setHeard] = useState('');
  const [result, setResult] = useState<{ results: { word: string; matched: boolean }[]; score: number } | null>(null);
  const [attempts, setAttempts] = useState(0);

  const { speak } = useTTS();
  const { startListening, stopListening } = useSpeechRecognition();

  const handleRecord = () => {
    if (status === 'listening') {
      stopListening();
      setStatus('idle');
      return;
    }
    setStatus('listening');
    setResult(null);
    setHeard('');

    startListening(
      (transcript) => {
        setHeard(transcript);
        const scored = scorePronunciation(word, transcript);
        setResult(scored);
        setStatus('result');
        setAttempts((a) => a + 1);
      },
      () => { setStatus((s) => s === 'listening' ? 'idle' : s); }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 35 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-[#111125] border border-white/10 p-6 space-y-5 mb-4 sm:mb-0"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">Kiểm tra phát âm</p>
            <h3 className="text-3xl font-black text-white leading-tight">{word}</h3>
            <p className="text-violet-300 font-mono text-sm mt-0.5">{phonetic}</p>
            <p className="text-white/40 text-sm mt-0.5">{translation}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Listen */}
        <button
          onClick={() => speak(word, 0.75)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-300 hover:bg-cyan-500/25 transition-all"
        >
          <Volume2 className="w-4 h-4" />
          <span className="text-sm font-semibold">Nghe giọng nữ chuẩn (US)</span>
        </button>

        <AnimatePresence mode="wait">
          {status !== 'result' ? (
            <motion.div key="rec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex justify-center">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={handleRecord}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg ${
                    status === 'listening'
                      ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-red-500/40'
                      : 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-violet-500/30'
                  }`}
                >
                  {status === 'listening' && (
                    <motion.div
                      animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.1 }}
                      className="absolute inset-0 rounded-full bg-red-400"
                    />
                  )}
                  {status === 'listening'
                    ? <MicOff className="w-10 h-10 text-white relative z-10" />
                    : <Mic className="w-10 h-10 text-white relative z-10" />
                  }
                </motion.button>
              </div>
              <p className="text-center text-white/40 text-sm">
                {status === 'idle'
                  ? attempts > 0 ? 'Thử lại lần nữa' : 'Nhấp micro để nói'
                  : 'Đang nghe...'}
              </p>
            </motion.div>
          ) : (
            <motion.div key="res" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center justify-center gap-6">
                <ScoreRing score={result!.score} />
                <div className="flex-1 space-y-2">
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Từng từ</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result!.results.map((r, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                          r.matched
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-red-500/20 border-red-500/40 text-red-300'
                        }`}
                      >
                        {r.matched ? '✓' : '✗'} {r.word}
                      </motion.span>
                    ))}
                  </div>
                  {heard && (
                    <p className="text-white/30 text-xs italic">Nghe được: "{heard}"</p>
                  )}
                </div>
              </div>

              {result!.score < 80 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/60 space-y-0.5">
                  <p className="font-semibold text-amber-300 mb-1">Mẹo phát âm</p>
                  <p>• Chú ý <strong className="text-white/60">trọng âm</strong> - syllable được nhấn mạnh hơn</p>
                  <p>• Phát âm rõ <strong className="text-white/60">âm cuối</strong>: -t, -d, -s, -th, -ng</p>
                  <p>• Mở miệng to hơn với các nguyên âm /æ/, /ɑː/</p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => { setStatus('idle'); setResult(null); }}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Thử lại
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm"
                >
                  Xong
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
