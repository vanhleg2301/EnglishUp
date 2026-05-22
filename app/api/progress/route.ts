import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Progress } from '@/models/Progress';
import { getAuthUser } from '@/lib/auth';

const EMPTY_PROGRESS = { totalXP: 0, streak: 0, completedDays: [] };

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const progress = await Progress.findOne({ userId: authUser.userId });
    if (!progress) return NextResponse.json(EMPTY_PROGRESS);
    return NextResponse.json(progress);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { day, score, xpEarned } = await req.json();

    let progress = await Progress.findOne({ userId: authUser.userId });
    if (!progress) {
      progress = await Progress.create({ userId: authUser.userId, totalXP: 0, streak: 0, completedDays: [] });
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

export async function DELETE() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    await Progress.deleteOne({ userId: authUser.userId });
    return NextResponse.json(EMPTY_PROGRESS);
  } catch {
    return NextResponse.json({ error: 'Failed to reset progress' }, { status: 500 });
  }
}
