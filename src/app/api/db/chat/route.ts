import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/db/db';

export async function GET(req: NextRequest) {
  const db = await getDB();
  const rows = await db.all('SELECT * FROM chats ORDER BY created_at DESC');

  return NextResponse.json(rows, { status: 200 });
}

export async function POST(req: NextRequest) {
  const db = await getDB();

  const result = await db.run(
    'INSERT INTO chats DEFAULT VALUES'
  );

  const id = result.lastID;

  const newChat = await db.get('SELECT * FROM chats WHERE id = ?', id);

  return NextResponse.json(newChat, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const db = await getDB();
  const body = await req.json();
  const { id } = body;

  try {
    await db.run('DELETE FROM chats WHERE id = ?', id);
    return NextResponse.json({ message: 'Chat deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
  }
}
