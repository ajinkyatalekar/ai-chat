import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/db/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chat_id");
  const start_message_id = searchParams.get("start_message_id");

  if (!chatId || !start_message_id) {
    throw new Error("Chat ID and start message ID are required");
  }

  const messages = await get_messages(Number(chatId), Number(start_message_id));
  return NextResponse.json(messages, { status: 200 });
}

export async function POST(req: NextRequest) {
  const db = await getDB();
  const body = await req.json();
  const { chat_id, role, content } = body;

  const message = await db.run("INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)", chat_id, role, content);
  return NextResponse.json(message, { status: 201 });
}

async function get_messages(chat_id: number, start_message_id: number | undefined) {
  if (!start_message_id) {
    start_message_id = 0;
  }

  const db = await getDB();
  const messages = await db.all("SELECT * FROM messages WHERE chat_id = ? AND id > ?", [chat_id, start_message_id]);
  return messages;
}