import { useChat } from "@/context/ChatContext";
import { Button } from "./ui/button";

export default function ChatSidebar() {

  const { chats, deleteChat, createChat, currentChat, setCurrentChat } = useChat();

  return (
    <div>
      {chats.map((chat: any) => (
        <div key={chat.id}>
          <div>{chat.id}</div>
          <Button onClick={() => setCurrentChat(chat)}>Select Chat</Button>
          <Button onClick={() => deleteChat(chat.id)}>Delete Chat</Button>
        </div>
      ))}
      <Button onClick={() => createChat("gpt-4o")}>Create New Chat</Button>
      <div>
        <div>Current Chat: {currentChat?.id}</div>
      </div>
    </div>
  )
}