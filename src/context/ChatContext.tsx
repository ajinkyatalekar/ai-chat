"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Chat {
  id: number;
  title: string | null;
  default_model: string;
  created_at: string;
  updated_at: string;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  fetchChats: () => Promise<void>;
  deleteChat: (id: number) => Promise<void>;
  createChat: (model: string) => Promise<void>;
  setCurrentChat: (chat: Chat | null) => void;
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
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

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
    await fetch('/api/db/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model })
    });
    fetchChats();
  };

  const deleteChat = async (id: number) => {
    await fetch('/api/db/chat', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchChats();
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const value: ChatContextType = {
    chats,
    currentChat,
    fetchChats,
    setCurrentChat,
    deleteChat,
    createChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
