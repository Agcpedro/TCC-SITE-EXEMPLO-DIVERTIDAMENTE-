import { NextResponse } from 'next/server';
import { awardTeacherActivityPoints } from '@/actions/teacher-activity-progress';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const points = Number(body.points || 0);
    await awardTeacherActivityPoints(points);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
