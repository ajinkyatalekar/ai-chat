import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/db/db";

export async function GET(req: NextRequest) {
  const db = await getDB();
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chat_id");

  const messages = await db.all("SELECT * FROM messages WHERE chat_id = ?", chatId);
  return NextResponse.json(messages, { status: 200 });
}

export async function POST(req: NextRequest) {
  const db = await getDB();
  const body = await req.json();
  const { chat_id, role, content } = body;

  const message = await db.run("INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)", chat_id, role, content);
  return NextResponse.json(message, { status: 201 });
}