import { AI_CONFIG } from "@/lib/config";
export const getMessagesForResponse = async (chat_id: number | undefined) => {
  if (!chat_id) {
    throw new Error("Chat ID is required");
  }

  const tokens = await getTotalTokens(chat_id);

  if (tokens > AI_CONFIG.CONTEXT_WINDOW) {
    await summarize(chat_id);
  }

  const summaryResponse = await fetch(`/api/db/summary?chat_id=${chat_id}`);

  if (!summaryResponse.ok) {
    throw new Error("Failed to fetch summary");
  }

  const summaries = await summaryResponse.json();
  const latestSummary = summaries[0];

  let messages = [];
  let systemMessage = null;

  if (latestSummary) {
    systemMessage = {
      id: -1,
      chat_id: chat_id,
      role: "system",
      content: `Previous conversation summary: ${latestSummary.summary}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const messagesResponse = await fetch(
      `/api/db/message?chat_id=${chat_id}&start_message_id=${latestSummary.end_message_id}`
    );
    if (!messagesResponse.ok) {
      throw new Error("Failed to fetch messages after summary");
    }
    messages = await messagesResponse.json();
  } else {
    const messagesResponse = await fetch(
      `/api/db/message?chat_id=${chat_id}&start_message_id=${0}`
    );
    if (!messagesResponse.ok) {
      throw new Error("Failed to fetch messages");
    }
    messages = await messagesResponse.json();
  }

  const allMessages = systemMessage ? [systemMessage, ...messages] : messages;

  return allMessages;
};

export const getTotalTokens = async (chat_id: number | undefined) => {
  const response = await fetch(
    `/api/db/chat/get_total_tokens?chat_id=${chat_id}`
  );
  if (!chat_id) {
    throw new Error("Chat ID is required");
  }
  const data = await response.json();
  return data;
};

export const summarize = async (chat_id: number | undefined) => {
  if (!chat_id) {
    throw new Error("Chat ID is required");
  }

  const messagesResponse = await fetch(
    `/api/db/message?chat_id=${chat_id}&start_message_id=${0}`
  );

  if (!messagesResponse.ok) {
    throw new Error("Failed to fetch messages for summarization");
  }

  const messages = await messagesResponse.json();

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

  const summaryResponse = await fetch("/api/get-response", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [...messagesToSummarize, systemMessage],
      model: "GPT-4o",
    }),
  });

  if (!summaryResponse.ok) {
    throw new Error("Failed to generate summary");
  }

  const summaryData = await summaryResponse.json();
  const summary = summaryData.choices[0].message.content;

  const end_message_id = Math.max(
    ...messagesToSummarize.map((msg: any) => msg.id)
  );

  const storeSummaryResponse = await fetch("/api/db/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id,
      end_message_id,
      summary,
    }),
  });

  if (!storeSummaryResponse.ok) {
    throw new Error("Failed to store summary");
  }
};

// export const getMessagesForResponse = async (chat_id: number | undefined) => {
//     const response = await fetch(`/api/db/message?chat_id=${chat_id}&start_message_id=${0}`);
//     if (!chat_id) {
//         throw new Error("Chat ID is required");
//     }
//     if (!response.ok) {
//         throw new Error("Failed to fetch messages");
//     }
//     const data = await response.json();
//     return data;
// }
