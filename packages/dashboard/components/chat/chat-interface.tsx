"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Send, Bot, User } from "lucide-react";

// ============================================================
// OPENCLAW_HOOK: Chat WebSocket connection
// Integration: WebSocket ${NEXT_PUBLIC_OPENCLAW_URL}/ws/chat
// Fallback: POST ${NEXT_PUBLIC_API_URL}/chat
// ============================================================

interface ChatInterfaceProps {
  initialPrompt?: string;
}

export function ChatInterface({ initialPrompt }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedInitialRef = useRef(false);
  const wsRef = useRef<WebSocket | null>(null);
  const wsReadyRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Attempt WebSocket connection to OpenClaw
  useEffect(() => {
    const openclawUrl = process.env.NEXT_PUBLIC_OPENCLAW_URL;
    if (!openclawUrl) return;

    const wsUrl = openclawUrl.replace(/^http/, "ws") + "/ws/chat";

    const connect = () => {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          wsReadyRef.current = true;
          console.log("[Chat] Connected to OpenClaw");
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data as string);
            // Handle OpenClaw streaming or full response
            const content: string = data.content ?? data.message ?? data.text ?? String(data);
            if (!content) return;
            setMessages((prev) => [...prev, {
              id: `msg-${Date.now()}-ai`,
              role: "assistant",
              content,
              timestamp: new Date().toISOString(),
            }]);
            setIsTyping(false);
          } catch {
            // Non-JSON frame — ignore
          }
        };

        ws.onclose = () => {
          wsReadyRef.current = false;
          wsRef.current = null;
        };

        ws.onerror = () => {
          wsReadyRef.current = false;
          ws.close();
        };
      } catch {
        wsReadyRef.current = false;
      }
    };

    connect();

    return () => {
      wsRef.current?.close();
      wsReadyRef.current = false;
    };
  }, []);

  const sendViaPost = useCallback(async (messageText: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    try {
      const res = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json() as { content?: string; message?: string };
      const content = data.content ?? data.message ?? "Sorry, I couldn't get a response.";
      setMessages((prev) => [...prev, {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content,
        timestamp: new Date().toISOString(),
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: "I'm PropBot. OpenClaw isn't reachable right now, but I'm here to help with your properties.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const handleSend = useCallback((text?: string) => {
    const messageText = text ?? input.trim();
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

    if (wsRef.current && wsReadyRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Route through OpenClaw WebSocket
      wsRef.current.send(JSON.stringify({ role: "user", content: messageText }));
    } else {
      // Fall back to POST /chat on API
      sendViaPost(messageText);
    }
  }, [input, sendViaPost]);

  useEffect(() => {
    if (initialPrompt && !processedInitialRef.current) {
      processedInitialRef.current = true;
      handleSend(initialPrompt);
    }
  }, [initialPrompt, handleSend]);

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
