import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";

let wss: WebSocketServer | null = null;

export function initWSS(server: Server): WebSocketServer {
  wss = new WebSocketServer({ server });
  wss.on("connection", () => {
    console.log("[WS] Client connected");
  });
  return wss;
}

export function broadcast(event: object): void {
  if (!wss) return;
  const msg = JSON.stringify(event);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}
