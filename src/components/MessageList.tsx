import { useChat } from "@/context/ChatContext";
import React from "react";
import ReactMarkdown from "react-markdown";

interface MessageListProps {
  loadingResponse: boolean;
}

const MessageList: React.FC<MessageListProps> = ({loadingResponse }) => {
  const { messages } = useChat();

  return (
  <div className="p-4">
    {messages.map((message, idx) => (
      <div
        key={idx}
        className={
          message.role === "user"
            ? "text-right text-blue-300 mb-2"
            : message.role === "assistant"
            ? "text-left text-green-300 mb-2"
            : "text-left text-gray-300 mb-2"
        }
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    ))}
    {loadingResponse && (
      <div className="text-left text-gray-300 mb-2">
        <ReactMarkdown>Thinking...</ReactMarkdown>
      </div>
    )}
  </div>
)};

export default MessageList;
