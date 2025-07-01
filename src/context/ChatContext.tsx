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
import { getMessagesForResponse } from "@/app/hooks/chat";

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  fetchChats: () => Promise<void>;
  deleteChat: (id: number) => Promise<void>;
  createChat: (model: string) => Promise<void>;
  setCurrentChat: (chat: Chat | null) => Promise<void>;

  messages: Message[];
  fetchMessages: () => Promise<void>;
  generateResponse: ({prompt}: {prompt: string}) => Promise<void>;
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

  const createChat = async (model: string) => {
    const response = await fetch("/api/db/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model }),
    });
    if (!response.ok) {
      throw new Error("Failed to create chat");
    }

    fetchChats();

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

  const fetchMessages = async () => {
    if (!currentChat) {
      setMessages([]);
      return;
    }

    const response = await fetch(`/api/db/message?chat_id=${currentChat.id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }
    const data = await response.json();
    setMessages(data);
  };

  const generateResponse = async ({prompt}: {prompt: string}) => {
    const response_user = await fetch("/api/db/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: currentChat?.id, role: "user", content: prompt }),
    });
    if (!response_user.ok) {
      throw new Error("Failed to send message");
    }

    fetchMessages();

    const messages = await getMessagesForResponse(currentChat?.id);
    const response = await fetch("api/get-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages }),
    });
    const data = await response.json();
    console.log(data);

    const response_assistant = await fetch("/api/db/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: currentChat?.id, role: "assistant", content: data.choices[0].message.content }),
    });

    if (!response_assistant.ok) {
      throw new Error("Failed to send message");
    }

    fetchMessages();
  }


  const sendMessage = async ({ role, content }: { role: string; content: string }) => {
    const response_user = await fetch("/api/db/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: currentChat?.id, role, content }),
    });
    if (!response_user.ok) {
      throw new Error("Failed to send message");
    }
        
    fetchMessages();

    const resp = await fetch("api/get-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages }),
    });

    const data = await resp.json();

    console.log(data);

    const response_assistant = await fetch("/api/db/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: currentChat?.id, role: "assistant", content: data.choices[0].message.content }),
    });
    if (!response_assistant.ok) {
      throw new Error("Failed to send message");
    }

    fetchMessages();
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
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
