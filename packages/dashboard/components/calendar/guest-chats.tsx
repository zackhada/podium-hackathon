"use client";

import { useState, useRef, useEffect } from "react";
import { GuestConversation, Property } from "@/lib/types";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuestChatsProps {
  conversations: GuestConversation[];
  properties: Property[];
}

function formatListTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (diffDays < 7) return d.toLocaleDateString("en-US", { weekday: "short" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMsgTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Avatar({
  src,
  name,
  size = 36,
  className,
}: {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover shrink-0", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={cn(
        "rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-gray-600 font-semibold",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

export function GuestChats({ conversations, properties }: GuestChatsProps) {
  const [selectedId, setSelectedId] = useState<string>(conversations[0]?.id ?? "");
  const messagesRef = useRef<HTMLDivElement>(null);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  // Scroll the messages container itself — never the page
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [selectedId]);

  return (
    <div
      className="flex flex-col rounded-xl border border-border bg-surface overflow-hidden"
      style={{ height: "calc(100vh - 200px)", minHeight: "520px", maxHeight: "820px" }}
    >
      {/* Panel header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border shrink-0">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
          <Bot className="h-3.5 w-3.5 text-accent" />
        </div>
        <h2 className="text-sm font-semibold text-gray-900">Guest Conversations</h2>
        <span className="ml-auto text-[10px] text-muted bg-gray-100 px-2 py-0.5 rounded-full font-medium">
          {conversations.length} chats
        </span>
      </div>

      {/* Conversation picker — compact single-line rows */}
      <div className="shrink-0 border-b border-border overflow-y-auto" style={{ maxHeight: "168px" }}>
        {conversations.map((conv) => {
          const prop = properties.find((p) => p.id === conv.propertyId);
          const isSelected = conv.id === selectedId;

          return (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={cn(
                "flex items-center gap-2.5 w-full px-3 py-2 text-left transition-colors border-b border-border/30 last:border-b-0",
                isSelected
                  ? "bg-accent/8 border-l-[3px] border-l-accent"
                  : "hover:bg-gray-50 border-l-[3px] border-l-transparent"
              )}
            >
              {/* Avatar with property dot */}
              <div className="relative shrink-0">
                <Avatar src={conv.guestAvatar} name={conv.guestName} size={28} />
                {prop && (
                  <div
                    className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-[1.5px] border-white"
                    style={{ backgroundColor: prop.color }}
                  />
                )}
              </div>

              {/* Name + timestamp */}
              <div className="flex-1 min-w-0">
                <span className={cn("text-[11px] font-semibold truncate block", isSelected ? "text-accent" : "text-gray-800")}>
                  {conv.guestName}
                </span>
                <span className="text-[10px] text-muted truncate block">{formatListTime(conv.lastMessageTime)}</span>
              </div>

              {/* Unread badge */}
              {conv.unreadCount > 0 && (
                <div className="shrink-0 h-4 min-w-4 px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                  {conv.unreadCount}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Message thread */}
      {selected ? (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Conversation sub-header */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-gray-50/60 shrink-0">
            <div className="relative shrink-0">
              <Avatar src={selected.guestAvatar} name={selected.guestName} size={30} />
              {(() => {
                const prop = properties.find((p) => p.id === selected.propertyId);
                return prop ? (
                  <div
                    className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white"
                    style={{ backgroundColor: prop.color }}
                  />
                ) : null;
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 leading-tight">{selected.guestName}</p>
              {(() => {
                const prop = properties.find((p) => p.id === selected.propertyId);
                return prop ? (
                  <p className="text-[10px] text-muted truncate">{prop.name}</p>
                ) : null;
              })()}
            </div>
            <div className="flex items-center gap-1 text-[10px] bg-accent/10 text-accent px-2 py-1 rounded-full font-medium shrink-0">
              <Bot className="h-3 w-3" />
              OpenClaw AI
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
            {selected.messages.map((msg, idx) => {
              const isAgent = msg.role === "agent";
              const prevMsg = idx > 0 ? selected.messages[idx - 1] : null;
              const showTimestamp =
                !prevMsg ||
                new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime() >
                  10 * 60 * 1000;

              return (
                <div key={msg.id}>
                  {showTimestamp && (
                    <div className="text-center text-[10px] text-muted my-2.5">
                      {formatMsgTime(msg.timestamp)}
                    </div>
                  )}
                  <div
                    className={cn(
                      "flex items-end gap-1.5 mb-1",
                      isAgent ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {/* Avatar */}
                    <div className="shrink-0 mb-0.5">
                      {isAgent ? (
                        <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                      ) : (
                        <Avatar src={selected.guestAvatar} name={selected.guestName} size={20} />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={cn(
                        "max-w-[78%] rounded-2xl px-3 py-1.5 text-[11px] leading-relaxed whitespace-pre-wrap break-words",
                        isAgent
                          ? "bg-accent text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-900 rounded-bl-sm"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border bg-gray-50/60 shrink-0">
            <p className="text-[10px] text-muted text-center flex items-center justify-center gap-1">
              <Bot className="h-2.5 w-2.5" />
              Managed autonomously by OpenClaw · Read-only
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-muted">Select a conversation</p>
        </div>
      )}
    </div>
  );
}
