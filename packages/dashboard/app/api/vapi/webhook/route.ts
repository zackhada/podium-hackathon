import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { emitPendingIncidentEvent } from "@/lib/vapi-events";

const client = new Anthropic();

// Map property names to IDs for incident routing
const PROPERTY_NAME_TO_INDEX: Record<string, number> = {
  "Waikiki Beachfront Condo": 0,
  "Diamond Head Ocean Suite": 1,
  "Kailua Beach House": 2,
  "Waikiki Studio Retreat": 3,
  "Manoa Valley Townhouse": 4,
};

interface IncidentDetection {
  hasIncident: boolean;
  incidentDescription: string | null;
  propertyName: string | null;
  severity: "low" | "medium" | "high" | null;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // VAPI wraps webhook events in a "message" field
  const message = body.message ?? body;

  // Only act on end-of-call reports
  if (message.type !== "end-of-call-report") {
    return NextResponse.json({ received: true });
  }

  const transcript = (message.artifact?.transcript ?? message.transcript) as string | undefined;
  if (!transcript) {
    return NextResponse.json({ received: true });
  }

  const callId: string = message.call?.id ?? `webhook-${Date.now()}`;
  const guestPhone: string = message.call?.customer?.number ?? "";
  const guestName: string = message.call?.customer?.name ?? "Guest";

  // Use Claude to detect if an incident was mentioned on the call
  const detection = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `Analyze this vacation rental guest call transcript. Detect if any property issues were mentioned.

Transcript:
${transcript}

Issues to detect: AC/HVAC problems, plumbing, wifi/internet, appliance failures, cleanliness, missing supplies, noise, safety concerns, lock/access, broken fixtures, anything needing attention.

Return ONLY valid JSON (no markdown):
{
  "hasIncident": true or false,
  "incidentDescription": "brief description of the issue, or null if none",
  "propertyName": "property name if mentioned in the call, or null",
  "severity": "low | medium | high | null"
}`,
      },
    ],
  });

  const rawText = (detection.content[0] as { type: string; text: string }).text.trim();
  const detectionData: IncidentDetection = JSON.parse(
    rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "")
  );

  if (!detectionData.hasIncident || !detectionData.incidentDescription) {
    return NextResponse.json({ received: true, incident: false });
  }

  // Determine which property context to use
  const contextIndex =
    detectionData.propertyName && detectionData.propertyName in PROPERTY_NAME_TO_INDEX
      ? PROPERTY_NAME_TO_INDEX[detectionData.propertyName]
      : undefined;

  // Generate a full incident response via the existing /api/incident endpoint
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const incidentRes = await fetch(`${baseUrl}/api/incident`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: `[Voice call] ${detectionData.incidentDescription}`,
      contextIndex,
    }),
  });

  const incidentData = await incidentRes.json();

  const propertyName: string = incidentData.propertyName ?? "your property";
  const propertyId: string = incidentData.propertyId ?? "prop-1";

  const callbackScript = [
    `Hi ${guestName}, this is PropBot from ${propertyName}.`,
    ...(incidentData.script ?? [])
      .filter((s: { text: string; dim?: boolean }) => !s.dim)
      .map((s: { text: string }) => s.text),
    `Our team is on the way and will have this resolved shortly.`,
  ].join(" ");

  const incidentSummary: string =
    (incidentData.script ?? []).find((s: { text: string; dim?: boolean }) => !s.dim)?.text ??
    incidentData.actionItems?.[0]?.label ??
    detectionData.incidentDescription ??
    "Incident detected";

  const liveActions = Array.isArray(incidentData.liveActions)
    ? incidentData.liveActions.map((a: {
        category: string; title: string; description: string;
        status: string; cost: number | null; reasoning: string; propertyId?: string;
      }) => ({
        category: a.category,
        title: a.title,
        description: a.description,
        status: a.status,
        cost: a.cost ?? null,
        reasoning: a.reasoning,
        propertyId: a.propertyId ?? propertyId,
      }))
    : [];

  emitPendingIncidentEvent({
    _type: "pending-incident",
    id: `pending-${callId}-${Date.now()}`,
    callId,
    guestName,
    guestPhone,
    propertyId,
    propertyName,
    incidentSummary,
    callbackScript,
    liveActions,
    incidentData,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    received: true,
    incident: true,
    actionsDispatched: liveActions.length,
    severity: detectionData.severity,
  });
}
