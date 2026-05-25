import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UserDailyChallenge } from '@/models/UserDailyChallenge';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const doc = await UserDailyChallenge.findOne({ userId: authUser.userId });
    return NextResponse.json(doc ?? null);
  } catch (err) {
    console.error('[daily-challenge GET]', err)
    return NextResponse.json({ error: 'Failed to load daily challenge. Please try again.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { streak, lastDate, history } = await req.json();
    await UserDailyChallenge.findOneAndUpdate(
      { userId: authUser.userId },
      { streak, lastDate, history },
      { upsert: true, new: true }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[daily-challenge PUT]', err)
    return NextResponse.json({ error: 'Failed to save daily challenge. Data has been saved offline.' }, { status: 500 });
  }
}
