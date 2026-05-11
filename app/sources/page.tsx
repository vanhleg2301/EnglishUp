'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface Resource {
  name: string;
  url: string;
  description: string;
}

interface Category {
  title: string;
  note?: string;
  items: Resource[];
}

const CATEGORIES: Category[] = [
  {
    title: 'Pronunciation & IPA',
    items: [
      { name: 'Forvo', url: 'https://forvo.com', description: 'Native speaker pronunciation recordings for any word.' },
      { name: 'YouGlish', url: 'https://youglish.com', description: 'Hear real people say words in YouTube videos — natural context.' },
      { name: 'Cambridge Dictionary', url: 'https://dictionary.cambridge.org', description: 'IPA transcriptions with both UK and US audio.' },
      { name: 'IPA Chart with Audio', url: 'https://www.ipachart.com', description: 'Click any phoneme to hear it — great for reference.' },
      { name: 'ELSA Speak', url: 'https://elsaspeak.com', description: 'AI accent coach — listens to your pronunciation and gives feedback.' },
    ],
  },
  {
    title: 'Tech & Professional English',
    items: [
      { name: 'Stack Overflow', url: 'https://stackoverflow.com', description: 'Read how developers actually write in English — questions, answers, comments.' },
      { name: 'Hacker News', url: 'https://news.ycombinator.com', description: 'Real tech community discussions. Informal, smart English.' },
      { name: 'GitHub', url: 'https://github.com', description: 'Read PR descriptions, issue reports, and commit messages from real projects.' },
      { name: 'The Pragmatic Engineer Newsletter', url: 'https://newsletter.pragmaticengineer.com', description: 'Engineering culture, job market, tech communication — real professional writing.' },
    ],
  },
  {
    title: 'Slang & Idioms',
    items: [
      { name: 'Urban Dictionary', url: 'https://www.urbandictionary.com', description: 'Crowdsourced slang definitions. Content is unfiltered — use with awareness.' },
      { name: 'Merriam-Webster', url: 'https://www.merriam-webster.com', description: 'The most authoritative American English dictionary. Has idiom definitions too.' },
      { name: 'The Free Dictionary — Idioms', url: 'https://idioms.thefreedictionary.com', description: 'Dedicated idioms index. Great for understanding phrases in context.' },
      { name: 'Linguee', url: 'https://www.linguee.com', description: 'Shows how phrases are used in real translated documents — great for context.' },
    ],
  },
  {
    title: 'Listening & Speaking',
    items: [
      { name: 'BBC Learning English', url: 'https://www.bbc.co.uk/learningenglish', description: 'Business English, pronunciation, and everyday conversations. High quality.' },
      { name: 'TED Talks', url: 'https://www.ted.com', description: 'Watch smart people explain complex ideas clearly. Turn on subtitles, then turn them off.' },
      { name: 'Shadowing with Language Transfer', url: 'https://www.languagetransfer.org', description: 'The method behind shadowing — learn why it works and how to do it properly.' },
      { name: 'VOA Learning English', url: 'https://learningenglish.voanews.com', description: 'Slower, clearer speech. Good for intermediate listeners building up to native speed.' },
    ],
  },
  {
    title: 'Practice & Tools',
    items: [
      { name: 'Anki', url: 'https://apps.ankiweb.net', description: 'Spaced repetition flashcards. Best way to retain vocabulary long-term.' },
      { name: 'italki', url: 'https://www.italki.com', description: 'Real conversations with native speakers. Worth the investment for speaking practice.' },
      { name: 'Speechling', url: 'https://speechling.com', description: 'Record yourself, get feedback from native speakers. Focused on pronunciation.' },
      { name: 'Grammarly', url: 'https://www.grammarly.com', description: 'Writing assistant — useful for checking professional emails and messages.' },
    ],
  },
];

export default function SourcesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <header className="border-b border-white/5 backdrop-blur-xl bg-black/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/app">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <div>
            <p className="font-bold text-base leading-none">Resources & Sources</p>
            <p className="text-white/30 text-xs mt-0.5">Where to go from here</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        <section className="py-8 space-y-3">
          <h1 className="text-2xl font-black">Go deeper</h1>
          <p className="text-white/40 text-sm max-w-lg leading-relaxed">
            The vocabulary, conversations, and exercises in this app were curated by AI — modeled after real tech workplace communication. These are the external resources we recommend for going further.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-xs">
            <span>All links open in a new tab</span>
          </div>
        </section>

        <div className="space-y-10">
          {CATEGORIES.map((cat, ci) => (
            <motion.section
              key={cat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.08 }}
            >
              <div className="mb-4">
                <h2 className="text-base font-bold text-white">{cat.title}</h2>
                {cat.note && <p className="text-white/30 text-xs mt-0.5">{cat.note}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cat.items.map((item, i) => (
                  <motion.a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ci * 0.08 + i * 0.04 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.14] transition-all group cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-white">{item.name}</p>
                        <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
                      </div>
                      <p className="text-white/40 text-xs mt-1 leading-relaxed">{item.description}</p>
                      <p className="text-white/20 text-[10px] mt-1.5 font-mono truncate">{item.url.replace('https://', '')}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        <section className="mt-12 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
          <p className="text-white/50 text-sm font-semibold mb-2">About the content in this app</p>
          <p className="text-white/30 text-xs leading-relaxed">
            Conversations, vocabulary, shadowing sentences, and challenges were generated and curated by AI based on real patterns in tech workplace communication. The slang, idioms, and scenarios reflect actual usage from developer communities, tech interviews, and professional settings. When in doubt about a phrase, cross-check with the resources above.
          </p>
        </section>
      </main>
    </div>
  );
}
