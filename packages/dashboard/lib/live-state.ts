import { AIAction } from "./types";

type Listener = () => void;
const listeners = new Set<Listener>();

// Module-level mutable store — survives client-side navigation
export const liveActions: AIAction[] = [];

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribeLive(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function addLiveAction(action: AIAction): void {
  liveActions.unshift(action);
  notify();
}

export function resetLive(): void {
  liveActions.length = 0;
  notify();
}

export function getLiveActions(): AIAction[] {
  return [...liveActions];
}
