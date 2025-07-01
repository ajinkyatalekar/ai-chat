"use client";

import ChatSidebar from "@/components/chat-sidebar";
import Chatbox from "@/components/chatbox";

export default function Home() {

  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <main className="flex-1 overflow-auto">
        <div>
          <Chatbox/>
        </div>
      </main>
    </div>
  )
}
