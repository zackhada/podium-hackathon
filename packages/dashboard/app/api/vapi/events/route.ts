import { NextRequest } from "next/server";
import { subscribeVapiEvents, subscribePendingIncidentEvents } from "@/lib/vapi-events";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection confirmation
      controller.enqueue(encoder.encode(`: connected\n\n`));

      // Keep-alive ping every 25s to prevent proxy timeouts
      const ping = setInterval(() => {
        controller.enqueue(encoder.encode(`: ping\n\n`));
      }, 25_000);

      const unsubscribe = subscribeVapiEvents((action) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(action)}\n\n`)
        );
      });

      const unsubscribePending = subscribePendingIncidentEvents((payload) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
        );
      });

      req.signal.addEventListener("abort", () => {
        clearInterval(ping);
        unsubscribe();
        unsubscribePending();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
