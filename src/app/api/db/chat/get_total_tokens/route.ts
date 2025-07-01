import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/db/db";

export async function GET(req: NextRequest) {
  const db = await getDB();
  const chat_id = req.nextUrl.searchParams.get("chat_id");

  const { total_tokens } = await db.get(
    `
    SELECT SUM(tokens) as total_tokens
    FROM messages
    WHERE chat_id = ?
      AND id > COALESCE((
      SELECT end_message_id
      FROM summaries
      WHERE chat_id = ?
      ORDER BY end_message_id DESC
      LIMIT 1
    ), 0);
    `,
    chat_id,
    chat_id
  );

  return NextResponse.json(total_tokens, { status: 200 });
}