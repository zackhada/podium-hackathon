"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Loader2, CheckCircle2 } from "lucide-react";
import { PendingIncident } from "@/lib/pending-incidents";

interface Props {
  incident: PendingIncident;
  onAccept: (incident: PendingIncident) => void;
  onDecline: (incident: PendingIncident) => void;
}

type CallbackStatus = "idle" | "calling" | "done" | "error";

export function IncidentReviewCard({ incident, onAccept, onDecline }: Props) {
  const [showThinking, setShowThinking] = useState(false);
  const [callbackStatus, setCallbackStatus] = useState<CallbackStatus>("idle");

  async function handleAccept() {
    setCallbackStatus("calling");
    // Fire callback — parent handles live actions + removal
    try {
      await fetch("/api/vapi/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestPhone: incident.guestPhone,
          guestName: incident.guestName,
          callbackScript: incident.callbackScript,
        }),
      });
      setCallbackStatus("done");
    } catch {
      setCallbackStatus("error");
    }
    onAccept(incident);
  }

  function handleDecline() {
    onDecline(incident);
  }

  const { incidentData } = incident;
  const actionItems = incidentData?.actionItems ?? [];
  const thinkingTrace = incidentData?.thinkingTrace ?? "";

  return (
    <div className="rounded-xl border border-amber-200 border-l-4 border-l-amber-400 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-amber-50/60">
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            Incident Detected
            <span className="ml-2 text-xs font-normal text-gray-500">{incident.propertyName}</span>
          </p>
          <p className="text-xs text-gray-500 truncate">{incident.guestName} · {incident.guestPhone}</p>
        </div>
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
          Needs Review
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        <p className="text-sm text-gray-700">{incident.incidentSummary}</p>

        {actionItems.length > 0 && (
          <div className="space-y-1.5">
            {actionItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                </span>
                {item.cost != null && (
                  <span className="font-medium text-gray-800">${item.cost.toFixed(2)}</span>
                )}
              </div>
            ))}
            {incidentData?.total != null && (
              <div className="flex items-center justify-between text-xs font-semibold text-gray-900 pt-1 border-t border-gray-100">
                <span>{incidentData.totalLabel ?? "Total"}</span>
                <span>${incidentData.total.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        {thinkingTrace && (
          <div>
            <button
              onClick={() => setShowThinking((v) => !v)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
            >
              {showThinking ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {showThinking ? "Hide" : "Show"} thinking trace
            </button>
            {showThinking && (
              <pre className="mt-2 text-[11px] text-gray-500 bg-gray-50 rounded-md p-2 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {thinkingTrace}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50/60 border-t border-gray-100 space-y-3">
        <div className="rounded-md bg-green-50 border border-green-100 px-3 py-2">
          <p className="text-[10px] font-semibold text-green-700 uppercase tracking-wide mb-1">
            PropBot will say:
          </p>
          <p className="text-xs text-green-900 italic">&ldquo;{incident.callbackScript}&rdquo;</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAccept}
            disabled={callbackStatus === "calling" || callbackStatus === "done"}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {callbackStatus === "calling" ? (
              <><Loader2 className="h-3 w-3 animate-spin" /> Calling...</>
            ) : callbackStatus === "done" ? (
              <><CheckCircle2 className="h-3 w-3" /> Called</>
            ) : (
              "Accept — Call Guest Back"
            )}
          </button>
          <button
            onClick={handleDecline}
            disabled={callbackStatus === "calling"}
            className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
          >
            Dismiss
          </button>
          {callbackStatus === "error" && (
            <span className="text-xs text-red-500">Callback failed</span>
          )}
        </div>
      </div>
    </div>
  );
}
