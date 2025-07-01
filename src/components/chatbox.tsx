import { Textarea } from "./ui/textarea";
import { SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState, FC } from "react";
import { useChat } from "@/context/ChatContext";
import MessageList from "./MessageList";

export default function Chatbox() {
  const [prompt, setPrompt] = useState("");
  const { messages, generateResponse } = useChat();

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      <MessageList messages={messages} />

      <div className="flex-1" />

      {/* Input */}
      <div className="sticky bottom-0 w-full z-10 flex justify-center pb-6 pt-4">
        <div className="flex items-center w-full max-w-3xl rounded-3xl bg-[#2c2c2c] px-6 py-4 gap-4 shadow-lg border border-[#333]">
          <Textarea
            className="flex-1 border-none text-white placeholder:text-gray-400 resize-none focus:ring-0 focus:border-none"
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={1}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              generateResponse({ prompt });
              setPrompt("");
            }}
            className="hover:cursor-pointer m-0"
            disabled={!prompt}
          >
            <SendIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
