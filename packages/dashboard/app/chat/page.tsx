"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ChatInterface } from "@/components/chat/chat-interface";
import { SamplePrompts } from "@/components/chat/sample-prompts";

// ============================================================
// OPENCLAW_HOOK: Chat interface - primary integration point
// Integration: WebSocket ${NEXT_PUBLIC_OPENCLAW_URL}/ws/chat
// Current behavior: Mock AI responses based on keyword matching
// ============================================================

export default function ChatPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>();

  return (
    <div>
      <PageHeader
        title="Chat"
        subtitle="Talk to PropBot about your properties"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar: Sample Prompts */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Prompts</h3>
          <SamplePrompts onSelect={setSelectedPrompt} />
        </div>

        {/* Main: Chat Area */}
        <div className="lg:col-span-3">
          <ChatInterface initialPrompt={selectedPrompt} />
        </div>
      </div>
    </div>
  );
}
