'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Send, Bot, RotateCcw, Sparkles } from 'lucide-react';
import PremiumGate from '@/components/PremiumGate';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const STARTERS = [
  { emoji: '🗓️', label: 'Stand-up meeting', prompt: "Let's practice a daily stand-up. Play the role of my team lead and ask me what I did yesterday, what I'm doing today, and if there are any blockers." },
  { emoji: '🐛', label: 'Explain a bug', prompt: "I need to practice explaining a technical bug to a non-technical manager. Play the role of my manager and ask me what happened." },
  { emoji: '🤝', label: 'Tech networking', prompt: "Be a senior engineer at a tech meetup. I'll practice introducing myself and making small talk." },
  { emoji: '💬', label: 'Give feedback', prompt: "I need to practice giving constructive feedback. Be my teammate who just finished a project and I need to review your work." },
  { emoji: '🎯', label: 'Salary negotiation', prompt: "Play my manager so I can practice negotiating a salary raise. Be a bit resistant at first, like a real manager." },
  { emoji: '🚀', label: 'Demo a feature', prompt: "Be a client or stakeholder. I'm going to demo a new feature I built and I need to practice explaining it clearly and professionally." },
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white/40"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function formatContent(content: string) {
  const parts = content.split(/(💡 Better:.*)/);
  return parts.map((part, i) => {
    if (part.startsWith('💡 Better:')) {
      return (
        <div key={i} className="mt-2.5 pt-2.5 border-t border-amber-500/20 flex items-start gap-1.5">
          <span className="text-amber-400 text-sm flex-shrink-0">💡</span>
          <p className="text-amber-200/80 text-sm leading-relaxed">{part.replace('💡 ', '')}</p>
        </div>
      );
    }
    return part ? <span key={i}>{part}</span> : null;
  });
}

export default function AIChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [apiError, setApiError] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim() || isStreaming) return;
    setApiError(false);

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: userText.trim() };
    const assistantId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: 'assistant', content: '' },
    ]);
    setInput('');
    setIsStreaming(true);

    const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));

    try {
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err.error?.includes('ANTHROPIC_API_KEY')) {
          setApiError(true);
        }
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const snap = accumulated;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: snap } : m))
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  }, [isStreaming, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setInput('');
    setIsStreaming(false);
    setApiError(false);
  };

  const isEmpty = messages.length === 0;

  const isPremium = user?.role === 'admin' || user?.subscription?.status === 'active';
  if (!isPremium) {
    return <PremiumGate mode="fullscreen" featureName="AI Conversation" />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] backdrop-blur-xl bg-black/50 sticky top-0 z-10 flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/app">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>

          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-extrabold text-base leading-none">AI Conversation</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">Pro</span>
              </div>
              <p className="text-white/35 text-xs mt-0.5">Practice real English — corrections included</p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleReset}
              className="p-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
              title="New conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* API error banner */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500/10 border-b border-amber-500/20 overflow-hidden flex-shrink-0"
          >
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-start gap-2">
              <span className="text-amber-400 text-sm flex-shrink-0 mt-0.5">⚠️</span>
              <div className="text-amber-200/70 text-xs leading-relaxed">
                <span className="font-bold text-amber-300">API key chưa được cấu hình.</span> Thêm <code className="bg-white/10 px-1 rounded">ANTHROPIC_API_KEY</code> vào file <code className="bg-white/10 px-1 rounded">.env.local</code> để sử dụng tính năng này.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <AnimatePresence>
            {isEmpty && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Welcome */}
                <div className="text-center pt-8 space-y-3">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center mx-auto shadow-2xl shadow-violet-500/30"
                  >
                    <Sparkles className="w-7 h-7 text-white" />
                  </motion.div>
                  <h2 className="text-xl font-black text-white">Luyện nói với AI</h2>
                  <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
                    Chọn tình huống bên dưới hoặc bắt đầu trò chuyện bằng tiếng Anh. AI sẽ nhẹ nhàng sửa lỗi ngữ pháp khi cần.
                  </p>
                </div>

                {/* Starters */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {STARTERS.map((s, i) => (
                    <motion.button
                      key={s.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => sendMessage(s.prompt)}
                      className="text-left p-3.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group"
                    >
                      <span className="text-xl block mb-1.5">{s.emoji}</span>
                      <p className="text-white/70 font-semibold text-xs group-hover:text-white transition-colors">{s.label}</p>
                    </motion.button>
                  ))}
                </div>

                <p className="text-center text-white/20 text-xs">
                  hoặc gõ bất kỳ câu tiếng Anh nào bên dưới ↓
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="space-y-4 mt-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center flex-shrink-0 mr-2.5 mt-1 shadow-sm shadow-violet-500/20">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white px-4 py-3 rounded-br-sm'
                      : 'bg-white/[0.06] border border-white/[0.08] text-white/85 px-4 py-3 rounded-bl-sm'
                  }`}
                >
                  {msg.role === 'assistant' && !msg.content ? (
                    <TypingDots />
                  ) : (
                    <div>{msg.role === 'assistant' ? formatContent(msg.content) : msg.content}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div ref={bottomRef} className="h-4" />
        </div>
      </main>

      {/* Input */}
      <div className="border-t border-white/[0.06] bg-black/50 backdrop-blur-xl flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type in English… (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.08] transition-all resize-none leading-relaxed"
                style={{ maxHeight: '120px', overflowY: 'auto' }}
                disabled={isStreaming}
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
            >
              <Send className="w-4 h-4 text-white" />
            </motion.button>
          </form>
          <p className="text-white/15 text-[10px] text-center mt-2">
            AI có thể mắc lỗi. Sử dụng để luyện tập, không phải để học ngữ pháp từ chính xác.
          </p>
        </div>
      </div>
    </div>
  );
}
