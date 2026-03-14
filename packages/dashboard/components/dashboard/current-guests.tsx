"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bookings, getPropertyById } from "@/lib/mock-data";
import { Phone, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { addPendingIncident } from "@/lib/pending-incidents";
import { AIActionCategory, AIActionStatus } from "@/lib/types";

type CallState = "idle" | "calling" | "ringing" | "done" | "error";

interface VapiStatusResponse {
  callStatus: string;
  endedReason?: string;
  transcript?: string;
  incident: boolean;
  processed: boolean;
  liveActions: Array<{
    category: string;
    title: string;
    description: string;
    status: string;
    cost: number | null;
    reasoning: string;
    propertyId: string;
  }> | null;
  incidentData?: {
    thinkingTrace: string;
    script: Array<{ text: string; dim?: boolean }>;
    actionItems: Array<{ label: string; cost?: number; icon?: string }>;
    total: number;
    totalLabel: string;
    propertyName: string;
    propertyId: string;
  };
}

function mapCategory(raw: string): AIActionCategory {
  const valid: AIActionCategory[] = ["cleaning", "amazon", "repair", "pricing", "messaging", "calendar"];
  return valid.includes(raw as AIActionCategory) ? (raw as AIActionCategory) : "messaging";
}

function mapStatus(raw: string): AIActionStatus {
  const valid: AIActionStatus[] = ["completed", "pending", "in-progress", "overridden", "failed"];
  return valid.includes(raw as AIActionStatus) ? (raw as AIActionStatus) : "pending";
}

export function CurrentGuests() {
  const currentGuests = bookings.filter((b) => b.status === "checked-in");
  const [callStates, setCallStates] = useState<Record<string, CallState>>({});
  const [callIds, setCallIds] = useState<Record<string, string>>({});

  // Map of bookingId -> { guestPhone, guestName, propertyId } for pending incident assembly
  const guestContextRef = useRef<Record<string, { guestPhone: string; guestName: string; propertyId: string }>>({});

  // Map of bookingId -> interval ID for active polls
  const pollingRefs = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  function stopPolling(bookingId: string) {
    const intervalId = pollingRefs.current[bookingId];
    if (intervalId !== undefined) {
      clearInterval(intervalId);
      delete pollingRefs.current[bookingId];
    }
  }

  // Clean up all intervals on unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(pollingRefs.current).forEach(clearInterval);
    };
  }, []);

  // Start polling whenever a new callId appears for a booking in "ringing" state
  useEffect(() => {
    Object.entries(callIds).forEach(([bookingId, callId]) => {
      // Only start a poll if we don't already have one running for this booking
      if (pollingRefs.current[bookingId] !== undefined) return;
      if (callStates[bookingId] !== "ringing") return;

      const intervalId = setInterval(async () => {
        try {
          const res = await fetch(`/api/vapi/status/${callId}`);
          if (!res.ok) return; // transient error — keep polling

          const data: VapiStatusResponse = await res.json();

          console.log("[poll]", bookingId, data.callStatus, { processed: data.processed, incident: data.incident, hasIncidentData: !!data.incidentData, liveActionsCount: data.liveActions?.length ?? 0 });

          if (data.processed) {
            stopPolling(bookingId);

            if (data.incident && data.incidentData && data.liveActions && data.liveActions.length > 0) {
              const ctx = guestContextRef.current[bookingId];
              const propertyName = data.incidentData.propertyName ?? "your property";
              const guestName = ctx?.guestName ?? "Guest";
              const callbackScript = [
                `Hi ${guestName}, this is PropBot from ${propertyName}.`,
                ...data.incidentData.script.filter((s) => !s.dim).map((s) => s.text),
                `Our team is on the way and will have this resolved shortly.`,
              ].join(" ");

              const incidentSummary =
                data.incidentData.script.find((s) => !s.dim)?.text ??
                data.incidentData.actionItems[0]?.label ??
                "Incident detected";

              addPendingIncident({
                id: `pending-${callIds[bookingId]}-${Date.now()}`,
                callId: callIds[bookingId] ?? bookingId,
                guestName,
                guestPhone: ctx?.guestPhone ?? "",
                propertyId: ctx?.propertyId ?? data.incidentData.propertyId,
                propertyName,
                incidentSummary,
                callbackScript,
                liveActions: data.liveActions.map((a) => ({
                  category: mapCategory(a.category),
                  title: a.title,
                  description: a.description,
                  status: mapStatus(a.status),
                  cost: a.cost,
                  reasoning: a.reasoning,
                  propertyId: a.propertyId ?? data.incidentData!.propertyId,
                })),
                incidentData: data.incidentData,
                createdAt: new Date().toISOString(),
              });
            }

            setCallStates((s) => ({ ...s, [bookingId]: "done" }));
          }
        } catch {
          // Network error — keep polling until unmount
        }
      }, 5000);

      pollingRefs.current[bookingId] = intervalId;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callIds, callStates]);

  async function callGuest(
    bookingId: string,
    guestPhone: string,
    guestName: string,
    propertyId: string
  ) {
    const property = getPropertyById(propertyId);
    guestContextRef.current[bookingId] = { guestPhone, guestName, propertyId };
    setCallStates((s) => ({ ...s, [bookingId]: "calling" }));
    try {
      const res = await fetch("/api/vapi/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestPhone,
          guestName,
          propertyName: property?.name ?? "your property",
          propertyId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const callId: string = data.callId;
        setCallIds((prev) => ({ ...prev, [bookingId]: callId }));
        setCallStates((s) => ({ ...s, [bookingId]: "ringing" }));
      } else {
        setCallStates((s) => ({ ...s, [bookingId]: "error" }));
        console.error("VAPI call error:", data.error);
      }
    } catch {
      setCallStates((s) => ({ ...s, [bookingId]: "error" }));
    }
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <span className="h-4 w-4 text-muted flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          Currently Staying
          <span className="ml-auto text-xs font-normal text-muted bg-gray-100 px-2 py-0.5 rounded-full">
            {currentGuests.length} guests
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentGuests.map((booking) => {
            const property = getPropertyById(booking.propertyId);
            const checkOut = new Date(booking.checkOut);
            const today = new Date("2026-03-14");
            const daysLeft = Math.ceil(
              (checkOut.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );
            const callState = callStates[booking.id] ?? "idle";

            return (
              <div key={booking.id} className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
                  {booking.guestAvatar ? (
                    <Image
                      src={booking.guestAvatar}
                      alt={booking.guestName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-accent/10 text-accent text-sm font-semibold">
                      {booking.guestName.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {booking.guestName}
                  </p>
                  <p className="text-xs text-muted truncate">{property?.name}</p>
                </div>

                <div className="text-right shrink-0">
                  {booking.guestPhone && (
                    <button
                      onClick={() => {
                        if (callState === "idle" || callState === "error") {
                          callGuest(
                            booking.id,
                            booking.guestPhone!,
                            booking.guestName,
                            booking.propertyId
                          );
                        }
                      }}
                      disabled={callState === "calling" || callState === "ringing"}
                      title={
                        callState === "done"
                          ? "Call initiated"
                          : callState === "ringing"
                          ? "Call in progress — polling for updates"
                          : callState === "error"
                          ? "Call failed — click to retry"
                          : `Call ${booking.guestName} via PropBot`
                      }
                      className="flex items-center gap-1 text-xs text-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {callState === "calling" ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          {booking.guestPhone}
                        </>
                      ) : callState === "ringing" ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Ringing...
                        </>
                      ) : callState === "done" ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-success" />
                          {booking.guestPhone}
                        </>
                      ) : callState === "error" ? (
                        <>
                          <XCircle className="h-3 w-3 text-red-500" />
                          {booking.guestPhone}
                        </>
                      ) : (
                        <>
                          <Phone className="h-3 w-3" />
                          {booking.guestPhone}
                        </>
                      )}
                    </button>
                  )}
                  <p className="text-xs text-muted mt-0.5">
                    {daysLeft === 0
                      ? "Checks out today"
                      : daysLeft === 1
                      ? "1 day left"
                      : `${daysLeft} days left`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
