'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutGrid, Users, BookOpen, FileText, Shield } from 'lucide-react';
import Logo from './Logo';

const NAV = [
  { label: 'Overview', href: '/admin', icon: LayoutGrid, exact: true },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Lessons', href: '/admin/lessons', icon: BookOpen },
  { label: 'Audit Log', href: '/admin/audit', icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#07070f] text-white flex">
      <aside className="hidden lg:flex flex-col w-[220px] border-r border-white/[0.06] bg-[#08080e] fixed top-0 left-0 h-full z-20">
        <div className="px-5 py-4 border-b border-white/[0.05]">
          <Logo href="/app" size="sm" />
          <div className="flex items-center gap-1.5 mt-1.5">
            <Shield className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] text-amber-400/70 font-bold uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm border ${
                  active
                    ? 'bg-violet-500/15 border-violet-500/25 text-white'
                    : 'border-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                }`}>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-violet-400' : 'text-white/25'}`} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-white/[0.05]">
          <Link href="/app">
            <div className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.04]">
              <LayoutGrid className="w-3.5 h-3.5" />
              Back to App
            </div>
          </Link>
        </div>
      </aside>
      <main className="flex-1 lg:ml-[220px] min-h-screen">{children}</main>
    </div>
  );
}
