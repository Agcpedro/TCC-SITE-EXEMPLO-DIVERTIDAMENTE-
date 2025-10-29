import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getUserProgress } from '@/db/queries';

const DATA_PATH = path.join(process.cwd(), 'data', 'teacher_quests.json');

export async function GET() {
  try {
    const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(raw || '[]'));
  } catch (err) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
    const items = JSON.parse(raw || '[]');

    // Determine the subject via the user's active course
    const user = await getUserProgress();
    const courseId = user?.activeCourseId;
    if (!courseId) {
      return NextResponse.json({ error: 'active_course_required' }, { status: 400 });
    }

    const id = Date.now().toString();
    const item = { id, courseId, value: body.value };
    items.unshift(item);
    await fs.promises.writeFile(DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

