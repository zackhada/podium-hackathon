import { AIActionCategory, AIActionStatus } from "./types";

export interface PendingIncident {
  id: string;
  callId: string;
  guestName: string;
  guestPhone: string;
  propertyId: string;
  propertyName: string;
  incidentSummary: string;
  callbackScript: string;
  liveActions: Array<{
    category: AIActionCategory;
    title: string;
    description: string;
    status: AIActionStatus;
    cost: number | null;
    reasoning: string;
    propertyId: string;
  }>;
  incidentData: {
    thinkingTrace: string;
    script: Array<{ text: string; dim?: boolean }>;
    actionItems: Array<{ label: string; cost?: number; icon?: string }>;
    total: number;
    totalLabel: string;
    propertyName: string;
    propertyId: string;
  };
  createdAt: string;
}

type Listener = () => void;
const listeners = new Set<Listener>();

export const pendingIncidents: PendingIncident[] = [];

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribePending(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function addPendingIncident(incident: PendingIncident): void {
  // Dedup by callId
  const exists = pendingIncidents.some((i) => i.callId === incident.callId);
  if (exists) return;
  pendingIncidents.unshift(incident);
  notify();
}

export function removePendingIncident(id: string): void {
  const idx = pendingIncidents.findIndex((i) => i.id === id);
  if (idx !== -1) {
    pendingIncidents.splice(idx, 1);
    notify();
  }
}

export function getPendingIncidents(): PendingIncident[] {
  return [...pendingIncidents];
}
