import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'teacher_quests.json');

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
    const items = JSON.parse(raw || '[]');
    const idx = items.findIndex((i: any) => i.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'not found' }, { status: 404 });
    
    items[idx] = {
      ...items[idx],
      value: body.value,
    };
    
    await fs.promises.writeFile(DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
    return NextResponse.json(items[idx]);
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
    const items = JSON.parse(raw || '[]');
    const filtered = items.filter((i: any) => i.id !== params.id);
    if (filtered.length === items.length) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }
    await fs.promises.writeFile(DATA_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

