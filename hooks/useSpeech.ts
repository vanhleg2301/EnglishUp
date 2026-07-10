'use client';

import { useCallback, useRef } from 'react';

const FEMALE_VOICE_PREFS = [
  'Google US English',     // Chrome – female
  'Samantha',              // macOS/iOS
  'Karen',                 // macOS/iOS (Australian)
  'Moira',                 // macOS/iOS (Irish)
  'Tessa',                 // macOS/iOS (South African)
  'Zira',                  // Windows (Microsoft Zira)
  'Eva',                   // Windows (Microsoft Eva)
  'Hazel',                 // Windows (Microsoft Hazel – UK female)
  'Susan',
  'Victoria',
];

function pickFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined') return null;
  const voices = window.speechSynthesis.getVoices();
  const enVoices = voices.filter((v) => v.lang.startsWith('en'));

  for (const pref of FEMALE_VOICE_PREFS) {
    const match = enVoices.find((v) => v.name.includes(pref));
    if (match) return match;
  }
  // fallback: first en-US voice
  return enVoices.find((v) => v.lang === 'en-US') ?? enVoices[0] ?? null;
}

export function useTTS() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const ensureVoice = useCallback(() => {
    if (voiceRef.current) return;
    voiceRef.current = pickFemaleVoice();
    // voices may not be loaded yet on first call
    if (!voiceRef.current && typeof window !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = () => {
        voiceRef.current = pickFemaleVoice();
      };
    }
  }, []);

  const speak = useCallback((text: string, rate = 0.82) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    ensureVoice();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.05;
    if (voiceRef.current) utterance.voice = voiceRef.current;
    window.speechSynthesis.speak(utterance);
  }, [ensureVoice]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
  }, []);

  return { speak, stop };
}

export interface PronunciationResult {
  word: string;
  matched: boolean;
}

export function scorePronunciation(correct: string, heard: string): { results: PronunciationResult[]; score: number } {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/).filter(Boolean);

  const correctWords = normalize(correct);
  const heardWords = normalize(heard);

  const results: PronunciationResult[] = correctWords.map((word) => {
    // exact match or fuzzy (heard word within ±2 chars)
    const matched = heardWords.some((h) => {
      if (h === word) return true;
      // simple Levenshtein-like tolerance: allow 1 substitution per 4 chars
      if (Math.abs(h.length - word.length) <= 1) {
        let diff = 0;
        const len = Math.max(h.length, word.length);
        for (let i = 0; i < len; i++) if (h[i] !== word[i]) diff++;
        return diff <= Math.ceil(word.length / 4);
      }
      return false;
    });
    return { word, matched };
  });

  const score = correctWords.length === 0 ? 0 : Math.round((results.filter((r) => r.matched).length / correctWords.length) * 100);
  return { results, score };
}

/**
 * WKWebView (Capacitor iOS wrapper) does not implement the Web Speech
 * SpeechRecognition API — only full Safari does. Check this before wiring
 * up a mic button so the UI can disable/hide it instead of relying on the
 * startListening() alert() fallback.
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

export function useSpeechRecognition() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(
    (onResult: (transcript: string) => void, onEnd?: () => void) => {
      if (typeof window === 'undefined') return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) {
        alert('Tính năng nhận dạng giọng nói không khả dụng ở đây. Hãy mở englishup.vn bằng Safari hoặc Chrome để luyện phát âm.');
        return;
      }
      const rec = new SR();
      rec.lang = 'en-US';
      rec.interimResults = false;
      rec.maxAlternatives = 5;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (e: any) => {
        // pick best alternative
        const transcript = e.results[0][0].transcript.toLowerCase();
        onResult(transcript);
      };
      rec.onend = () => onEnd?.();
      rec.onerror = () => onEnd?.();
      recognitionRef.current = rec;
      rec.start();
    },
    []
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { startListening, stopListening };
}

export function useLiveSpeechRecognition() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(
    (
      onInterim: (transcript: string) => void,
      onFinal: (transcript: string) => void,
      onEnd?: () => void
    ) => {
      if (typeof window === 'undefined') return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) {
        alert('Tính năng nhận dạng giọng nói không khả dụng ở đây. Hãy mở englishup.vn bằng Safari hoặc Chrome để luyện phát âm.');
        return;
      }
      const rec = new SR();
      rec.lang = 'en-US';
      rec.interimResults = true;
      rec.maxAlternatives = 3;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (e: any) => {
        let interim = '';
        let finalText = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalText += t;
          else interim += t;
        }
        if (interim) onInterim(interim);
        if (finalText) onFinal(finalText.toLowerCase().trim());
      };
      rec.onend = () => onEnd?.();
      rec.onerror = () => onEnd?.();
      recognitionRef.current = rec;
      rec.start();
    },
    []
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { startListening, stopListening };
}
