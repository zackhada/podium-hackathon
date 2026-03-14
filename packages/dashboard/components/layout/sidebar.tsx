"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LayoutDashboard, CalendarDays, Activity, DollarSign, MessageSquare, Map } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/map", label: "Map", icon: Map },
  { href: "/calendar", label: "Bookings", icon: CalendarDays },
  { href: "/operations", label: "Operations", icon: Activity },
  { href: "/finances", label: "Finances", icon: DollarSign },
  { href: "/chat", label: "Chat", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-surface flex flex-col">
      {/* Branding */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-gray-900">PropBot</h1>
          <p className="text-xs text-muted">Honolulu Rentals</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <link.icon className={cn("h-4.5 w-4.5", isActive ? "text-accent" : "text-muted-light")} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4">
        {/* ============================================================
            OPENCLAW_HOOK: Agent connection status
            Integration: WebSocket ${NEXT_PUBLIC_OPENCLAW_URL}/ws/status
            Current behavior: Always shows "connected" with green dot
            ============================================================ */}
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          Powered by OpenClaw
        </div>
      </div>
    </aside>
  );
}
