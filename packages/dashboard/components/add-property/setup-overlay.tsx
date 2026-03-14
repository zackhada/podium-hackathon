"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "pending" | "loading" | "done";

interface Step {
  label: string;
  result: string;
}

const STEPS: Step[] = [
  { label: "Analyzing property with AI", result: "Est. value, rate & revenue calculated" },
  { label: "Scanning comparable listings", result: "3 nearby Airbnb & VRBO listings found" },
  { label: "Mapping area attractions", result: "5 nearby highlights identified" },
  { label: "Finding local cleaning services", result: "3 services sourced & priced" },
];

interface SetupOverlayProps {
  address: string;
  onComplete: () => void;
}

function SetupStepRow({ step, status }: { step: Step; status: StepStatus }) {
  return (
    <div className={cn("flex items-start gap-3 py-2 animate-fade-in", status === "pending" && "opacity-40")}>
      <div className="mt-0.5 flex-shrink-0">
        {status === "pending" && <div className="h-4 w-4 rounded-full border border-white/20" />}
        {status === "loading" && <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />}
        {status === "done" && <CheckCircle2 className="h-4 w-4 text-green-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/90">{step.label}</p>
        {status === "loading" && (
          <div className="mt-1.5 space-y-1">
            <div className="h-2.5 rounded animate-pulse bg-white/10 w-3/4" />
            <div className="h-2.5 rounded animate-pulse bg-white/10 w-1/2" />
          </div>
        )}
        {status === "done" && (
          <p className="text-xs text-white/50 mt-0.5">{step.result}</p>
        )}
      </div>
    </div>
  );
}

export function SetupOverlay({ address, onComplete }: SetupOverlayProps) {
  const [statuses, setStatuses] = useState<StepStatus[]>(["pending", "pending", "pending", "pending"]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function schedule(ms: number, fn: () => void) {
    timeoutsRef.current.push(setTimeout(fn, ms));
  }

  function setStep(idx: number, status: StepStatus) {
    setStatuses((prev) => {
      const next = [...prev];
      next[idx] = status;
      return next;
    });
  }

  useEffect(() => {
    schedule(200,  () => setStep(0, "loading"));
    schedule(2200, () => { setStep(0, "done"); setStep(1, "loading"); });
    schedule(3800, () => { setStep(1, "done"); setStep(2, "loading"); });
    schedule(5200, () => { setStep(2, "done"); setStep(3, "loading"); });
    schedule(6600, () => setStep(3, "done"));
    schedule(7200, () => onComplete());

    return () => timeoutsRef.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed top-6 right-6 z-[1000] w-80">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl p-4">
        <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-white/10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
            <Bot className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Setting up property...</p>
            <p className="text-xs text-white/40 truncate">{address}</p>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {STEPS.map((step, i) => (
            <SetupStepRow key={step.label} step={step} status={statuses[i]} />
          ))}
        </div>
      </div>
    </div>
  );
}
