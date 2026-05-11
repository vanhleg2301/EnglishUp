import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Progress } from '@/models/Progress';

export async function GET() {
  try {
    await connectDB();
    let progress = await Progress.findOne({ userId: 'local' });
    if (!progress) {
      progress = await Progress.create({ userId: 'local', totalXP: 0, streak: 0, completedDays: [] });
    }
    return NextResponse.json(progress);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { day, score, xpEarned } = body;

    let progress = await Progress.findOne({ userId: 'local' });
    if (!progress) {
      progress = await Progress.create({ userId: 'local', totalXP: 0, streak: 0, completedDays: [] });
    }

    const existingIndex = progress.completedDays.findIndex((d: { day: number }) => d.day === day);
    const dayEntry = { day, completed: true, score, xpEarned, completedAt: new Date().toISOString() };

    if (existingIndex >= 0) {
      progress.completedDays[existingIndex] = dayEntry;
    } else {
      progress.completedDays.push(dayEntry);
      progress.totalXP += xpEarned;
    }

    const today = new Date().toDateString();
    if (progress.lastLoginDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (progress.lastLoginDate === yesterday.toDateString()) {
        progress.streak += 1;
      } else {
        progress.streak = 1;
      }
      progress.lastLoginDate = today;
    }

    await progress.save();
    return NextResponse.json(progress);
  } catch {
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}
