import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/db/db";

export async function GET(req: NextRequest) {
  const db = await getDB();
  const { searchParams } = new URL(req.url);
  const chat_id = searchParams.get("chat_id");

  const summaries = await db.all("SELECT * FROM summaries WHERE chat_id = ? ORDER BY end_message_id DESC", [chat_id]);

  return NextResponse.json(summaries, { status: 200 });
}

export async function POST(req: NextRequest) {
  const db = await getDB();
  const { chat_id, end_message_id, summary } = await req.json();

  await db.run("DELETE FROM summaries WHERE chat_id = ?", [chat_id]);

  const result = await db.run("INSERT INTO summaries (chat_id, end_message_id, summary) VALUES (?, ?, ?)", [chat_id, end_message_id, summary]);

  return NextResponse.json(result, { status: 201 });
}