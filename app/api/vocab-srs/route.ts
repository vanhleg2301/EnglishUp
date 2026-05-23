import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { VocabSRS } from '@/models/VocabSRS';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const doc = await VocabSRS.findOne({ userId: authUser.userId });
    return NextResponse.json({ cards: doc?.cards ?? [] });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch vocab SRS' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { cards } = await req.json();
    await VocabSRS.findOneAndUpdate(
      { userId: authUser.userId },
      { cards },
      { upsert: true, new: true }
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save vocab SRS' }, { status: 500 });
  }
}
