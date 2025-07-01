import { Textarea } from "./ui/textarea";
import { SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState, FC } from "react";
import { useChat } from "@/context/ChatContext";
import MessageList from "./MessageList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export default function Chatbox() {
  const [prompt, setPrompt] = useState("");
  const { messages, generateResponse } = useChat();

  const [model, setModel] = useState("gpt-4o");

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
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini">claude-4-sonnet</SelectItem>
              <SelectItem value="deepseek-chat">deepseek/deepseek-chat-v3-0324:free</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              generateResponse({ prompt, model });
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
