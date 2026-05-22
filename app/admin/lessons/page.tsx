'use client';

import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { lessons } from '@/lib/lessonData';
import AdminLayout from '@/components/AdminLayout';

export default function AdminLessonsPage() {
  const router = useRouter();

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-400" />
              Lessons
            </h1>
            <p className="text-white/40 text-sm mt-0.5">{lessons.length} lessons — read only</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson, i) => (
              <motion.div
                key={lesson.day}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => router.push(`/admin/lessons/${lesson.day}`)}
                className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group cursor-pointer"
              >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${lesson.gradient[0]}, ${lesson.gradient[1]})` }}
                      >
                        {lesson.day}
                      </div>
                      <span className="text-lg">{lesson.emoji}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                  </div>
                  <p className="font-bold text-white/80 text-sm leading-tight mb-1">{lesson.title}</p>
                  <p className="text-white/30 text-xs mb-3">{lesson.subtitle}</p>
                  <div className="flex gap-3 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60" />
                      {lesson.vocabulary.length} vocab
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
                      {lesson.exercises.length} exercises
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                      {lesson.xpReward} XP
                    </span>
                  </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
