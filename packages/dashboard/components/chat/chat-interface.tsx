"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Send, Bot, User } from "lucide-react";

// ============================================================
// OPENCLAW_HOOK: Chat WebSocket connection
// Integration: WebSocket ${NEXT_PUBLIC_OPENCLAW_URL}/ws/chat
// Current behavior: Returns mock AI response after 1s delay
// ============================================================

const mockResponses: Record<string, string> = {
  revenue:
    "Your March 2026 revenue is tracking at $28,450 across all 5 properties. That's a 12% increase over February. Waikiki Beachfront Condo is your top performer with $4,850 this month. The Kailua Beach House has the highest per-booking revenue at $3,325 average.",
  booking:
    "I found 2 booking gaps in the next 2 weeks:\n\n1. **Waikiki Beachfront Condo**: March 21-24 (3 nights open)\n2. **Manoa Valley Townhouse**: March 18-22 (4 nights open)\n\nI can lower rates by 10% for these periods to attract last-minute bookings. Want me to go ahead?",
  maintenance:
    "There's 1 active maintenance issue:\n\n**Manoa Valley Townhouse** - AC making noise. Island HVAC is scheduled for inspection on March 15. Estimated cost: $150.\n\nAll other properties are in good condition. The Kailua Beach House kitchen faucet repair was completed on March 10.",
  pricing:
    "Based on my analysis, I have 3 pricing recommendations:\n\n1. **Waikiki Beachfront Condo**: Increase to $380/nt for spring break (Mar 28 - Apr 5)\n2. **Kailua Beach House**: Increase to $520/nt for Easter weekend\n3. **Manoa Valley Townhouse**: Decrease to $195/nt for low-demand week (Apr 7-11)\n\nYou can review and approve these in the Finances tab.",
  default:
    "I'm PropBot, your AI property manager. I'm currently managing 5 vacation rentals in Honolulu with 87% occupancy. I handle bookings, cleaning schedules, supply ordering, maintenance, and pricing optimization. How can I help you today?",
};

function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("revenue") || lower.includes("perform") || lower.includes("summary")) return mockResponses.revenue;
  if (lower.includes("booking") || lower.includes("gap") || lower.includes("unbooked")) return mockResponses.booking;
  if (lower.includes("maintenance") || lower.includes("repair") || lower.includes("issue")) return mockResponses.maintenance;
  if (lower.includes("pricing") || lower.includes("rate") || lower.includes("adjust")) return mockResponses.pricing;
  return mockResponses.default;
}

interface ChatInterfaceProps {
  initialPrompt?: string;
}

export function ChatInterface({ initialPrompt }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedInitialRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialPrompt && !processedInitialRef.current) {
      processedInitialRef.current = true;
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Mock AI response with 1s delay
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: getMockResponse(messageText),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-1 space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted">
            <Bot className="h-12 w-12 mb-3 text-muted-light" />
            <p className="text-lg font-medium text-gray-900">PropBot</p>
            <p className="text-sm">Ask me anything about your properties</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            {msg.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-accent text-white"
                  : "bg-gray-100 text-gray-900"
              )}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask PropBot about your properties..."
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            disabled={isTyping}
          />
          <Button type="submit" disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
