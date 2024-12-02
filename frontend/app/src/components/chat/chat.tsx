import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator";
import { CornerDownLeft, UserRound, Bot } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import "katex/dist/katex.min.css"; // Required for LaTeX rendering styles

//import apiUrl from '../../config'; // Path to your API config

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  messages: Message[];
  onSendMessage: (message: Message) => void;
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  onSendMessage,
  userInput,
  setUserInput,
}) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      const newMessage: Message = { role: "user", content: userInput };
      setIsLoading(true);
      try {
        setUserInput("");      // Clear the input field
        await onSendMessage(newMessage);  // Wait for the AI to respond
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);  // Re-enable input after response
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isLoading) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e);
      }
    };
  }


  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={darcula}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  const preprocessContent = (content: string) => {
    // Wrap content between \[...\] with $$ for block math
    let processedContent = content.replace(/\\\[([^\\]*)\\\]/g, '$$$1$$');

    // Wrap content between \(...\) with $ for inline math
    processedContent = processedContent.replace(/\\\(([^\\]*)\\\)/g, '$$ $1 $$');

    return processedContent;
  };

  // Block Cut, Copy and Paste operations on the chat
  useEffect(() => {
    const blockCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // Add event listeners to block copy, cut, and paste
    document.addEventListener('copy', blockCopyPaste);
    document.addEventListener('cut', blockCopyPaste);
    document.addEventListener('paste', blockCopyPaste);

    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener('copy', blockCopyPaste);
      document.removeEventListener('cut', blockCopyPaste);
      document.removeEventListener('paste', blockCopyPaste);
    };
  }, []);

  // Scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-container relative">
      {/* Chat Messages */}
      <div className="chat-messages-container">
        {messages
          .filter((message) => message.content.trim() !== "") // Filter out empty messages
          .map((message, index) => (
            <>
              <ScrollArea>
                <div>
                  <div key={index} className={`flex ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <Avatar className="self-start mt-7">{message.role === "user" ? <UserRound /> : <Bot />}</Avatar>
                    <div
                      className={`flex-grow p-9 rounded-lg ${message.role === "user" ? "text-right" : "text-left"}`}
                      style={{ maxWidth: "100%" }}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                        components={components}
                        className={`${message.role === "user" ? "chat-message" : "prose max-w-full"}`}
                      >
                        {preprocessContent(message.content)}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <Separator />
                </div>
              </ScrollArea>
            </>
          ))}

        {/* Loading dots */}
        {isLoading && (
          <div className="flex items-center justify-center mt-4">
            <span className="text-gray-500"></span>
            <div className="loading-dots ml-2">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        )}

        {/* Dummy div for scroll behavior */}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-none border-t p-3 bg-card sticky bottom-0">
        <form className="flex gap-4" onSubmit={handleSendMessage}>
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Chiedi una domanda o invia la tua risposta"
            className="flex-grow min-h-[3rem] resize-none border-0 p-1 shadow-none bg-card"
          />
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm" className="flex items-center">
                  <Paperclip className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach File</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm" className="flex items-center">
                  <Mic className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Use Microphone</TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" size="sm" className="flex items-center">
                  Invia  <CornerDownLeft className="ml-2 h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>Invia il messaggio</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
      </div>
    </div>
  );
};

export default Chat;
