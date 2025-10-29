import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import db from '@/db/drizzle';
import { userProgress } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { xpReward = 10 } = body;

    // Get current user progress
    const progress = await db.query.userProgress.findFirst({
      where: eq(userProgress.userId, userId),
    });

    if (!progress) {
      return NextResponse.json({ error: 'User progress not found' }, { status: 404 });
    }

    // Update points
    await db.update(userProgress)
      .set({
        points: progress.points + xpReward,
      })
      .where(eq(userProgress.userId, userId));

    return NextResponse.json({ success: true, xpAwarded: xpReward });
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

