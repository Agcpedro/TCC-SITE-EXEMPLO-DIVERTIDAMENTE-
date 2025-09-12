import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'teacher_activities.json');

export async function GET() {
  try {
    const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
    const items = JSON.parse(raw || '[]');
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
    const items = JSON.parse(raw || '[]');
    const id = Date.now().toString();
    const item = { id, ...body };
    items.unshift(item);
    await fs.promises.writeFile(DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
