'use client';

import { useState } from 'react';
import { Menu, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface AppShellProps {
  children: React.ReactNode;
}

const PAGE_LABELS: Record<string, string> = {
  '/app': 'EnglishUp',
  '/daily-challenge': 'Daily Challenge',
  '/shadowing': 'Shadowing',
  '/phrases': 'Phrases & Chunks',
  '/conversation': 'Conversations',
  '/alphabet': 'IPA Phonetics',
  '/ai-chat': 'AI Chat',
  '/profile': 'Profile',
  '/pricing': 'Pricing',
};

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const pageLabel =
    Object.entries(PAGE_LABELS).find(([path]) =>
      pathname === path || (path !== '/app' && pathname.startsWith(path))
    )?.[1] ?? 'EnglishUp';

  return (
    <div className="min-h-screen bg-[#07070f] text-white flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-[240px] min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-[#07070f]/95 backdrop-blur-xl border-b border-white/[0.06]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-white/[0.07] transition-colors text-white/40 hover:text-white/80 flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-white/80 flex-1 min-w-0 truncate">{pageLabel}</span>
          {user?.role === 'admin' && (
            <Link href="/admin" className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Shield className="w-4 h-4 text-amber-400" />
            </Link>
          )}
        </div>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
