"use client";

import { createContext, useContext, useState, ReactNode, useRef } from "react";
import { Zap, ArrowRight, X } from "lucide-react";
import { IncidentCall } from "./incident-call";
import { resetLive } from "@/lib/live-state";

interface DemoContextValue {
  triggerCall: () => void;
}

const DemoContext = createContext<DemoContextValue>({ triggerCall: () => {} });

export function useDemoTrigger() {
  return useContext(DemoContext);
}

const QUICK_OPTIONS = [
  "AC is making a loud noise",
  "Water leaking under the sink",
  "Guest can't get in — keypad is dead",
  "WiFi is completely down",
  "Fridge stopped cooling",
  "No hot water in the shower",
  "Cockroach spotted in the kitchen",
  "Neighbor noise complaint",
  "Smoke detector won't stop beeping",
  "Toilet is overflowing",
];

export function DemoProvider({ children }: { children: ReactNode }) {
  const [showInput, setShowInput] = useState(false);
  const [callVisible, setCallVisible] = useState(false);
  const [incidentDescription, setIncidentDescription] = useState("");
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function triggerCall() {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function startCall(desc: string) {
    const trimmed = desc.trim();
    if (!trimmed) return;
    setIncidentDescription(trimmed);
    setInputValue("");
    setShowInput(false);
    resetLive();
    setCallVisible(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startCall(inputValue);
  }

  return (
    <DemoContext.Provider value={{ triggerCall }}>
      {children}

      {/* Floating trigger button */}
      {!callVisible && !showInput && (
        <button
          onClick={triggerCall}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-accent/90 transition-all hover:scale-105 active:scale-95"
        >
          <Zap className="h-4 w-4" />
          Simulate Incident
        </button>
      )}

      {/* Incident input overlay */}
      {showInput && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowInput(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Simulate an Incident</p>
                <p className="text-xs text-gray-500 mt-0.5">OpenClaw will generate a live response using Claude</p>
              </div>
              <button
                onClick={() => setShowInput(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-5 pb-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe the incident..."
                  className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="flex items-center justify-center h-[42px] w-[42px] rounded-lg bg-accent text-white disabled:opacity-40 hover:bg-accent/90 transition-colors shrink-0"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Quick options */}
            <div className="px-5 pb-5">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2.5">Quick options</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => startCall(opt)}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {callVisible && (
        <IncidentCall
          description={incidentDescription}
          onClose={() => setCallVisible(false)}
        />
      )}
    </DemoContext.Provider>
  );
}
