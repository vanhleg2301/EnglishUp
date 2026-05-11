'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, CheckCircle, XCircle, MicOff } from 'lucide-react';
import { useTTS, useSpeechRecognition } from '@/hooks/useSpeech';
import type { Exercise } from '@/types';

interface Props {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
}

export default function Speaking({ exercise, onComplete }: Props) {
  const [status, setStatus] = useState<'idle' | 'listening' | 'done'>('idle');
  const [transcript, setTranscript] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const { speak } = useTTS();
  const { startListening, stopListening } = useSpeechRecognition();

  const handlePlay = () => speak(exercise.audioText ?? '', 0.75);

  const handleRecord = () => {
    if (status === 'listening') {
      stopListening();
      setStatus('idle');
      return;
    }
    setStatus('listening');
    setTranscript('');
    startListening(
      (result) => {
        setTranscript(result);
        const correct = exercise.correct
          .split(' ')
          .filter(Boolean)
          .every((word) => result.includes(word));
        setIsCorrect(correct);
        setStatus('done');
        setTimeout(() => onComplete(correct), 1500);
      },
      () => setStatus('idle')
    );
  };

  const handleSkip = () => onComplete(false);

  return (
    <div className="space-y-6">
      <p className="text-xl font-semibold text-white text-center">{exercise.question}</p>

      {/* Phrase to say */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
        <p className="text-lg font-medium text-white">{exercise.audioText}</p>
        <button
          onClick={handlePlay}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm hover:bg-cyan-500/30 transition-all"
        >
          <Volume2 className="w-4 h-4" />
          Nghe mẫu
        </button>
      </div>

      {/* Mic button */}
      <div className="flex justify-center">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleRecord}
          className={`relative w-28 h-28 rounded-full flex items-center justify-center shadow-lg transition-all ${
            status === 'listening'
              ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/40'
              : 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-violet-500/30'
          }`}
        >
          {status === 'listening' && (
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="absolute inset-0 rounded-full bg-red-400"
            />
          )}
          {status === 'listening' ? (
            <MicOff className="w-12 h-12 text-white relative z-10" />
          ) : (
            <Mic className="w-12 h-12 text-white relative z-10" />
          )}
        </motion.button>
      </div>

      <p className="text-center text-white/50 text-sm">
        {status === 'idle' && 'Nhấp vào micro để nói'}
        {status === 'listening' && 'Đang nghe... Nói to và rõ ràng'}
        {status === 'done' && 'Đã ghi nhận'}
      </p>

      {/* Result */}
      <AnimatePresence>
        {status === 'done' && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl flex items-start gap-3 ${
              isCorrect ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-amber-500/20 border border-amber-500/30'
            }`}
          >
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-semibold ${isCorrect ? 'text-emerald-300' : 'text-amber-300'}`}>
                {isCorrect ? 'Tốt lắm!' : 'Cần luyện thêm'}
              </p>
              <p className="text-xs text-white/50 mt-1">Bạn nói: "{transcript}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {status === 'idle' && (
        <button onClick={handleSkip} className="w-full py-3 text-white/30 text-sm hover:text-white/50 transition-all">
          Bỏ qua bài này
        </button>
      )}
    </div>
  );
}
