"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ActionCard } from "@/components/operations/action-card";
import { CategoryFilter } from "@/components/operations/category-filter";
import { OverrideDialog } from "@/components/operations/override-dialog";
import { AIAction, AIActionStatus } from "@/lib/types";

interface TicketAction extends AIAction {
  propertyName: string;
}

function ticketToAction(ticket: {
  id: string;
  description: string;
  status: string;
  createdAt: string;
  unit?: { number: string; propertyId: string; property?: { address: string } };
  vendor?: { name: string } | null;
}): TicketAction {
  const statusMap: Record<string, AIActionStatus> = {
    open: "pending",
    in_progress: "in-progress",
    resolved: "completed",
    closed: "completed",
  };
  return {
    id: ticket.id,
    propertyId: ticket.unit?.propertyId ?? "unknown",
    propertyName: ticket.unit
      ? `${ticket.unit.property?.address ?? "Property"} · Unit ${ticket.unit.number}`
      : "Unknown property",
    category: "repair",
    title: ticket.description,
    description: ticket.vendor ? `Assigned to ${ticket.vendor.name}` : "No vendor assigned yet",
    timestamp: ticket.createdAt,
    status: statusMap[ticket.status] ?? "pending",
  };
}

export default function OperationsPage() {
  const [actions, setActions] = useState<TicketAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [overrideTarget, setOverrideTarget] = useState<AIAction | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/maintenance`);
      const data = await res.json();
      setActions((data as Parameters<typeof ticketToAction>[0][]).map(ticketToAction));
    } catch {
      // keep existing data on error
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // Initial fetch + polling every 10s
  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 10_000);
    return () => clearInterval(interval);
  }, [fetchTickets]);

  // WebSocket — prepend new repair actions as they arrive
  useEffect(() => {
    const wsUrl = apiUrl.replace(/^http/, "ws") + "/ws";
    const reconnectTimer = { current: null as ReturnType<typeof setTimeout> | null };

    function connect() {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string);
          if (data.type === "action" && data.category === "repair") {
            fetchTickets(); // re-fetch to get full ticket with vendor info
          }
        } catch { /* ignore */ }
      };

      ws.onclose = () => {
        reconnectTimer.current = setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [apiUrl, fetchTickets]);

  const filteredActions =
    categoryFilter === "all"
      ? actions
      : actions.filter((a) => a.category === categoryFilter);

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

      {loading ? (
        <div className="text-center py-12 text-muted">Loading tickets…</div>
      ) : (
        <div className="space-y-3">
          {filteredActions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              propertyName={action.propertyName}
              onOverride={setOverrideTarget}
            />
          ))}
        </div>
      )}

      {!loading && filteredActions.length === 0 && (
        <div className="text-center py-12 text-muted">
          No maintenance tickets found.
        </div>
      )}

      <OverrideDialog
        open={!!overrideTarget}
        onOpenChange={(open) => !open && setOverrideTarget(null)}
        actionTitle={overrideTarget?.title ?? ""}
        onConfirm={confirmOverride}
      />
    </div>
  );
}
