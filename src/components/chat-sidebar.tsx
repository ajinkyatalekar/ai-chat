import { useChat } from "@/context/ChatContext";
import { Button } from "./ui/button";
import { Plus, Search } from "lucide-react";
import { Chat } from "@/app/types/chat";

export default function ChatSidebar() {
  const { chats, deleteChat, createChat, currentChat, setCurrentChat } =
    useChat();

  return (
    <aside className="bg-[#111111] text-white w-60 h-screen flex flex-col p-3">
      <span className="text-lg font-semibold mb-3">AI Chat</span>

      {/* Actions */}
      <div className="flex flex-col gap-2 mb-6">
        <Button
          className="justify-start gap-2 bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
          variant="secondary"
          onClick={() => createChat("gpt-4o")}
        >
          <Plus /> New chat
        </Button>
        <Button
          className="justify-start gap-2 bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
          variant="secondary"
          disabled
        >
          <Search /> Search chats
        </Button>
      </div>

      {/* Chats List */}
      <div className="flex-1">
        <div className="text-neutral-400 text-xs mb-2">Chats</div>
        <div className="flex flex-col gap-1">
          {chats.map((chat: Chat) => (
            <Button
              key={chat.id}
              onClick={() => setCurrentChat(chat)}
              className={`hover:bg-neutral-800 text-neutral-300 flex justify-between items-center cursor-pointer
                ${
                  currentChat?.id === chat.id ? "bg-neutral-800 text-white" : ""
                }`}
              variant={"ghost"}
            >
              <span className="truncate">
                {chat.title || "Chat " + chat.id}
              </span>
              <a
                className="text-neutral-400 hover:text-red-500 p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
              >
                ×
              </a>
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
}
