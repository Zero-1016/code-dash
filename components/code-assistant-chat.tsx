"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CodeAssistantChatProps {
  code: string;
  problemTitle: string;
  problemDescription: string;
  isAiGenerating?: boolean;
  pendingReview?: string | null;
  strategicHint?: string | null;
  elapsedMinutes?: number;
}

export function CodeAssistantChat({
  code,
  problemTitle,
  problemDescription,
  isAiGenerating = false,
  pendingReview = null,
  strategicHint = null,
  elapsedMinutes = 0,
}: CodeAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showStrategicHint, setShowStrategicHint] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-add AI review when it arrives
  useEffect(() => {
    if (pendingReview && pendingReview.trim()) {
      setMessages((prev) => {
        // Check if this review is already in messages
        const isDuplicate = prev.some((msg) => msg.content === pendingReview);
        if (isDuplicate) return prev;

        const aiMessage: Message = {
          role: "assistant",
          content: pendingReview,
        };
        return [...prev, aiMessage];
      });
    }
  }, [pendingReview]);

  // Auto-show strategic hint when it arrives
  useEffect(() => {
    if (strategicHint && strategicHint.trim()) {
      setShowStrategicHint(true);
    }
  }, [strategicHint]);

  // Format markdown-style text for display
  const formatMessage = (text: string) => {
    // Simple markdown formatting
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Bold text **text**
      let formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // Code blocks `code`
      formatted = formatted.replace(
        /`([^`]+)`/g,
        '<code class="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">$1</code>'
      );

      if (line.startsWith("# ")) {
        return (
          <div
            key={i}
            className="text-base font-bold mt-3 mb-1"
            dangerouslySetInnerHTML={{ __html: formatted.slice(2) }}
          />
        );
      } else if (line.startsWith("## ")) {
        return (
          <div
            key={i}
            className="text-sm font-bold mt-2 mb-1"
            dangerouslySetInnerHTML={{ __html: formatted.slice(3) }}
          />
        );
      } else if (line.startsWith("- ")) {
        return (
          <div
            key={i}
            className="ml-4 mb-1"
            dangerouslySetInnerHTML={{ __html: "• " + formatted.slice(2) }}
          />
        );
      } else if (line.trim() === "") {
        return <div key={i} className="h-2" />;
      } else {
        return <div key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
      }
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          code,
          problemTitle,
          problemDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "Give me a hint",
    "Is my approach correct?",
    "Explain the problem",
    "Review my code",
    "What's the optimal approach?",
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-full max-h-full flex-col bg-background overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        {/* Strategic Hint Card */}
        <AnimatePresence>
          {showStrategicHint && strategicHint && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="mb-6"
            >
              <div className="relative rounded-[24px] border-2 border-[#3182F6] bg-gradient-to-br from-[#3182F6]/10 via-[#3182F6]/5 to-transparent p-6 shadow-xl">
                {/* Gift icon/badge */}
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute -top-3 -right-3 flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#3182F6] shadow-lg"
                >
                  <span className="text-2xl">💡</span>
                </motion.div>

                <div className="mb-3">
                  <h3 className="text-sm font-bold text-[#3182F6]">
                    Strategic Hint Unlocked! ({elapsedMinutes} min)
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Your AI Mentor has a key insight to help you break through
                  </p>
                </div>

                <div className="rounded-[16px] bg-background/80 p-4 text-sm">
                  <div className="space-y-1">
                    {formatMessage(strategicHint)}
                  </div>
                </div>

                <button
                  onClick={() => setShowStrategicHint(false)}
                  className="mt-4 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.length === 0 && !showStrategicHint ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <MessageCircle className="h-16 w-16 text-muted-foreground/50" />
            <div className="text-center">
              <p className="text-base font-medium text-muted-foreground">
                Your AI Mentor is here!
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Get hints, explanations, or code review
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="rounded-[16px] bg-[#3182F6]/10 px-4 py-2 text-xs font-semibold text-[#3182F6] transition-all hover:bg-[#3182F6] hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-[20px] px-5 py-4 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-[#3182F6] text-white shadow-sm"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="space-y-1">
                      {formatMessage(message.content)}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            {(isLoading || isAiGenerating) && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3 rounded-[20px] bg-[#3182F6]/10 px-5 py-3 text-sm text-[#3182F6] font-medium">
                  <div className="flex gap-1">
                    <motion.div
                      className="h-2 w-2 rounded-full bg-[#3182F6]"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="h-2 w-2 rounded-full bg-[#3182F6]"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="h-2 w-2 rounded-full bg-[#3182F6]"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <span>AI is analyzing your code...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : null}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-border/60 p-4">
        {messages.length > 0 && (
          <div className="mb-2 flex justify-end">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1 rounded-[12px] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Clear chat
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask for hints, explanations, or code review..."
            rows={2}
            className="flex-1 resize-none rounded-[16px] border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#3182F6] focus:outline-none focus:ring-2 focus:ring-[#3182F6]/20"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[16px] bg-[#3182F6] text-white shadow-lg transition-all hover:bg-[#2870d8] disabled:opacity-50 disabled:hover:bg-[#3182F6]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
