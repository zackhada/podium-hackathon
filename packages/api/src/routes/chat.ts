import { Router } from "express";

const router = Router();

function mockResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("leak") || lower.includes("maintenance") || lower.includes("repair") || lower.includes("broken") || lower.includes("faucet")) {
    return "I'll create a maintenance ticket for that right away and assign the appropriate vendor. Give me a moment to look up the unit details...";
  }
  if (lower.includes("rent") || lower.includes("payment") || lower.includes("collect") || lower.includes("overdue")) {
    return "Let me pull up the current payment statuses. I'll identify any outstanding balances and can trigger collection for overdue accounts.";
  }
  if (lower.includes("tenant") || lower.includes("notify") || lower.includes("message")) {
    return "I can send a notification to the tenant. Which property or unit would you like me to contact?";
  }
  if (lower.includes("vendor") || lower.includes("assign") || lower.includes("plumb") || lower.includes("electric")) {
    return "I'll find the right vendor for this job based on trade specialty and availability.";
  }
  return "I'm PropBot, your AI property manager. I can handle maintenance tickets, rent collection, vendor assignments, and tenant notifications. What do you need?";
}

// POST /chat — proxy to OpenClaw HTTP API, or return mock response
router.post("/", async (req, res) => {
  const { message, sessionId } = req.body as { message?: string; sessionId?: string };

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  const openclawUrl = process.env.OPENCLAW_URL;

  if (openclawUrl) {
    try {
      const upstream = await fetch(`${openclawUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId }),
        signal: AbortSignal.timeout(15_000),
      });
      const data = await upstream.json();
      return res.json(data);
    } catch {
      // OpenClaw unreachable — fall through to mock
    }
  }

  res.json({ content: mockResponse(message) });
});

export default router;
