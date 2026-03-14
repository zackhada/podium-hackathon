"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bot,
  Phone,
  PhoneOff,
  CheckCircle2,
  Wrench,
  ShoppingCart,
  CalendarDays,
  Loader2,
  BrainCircuit,
  MessageCircle,
  Wifi,
  Droplets,
  Lock,
  Thermometer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { addLiveAction } from "@/lib/live-state";
import { cn } from "@/lib/utils";
import type { AIAction } from "@/lib/types";

type Phase = "ringing" | "loading" | "connected" | "awaiting" | "executing" | "done";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, React.ElementType> = {
  wrench: Wrench,
  cart: ShoppingCart,
  calendar: CalendarDays,
  message: MessageCircle,
  wifi: Wifi,
  droplets: Droplets,
  lock: Lock,
  thermometer: Thermometer,
};

const ICON_COLORS: Record<string, string> = {
  wrench: "text-red-400",
  cart: "text-amber-400",
  calendar: "text-blue-400",
  message: "text-purple-400",
  wifi: "text-blue-400",
  droplets: "text-blue-400",
  lock: "text-red-400",
  thermometer: "text-orange-400",
};

interface ApiResponse {
  propertyName: string;
  propertyId: string;
  thinkingTrace: string[];
  script: { text: string; dim: boolean }[];
  actionItems: { iconType: string; label: string; cost: string }[];
  total: string;
  totalLabel: string;
  liveActions: Array<{
    category: AIAction["category"];
    title: string;
    description: string;
    status: AIAction["status"];
    cost: number | null;
    reasoning: string;
  }>;
}

interface IncidentCallProps {
  description: string;
  contextIndex?: number;
  onClose: () => void;
}

export function IncidentCall({ description, contextIndex, onClose }: IncidentCallProps) {
  const [phase, setPhase] = useState<Phase>("ringing");
  const [scenario, setScenario] = useState<ApiResponse | null>(null);
  const [fetchError, setFetchError] = useState(false);

  const [visibleThinking, setVisibleThinking] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [visibleActions, setVisibleActions] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Resolved while ringing — held until user answers
  const pendingScenario = useRef<ApiResponse | null>(null);
  const answeredRef = useRef(false);

  function schedule(ms: number, fn: () => void) {
    timeoutsRef.current.push(setTimeout(fn, ms));
  }

  function clearAll() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
  }

  // Kick off Claude fetch immediately on mount
  useEffect(() => {
    fetch("/api/incident", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, ...(contextIndex != null ? { contextIndex } : {}) }),
    })
      .then((r) => r.json())
      .then((data: ApiResponse) => {
        pendingScenario.current = data;
        // If user already answered, start playing now
        if (answeredRef.current) {
          setScenario(data);
          setPhase("connected");
          startAnimation(data);
        }
      })
      .catch(() => setFetchError(true));

    return () => clearAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startAnimation(data: ApiResponse) {
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);

    const thinkBase = 300;
    const thinkInterval = 450;
    data.thinkingTrace.forEach((_, i) =>
      schedule(thinkBase + i * thinkInterval, () => setVisibleThinking(i + 1))
    );

    const lastThinkMs = thinkBase + (data.thinkingTrace.length - 1) * thinkInterval;
    const scriptBase = lastThinkMs + 800;
    const scriptInterval = 1600;
    data.script.forEach((_, i) =>
      schedule(scriptBase + i * scriptInterval, () => setVisibleLines(i + 1))
    );

    const lastScriptMs = scriptBase + (data.script.length - 1) * scriptInterval;
    const actBase = lastScriptMs + 900;
    [0, 600, 1200].forEach((offset, i) =>
      schedule(actBase + offset, () => setVisibleActions(i + 1))
    );

    const totalMs = actBase + 1200 + 600;
    schedule(totalMs, () => setShowTotal(true));
    schedule(totalMs + 600, () => {
      setPhase("awaiting");
      setShowApproval(true);
    });
  }

  function answer() {
    answeredRef.current = true;
    if (pendingScenario.current) {
      // Claude already responded — start immediately
      const data = pendingScenario.current;
      setScenario(data);
      setPhase("connected");
      startAnimation(data);
    } else {
      // Still waiting for Claude
      setPhase("loading");
      // When fetch resolves it will detect answeredRef and call setScenario + startAnimation
    }
  }

  function decline() {
    clearAll();
    onClose();
  }

  function approve() {
    if (!scenario) return;
    clearAll();
    setPhase("executing");
    const now = new Date().toISOString();
    const actions: AIAction[] = scenario.liveActions.map((a, i) => ({
      id: `demo-act-${i + 1}`,
      propertyId: scenario.propertyId,
      category: a.category,
      title: a.title,
      description: a.description,
      timestamp: now,
      status: a.status,
      ...(a.cost != null ? { cost: a.cost } : {}),
      reasoning: a.reasoning,
    }));
    schedule(350, () => addLiveAction(actions[0]));
    schedule(700, () => addLiveAction(actions[1]));
    schedule(1050, () => addLiveAction(actions[2]));
    schedule(1600, () => setPhase("done"));
    schedule(3400, () => onClose());
  }

  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={phase === "ringing" ? decline : undefined}
      />

      <div
        className="relative z-10 w-full max-w-[420px] rounded-2xl overflow-hidden animate-fade-in shadow-2xl"
        style={{ background: "linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 100%)" }}
      >
        {phase === "ringing" ? (
          // ── Ringing ─────────────────────────────────────────────────
          <div className="flex flex-col items-center px-8 py-10 text-center">
            <div className="relative mb-8">
              <div className="absolute -inset-8 rounded-full bg-accent/10 animate-ping" style={{ animationDuration: "1.8s" }} />
              <div className="absolute -inset-4 rounded-full bg-accent/15 animate-ping" style={{ animationDuration: "1.8s", animationDelay: "0.4s" }} />
              <div className="relative h-20 w-20 rounded-full bg-accent/20 border-2 border-accent/50 flex items-center justify-center">
                <Bot className="h-10 w-10 text-accent" />
              </div>
            </div>

            <p className="text-white text-xl font-semibold mb-1">OpenClaw AI</p>
            <p className="text-gray-400 text-sm mb-1.5">Incoming incident call</p>
            <p className="text-gray-500 text-xs mb-1 max-w-[260px] truncate">{description}</p>
            <p className="text-gray-700 text-xs mb-10">Analyzing incident...</p>

            <div className="flex items-center gap-14">
              <button onClick={decline} className="flex flex-col items-center gap-2.5">
                <div className="h-14 w-14 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center hover:bg-red-500/25 transition-colors">
                  <PhoneOff className="h-6 w-6 text-red-400" />
                </div>
                <span className="text-xs text-gray-500">Decline</span>
              </button>
              <button onClick={answer} className="flex flex-col items-center gap-2.5">
                <div className="h-14 w-14 rounded-full bg-success/15 border border-success/30 flex items-center justify-center hover:bg-success/25 transition-colors animate-pulse">
                  <Phone className="h-6 w-6 text-success" />
                </div>
                <span className="text-xs text-gray-500">Answer</span>
              </button>
            </div>

            {fetchError && (
              <p className="mt-6 text-xs text-red-400">Failed to reach OpenClaw — check API key</p>
            )}
          </div>
        ) : phase === "loading" ? (
          // ── Waiting for Claude after user answered ───────────────────
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center gap-4">
            <div className="h-10 w-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
              <Bot className="h-5 w-5 text-accent" />
            </div>
            <p className="text-white text-sm font-semibold">Analyzing incident...</p>
            <Loader2 className="h-5 w-5 text-accent animate-spin" />
            <p className="text-gray-600 text-xs max-w-[240px]">{description}</p>
          </div>
        ) : (
          // ── Connected / Awaiting / Executing / Done ───────────────────
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">OpenClaw AI</p>
                <p className={cn("text-xs", phase === "done" ? "text-success" : phase === "executing" ? "text-accent" : "text-success")}>
                  {phase === "done" ? "Actions dispatched ✓" : phase === "executing" ? "Executing..." : `${fmt(seconds)} · Connected`}
                </p>
              </div>
              {(phase === "awaiting" || phase === "executing" || phase === "done") && (
                <button onClick={decline} className="text-gray-600 hover:text-gray-400 transition-colors p-1">
                  <PhoneOff className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Transcript */}
            <div className="px-5 py-5 space-y-3" style={{ minHeight: 280 }}>
              {/* Thinking trace */}
              {visibleThinking > 0 && scenario && (
                <div className="rounded-lg bg-black/60 border border-white/10 px-3 py-2.5 animate-fade-in">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BrainCircuit className="h-3 w-3 text-emerald-400" />
                    <span className="text-[9px] font-semibold tracking-widest text-emerald-400 uppercase">Agent reasoning</span>
                  </div>
                  <div className="space-y-1 font-mono">
                    {scenario.thinkingTrace.slice(0, visibleThinking).map((line, i) => (
                      <p key={i} className="text-[11px] text-gray-400 animate-fade-in flex gap-1.5">
                        <span className="text-emerald-600 shrink-0">›</span>
                        <span>{line}</span>
                      </p>
                    ))}
                    {visibleThinking < scenario.thinkingTrace.length && (
                      <p className="text-[11px] text-gray-600 font-mono flex items-center gap-1">
                        <span className="inline-block w-1.5 h-3 bg-emerald-500 animate-pulse" />
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Script */}
              {scenario?.script.map((line, i) =>
                visibleLines > i ? (
                  <p key={i} className={cn("text-sm leading-relaxed animate-fade-in", line.dim ? "text-gray-500 text-xs" : "text-gray-200")}>
                    {line.text}
                  </p>
                ) : null
              )}

              {/* Action items */}
              {visibleActions > 0 && scenario && (
                <div className="space-y-2 pt-1">
                  {scenario.actionItems.slice(0, visibleActions).map((item, i) => {
                    const Icon = ICON_MAP[item.iconType] ?? Wrench;
                    const color = ICON_COLORS[item.iconType] ?? "text-gray-400";
                    return (
                      <div key={i} className="flex items-center gap-3 animate-fade-in">
                        <div className="h-6 w-6 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                          <Icon className={cn("h-3.5 w-3.5", color)} />
                        </div>
                        <p className="flex-1 text-xs text-gray-300">{item.label}</p>
                        <span className="text-xs text-gray-500 font-mono">{item.cost}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Total */}
              {showTotal && scenario && (
                <div className="flex items-center justify-between pt-3 border-t border-white/10 animate-fade-in">
                  <p className="text-xs text-gray-500">Total · {scenario.totalLabel}</p>
                  <span className="text-sm font-bold text-white">{scenario.total}</span>
                </div>
              )}
            </div>

            {/* Bottom */}
            <div className="px-5 pb-5">
              {showApproval && phase === "awaiting" && scenario && (
                <div className="flex gap-3 animate-fade-in">
                  <Button className="flex-1 bg-success hover:bg-success/90 text-white border-0" onClick={approve}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve — {scenario.total}
                  </Button>
                  <Button variant="outline" onClick={decline} className="border-white/20 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent">
                    Not now
                  </Button>
                </div>
              )}

              {phase === "executing" && (
                <div className="flex items-center justify-center gap-2 text-sm text-accent animate-fade-in py-1">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Dispatching 3 actions...
                </div>
              )}

              {phase === "done" && (
                <div className="flex items-center justify-center gap-2 text-sm text-success animate-fade-in py-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Done — check Operations for live actions
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
