import { Message } from "@/app/types/message";
import { getDB } from "@/db/db";
import { AI_CONFIG } from "@/lib/config";

export async function POST(req: Request) {
  const { chat_id, prompt, model } = await req.json();

  if (!chat_id || !prompt || !model) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = await getDB();
  
  await db.run("INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)", chat_id, "user", prompt);

  const messages = await getCompactMessages(chat_id, model);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
    }),
  });

  const data = await response.json();

  await db.run("INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)", chat_id, "assistant", data.choices[0].message.content);

  return Response.json(data);
}

async function getCompactMessages(chat_id: number | undefined, model: string) {
  const db = await getDB();
  const messages = await db.all("SELECT * FROM messages WHERE chat_id = ? ORDER BY id ASC", chat_id);

  const tokens = await getTotalTokens(chat_id);
  if (tokens > AI_CONFIG.SUMMARIZATION_THRESHOLD) {
    await summarize(chat_id, model);
  }

  const summary = await db.get("SELECT * FROM summaries WHERE chat_id = ?", chat_id);

  let messagesToUse = messages;
  if (summary) {
    const systemMessage = {
      id: -1,
      chat_id,
      role: "system",
      content: `Previous conversation summary: ${summary.summary}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  
    const subsequentMessages = messages.filter(
      (msg: Message) => msg.id > summary.end_message_id
    );

    messagesToUse = [systemMessage, ...subsequentMessages];
  }

  return messagesToUse;
}

async function getTotalTokens(chat_id: number | undefined) {
  const db = await getDB();
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
  return total_tokens;
};

async function summarize(chat_id: number | undefined, model: string) {
  const db = await getDB();
  const messages = await db.all("SELECT * FROM messages WHERE chat_id = ?", chat_id);

  if (messages.length === 0) {
    return;
  }

  const messagesToSummarize = messages.slice(0, -4);

  if (messagesToSummarize.length === 0) {
    return;
  }

  const systemMessage = {
    role: "system",
    content:
      "You are a summarization assistant. Your task is to create a concise summary of the conversation history provided. Do not answer any questions or provide new information - only summarize what has been discussed so far. Focus on capturing the key points, main topics, and important context from the conversation. Make sure the summary is long enough to be useful, but not too long.",
  };

  const summaryResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: [...messagesToSummarize, systemMessage],
    }),
  });

  if (!summaryResponse.ok) {
    throw new Error("Failed to generate summary");
  }

  const summaryData = await summaryResponse.json();
  const summary = summaryData.choices[0].message.content;

  const end_message_id = Math.max(
    ...messagesToSummarize.map((msg: Message) => msg.id)
  );

  await db.run("DELETE FROM summaries WHERE chat_id = ?", chat_id);
  await db.run("INSERT INTO summaries (chat_id, end_message_id, summary) VALUES (?, ?, ?)", chat_id, end_message_id, summary);

  return summary;
} 