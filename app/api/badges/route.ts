import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UserBadges } from '@/models/UserBadges';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const doc = await UserBadges.findOne({ userId: authUser.userId });
    return NextResponse.json(doc ?? null);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const data = await req.json();
    const { earned, consecutivePronScores, completedB2Ids, conversationOpened, totalVocabReviewed, sgSprintCompleted } = data;
    await UserBadges.findOneAndUpdate(
      { userId: authUser.userId },
      { earned, consecutivePronScores, completedB2Ids, conversationOpened, totalVocabReviewed, sgSprintCompleted },
      { upsert: true, new: true }
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save badges' }, { status: 500 });
  }
}
