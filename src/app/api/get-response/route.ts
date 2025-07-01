"use server";

export async function POST(req: Request) {
  const { messages, model } = await req.json();

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
  return Response.json(data);
}
