import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'reading_activities.json');

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
    const items = JSON.parse(raw || '[]');
    const found = items.find((i: any) => i.id === params.id);
    if (!found) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json(found);
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

