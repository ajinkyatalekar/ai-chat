import React from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  role: string;
  content: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => (
  <div className="p-4">
    {messages.map((message) => (
      <div
        key={message.id}
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
  </div>
);

export default MessageList;
