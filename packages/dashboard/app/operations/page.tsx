"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ActionCard } from "@/components/operations/action-card";
import { CategoryFilter } from "@/components/operations/category-filter";
import { OverrideDialog } from "@/components/operations/override-dialog";
import { IncidentReviewCard } from "@/components/operations/incident-review-card";
import { aiActions as initialActions } from "@/lib/mock-data";
import { subscribeLive, getLiveActions, addLiveAction } from "@/lib/live-state";
import { subscribePending, getPendingIncidents, removePendingIncident, addPendingIncident, PendingIncident } from "@/lib/pending-incidents";
import { AIAction, AIActionCategory, AIActionStatus } from "@/lib/types";

function mapCategory(raw: string): AIActionCategory {
  const valid: AIActionCategory[] = ["cleaning", "amazon", "repair", "pricing", "messaging", "calendar"];
  return valid.includes(raw as AIActionCategory) ? (raw as AIActionCategory) : "messaging";
}

function mapStatus(raw: string): AIActionStatus {
  const valid: AIActionStatus[] = ["completed", "pending", "in-progress", "overridden", "failed"];
  return valid.includes(raw as AIActionStatus) ? (raw as AIActionStatus) : "pending";
}

export default function OperationsPage() {
  const [liveActionsSnapshot, setLiveActionsSnapshot] = useState<AIAction[]>([]);
  const [pendingSnapshot, setPendingSnapshot] = useState<PendingIncident[]>([]);
  const [actions, setActions] = useState<AIAction[]>(initialActions);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [overrideTarget, setOverrideTarget] = useState<AIAction | null>(null);

  // Subscribe to live-state (client-side demo incidents)
  useEffect(() => {
    setLiveActionsSnapshot(getLiveActions());
    return subscribeLive(() => setLiveActionsSnapshot(getLiveActions()));
  }, []);

  // Subscribe to pending incidents store
  useEffect(() => {
    setPendingSnapshot(getPendingIncidents());
    return subscribePending(() => setPendingSnapshot(getPendingIncidents()));
  }, []);

  // Subscribe to VAPI real call incidents via SSE
  useEffect(() => {
    const es = new EventSource("/api/vapi/events");

    es.onmessage = (e) => {
      if (!e.data || e.data.startsWith(":")) return;
      try {
        const data = JSON.parse(e.data);
        if (data._type === "pending-incident") {
          addPendingIncident(data);
        } else {
          addLiveAction({
            id: `vapi-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            propertyId: data.propertyId,
            category: data.category as AIActionCategory,
            title: data.title,
            description: data.description,
            timestamp: new Date().toISOString(),
            status: data.status as AIActionStatus,
            ...(data.cost != null ? { cost: data.cost } : {}),
            reasoning: data.reasoning,
          });
        }
      } catch {
        // malformed event, ignore
      }
    };

    return () => es.close();
  }, []);

  const allActions = [...liveActionsSnapshot, ...actions];
  const filteredActions =
    categoryFilter === "all"
      ? allActions
      : allActions.filter((a) => a.category === categoryFilter);

  function handleAccept(incident: PendingIncident) {
    removePendingIncident(incident.id);
    const now = new Date().toISOString();
    incident.liveActions.forEach((action) => {
      addLiveAction({
        id: `vapi-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        propertyId: action.propertyId,
        category: mapCategory(action.category),
        title: action.title,
        description: action.description,
        timestamp: now,
        status: mapStatus(action.status),
        cost: action.cost ?? undefined,
        reasoning: action.reasoning,
      });
    });
  }

  function handleDecline(incident: PendingIncident) {
    removePendingIncident(incident.id);
  }

  function handleOverride(action: AIAction) {
    setOverrideTarget(action);
  }

  const confirmOverride = () => {
    if (!overrideTarget) return;
    setActions((prev) =>
      prev.map((a) =>
        a.id === overrideTarget.id ? { ...a, status: "overridden" as const } : a
      )
    );
    setOverrideTarget(null);
  };

  return (
    <div>
      <PageHeader
        title="Operations"
        subtitle="AI-managed maintenance tickets across your properties"
      />

      <div className="mb-6">
        <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
      </div>

      {pendingSnapshot.length > 0 && (
        <div className="mb-6 space-y-3">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
            ⚠ Awaiting Review · {pendingSnapshot.length}
          </p>
          {pendingSnapshot.map((incident) => (
            <IncidentReviewCard
              key={incident.id}
              incident={incident}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))}
        </div>
      )}

      <div className="space-y-3">
        {filteredActions.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            onOverride={handleOverride}
            isLive={liveActionsSnapshot.some((a) => a.id === action.id)}
          />
        ))}
      </div>

      <OverrideDialog
        open={!!overrideTarget}
        onOpenChange={(open) => !open && setOverrideTarget(null)}
        actionTitle={overrideTarget?.title ?? ""}
        onConfirm={confirmOverride}
      />
    </div>
  );
}
