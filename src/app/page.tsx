"use client";

import ChatSidebar from "@/components/chat-sidebar";

export default function Home() {

  return (
    <div>
      <ChatSidebar />
    </div>
  )

  // return (
  //   <div className="min-h-screen bg-[#232323] flex flex-col">

  //     <div className="p-4">
  //       <ReactMarkdown>{response}</ReactMarkdown>
  //     </div>

  //     <div className="flex-1" />

  //     {/* Input */}
  //     <div className="sticky bottom-0 w-full z-10 flex justify-center bg-[#232323] pb-6 pt-4">
  //       <div className="flex items-center w-full max-w-3xl rounded-3xl bg-[#2c2c2c] px-6 py-4 gap-4 shadow-lg border border-[#333]">
  //         <Textarea
  //           className="flex-1 border-none text-white placeholder:text-gray-400 resize-none focus:ring-0 focus:border-none"
  //           placeholder="Ask anything"
  //           value={prompt}
  //           onChange={(e) => setPrompt(e.target.value)}
  //           rows={1}
  //         />
  //         <Button variant="ghost" size="icon" onClick={() => getResponse([{ role: "user", content: prompt }])} className="hover:cursor-pointer m-0" disabled={!prompt}>
  //           <SendIcon className="w-4 h-4" />
  //         </Button>
  //       </div>
  //     </div>
  //   </div>
  // );
}
