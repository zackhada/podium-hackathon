// Server-side event store for VAPI call incidents
// Module-level state shared within the same Next.js process

export interface VapiIncidentAction {
  category: string;
  title: string;
  description: string;
  status: string;
  cost: number | null;
  reasoning: string;
  propertyId: string;
}

export interface VapiPendingIncidentPayload {
  _type: "pending-incident";
  id: string;
  callId: string;
  guestName: string;
  guestPhone: string;
  propertyId: string;
  propertyName: string;
  incidentSummary: string;
  callbackScript: string;
  liveActions: VapiIncidentAction[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  incidentData: any;
  createdAt: string;
}

type VapiListener = (action: VapiIncidentAction) => void;
type PendingIncidentListener = (payload: VapiPendingIncidentPayload) => void;

const vapiListeners = new Set<VapiListener>();
const pendingIncidentListeners = new Set<PendingIncidentListener>();

export function subscribeVapiEvents(fn: VapiListener): () => void {
  vapiListeners.add(fn);
  return () => vapiListeners.delete(fn);
}

export function emitVapiIncident(payload: VapiIncidentAction): void {
  vapiListeners.forEach((fn) => fn(payload));
}

export function subscribePendingIncidentEvents(fn: PendingIncidentListener): () => void {
  pendingIncidentListeners.add(fn);
  return () => pendingIncidentListeners.delete(fn);
}

export function emitPendingIncidentEvent(payload: VapiPendingIncidentPayload): void {
  pendingIncidentListeners.forEach((fn) => fn(payload));
}
