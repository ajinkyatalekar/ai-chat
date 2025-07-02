"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { Chat } from "@/app/types/chat";
import { Message } from "@/app/types/message";

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  fetchChats: () => Promise<void>;
  deleteChat: (id: number) => Promise<void>;
  createChat: () => Promise<void>;
  setCurrentChat: (chat: Chat | null) => Promise<void>;

  messages: Message[];
  fetchMessages: () => Promise<void>;
  generateResponse: ({
    prompt,
    model,
  }: {
    prompt: string;
    model: string;
  }) => Promise<void>;

  loadingResponse: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [loadingResponse, setLoadingResponse] = useState(false);

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/db/chat");
      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }
      const data = await response.json();
      setChats(data);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  };

  const createChat = async () => {
    const response = await fetch("/api/db/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error("Failed to create chat");
    }

    await fetchChats();

    const newChat = await response.json();
    setCurrentChat(newChat);
    console.log(newChat);
  };

  const deleteChat = async (id: number) => {
    await fetch("/api/db/chat", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchChats();
    setCurrentChat(null);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [currentChat]);

  const setCurrentChat = async (chat: Chat | null) => {
    setChat(chat);
  };

  const fetchMessages = async (chat_id: number | null = null) => {
    console.log("fetchMessages", currentChat);
    if (!chat_id) {
      chat_id = currentChat?.id || 0;
    }

    if (!chat_id) {
      setMessages([]);
      return;
    }

    const response = await fetch(
      `/api/db/message?chat_id=${chat_id}&start_message_id=${0}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }
    const data = await response.json();
    setMessages(data);
  };

  const generateResponse = async ({
    prompt,
    model,
  }: {
    prompt: string;
    model: string;
  }) => {
    setLoadingResponse(true);

    let chatToUse = currentChat;    

    if (!chatToUse) {
      const response = await fetch("/api/db/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error("Failed to create chat");
      }
      const newChat = await response.json();
      setCurrentChat(newChat);
      chatToUse = newChat;

      await fetchChats();
    }

    setMessages([...messages, {
      id: -1,
      chat_id: chatToUse?.id || 0,
      role: "user",
      content: prompt,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }]);

    const response = await fetch("/api/generate-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatToUse?.id, prompt, model }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate response");
    }
    await fetchMessages(chatToUse?.id);

    setLoadingResponse(false);
  };

  const value: ChatContextType = {
    chats,
    currentChat,
    fetchChats,
    setCurrentChat,
    deleteChat,
    createChat,
    messages,
    fetchMessages,
    generateResponse,
    loadingResponse,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
