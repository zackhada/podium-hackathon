import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PROPERTY_TO_CONTEXT_INDEX: Record<string, number> = {
  "Waikiki Beachfront Condo": 0,
  "Diamond Head Ocean Suite": 1,
  "Kailua Beach House": 2,
  "Waikiki Studio Retreat": 3,
  "Manoa Valley Townhouse": 4,
};

interface VapiCall {
  id: string;
  status: string;
  endedReason?: string;
  transcript?: string;
  artifact?: { transcript?: string };
}

interface IncidentDetectionResult {
  hasIncident: boolean;
  incidentDescription: string | null;
  propertyName: string | null;
  severity: "low" | "medium" | "high" | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { callId: string } }
) {
  const { callId } = params;
  const vapiApiKey = process.env.VAPI_API_KEY;

  if (!vapiApiKey) {
    return NextResponse.json(
      { error: "VAPI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  // Fetch call details from VAPI
  let vapiCall: VapiCall;
  try {
    const vapiResponse = await fetch(`https://api.vapi.ai/call/${callId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${vapiApiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!vapiResponse.ok) {
      const errorText = await vapiResponse.text();
      return NextResponse.json(
        {
          error: `VAPI fetch failed: ${vapiResponse.status} ${vapiResponse.statusText}`,
          details: errorText,
        },
        { status: vapiResponse.status }
      );
    }

    vapiCall = await vapiResponse.json();
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to reach VAPI", details: String(err) },
      { status: 502 }
    );
  }

  const callStatus = vapiCall.status;
  const endedReason = vapiCall.endedReason ?? null;
  const transcript = vapiCall.artifact?.transcript ?? vapiCall.transcript ?? null;

  // If call has ended and there's a transcript, run incident detection
  if (callStatus === "ended" && transcript) {
    let detectionResult: IncidentDetectionResult;

    try {
      const detectionPrompt = `Analyze this vacation rental guest call transcript. Detect if any property issues were mentioned.

Transcript:
${transcript}

Issues to detect: AC/HVAC problems, plumbing, wifi/internet, appliance failures, cleanliness, missing supplies, noise, safety concerns, lock/access, broken fixtures, anything needing attention.

Return ONLY valid JSON (no markdown):
{
  "hasIncident": true or false,
  "incidentDescription": "brief description of the issue, or null if none",
  "propertyName": "property name if mentioned in the call, or null",
  "severity": "low | medium | high | null"
}`;

      const message = await anthropic.messages.create({
        model: "claude-opus-4-6",
        max_tokens: 512,
        messages: [{ role: "user", content: detectionPrompt }],
      });

      const rawText = (
        message.content[0] as { type: string; text: string }
      ).text.trim();
      const cleaned = rawText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "");
      detectionResult = JSON.parse(cleaned) as IncidentDetectionResult;
    } catch (err) {
      // If detection fails, return call status without incident data
      return NextResponse.json({
        callStatus,
        endedReason,
        transcript,
        incident: false,
        liveActions: null,
        processed: true,
        error: `Incident detection failed: ${String(err)}`,
      });
    }

    if (detectionResult.hasIncident && detectionResult.incidentDescription) {
      const contextIndex =
        detectionResult.propertyName != null
          ? (PROPERTY_TO_CONTEXT_INDEX[detectionResult.propertyName] ?? 0)
          : 0;

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

      try {
        const incidentResponse = await fetch(`${baseUrl}/api/incident`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: detectionResult.incidentDescription,
            contextIndex,
          }),
        });

        if (!incidentResponse.ok) {
          const errText = await incidentResponse.text();
          return NextResponse.json({
            callStatus,
            endedReason,
            transcript,
            incident: true,
            liveActions: null,
            error: `Incident API failed: ${incidentResponse.status} ${errText}`,
          });
        }

        const incidentData = await incidentResponse.json();

        return NextResponse.json({
          callStatus,
          endedReason,
          transcript,
          incident: true,
          liveActions: incidentData.liveActions ?? null,
          incidentData,
          processed: true,
        });
      } catch (err) {
        return NextResponse.json({
          callStatus,
          endedReason,
          transcript,
          incident: true,
          liveActions: null,
          processed: true,
          error: `Failed to call incident API: ${String(err)}`,
        });
      }
    }

    // Incident detection ran but no incident found
    return NextResponse.json({
      callStatus,
      endedReason,
      transcript,
      incident: false,
      liveActions: null,
      processed: true,
    });
  }

  // Call not ended or ended but transcript not yet available — keep polling
  return NextResponse.json({
    callStatus,
    endedReason,
    transcript,
    incident: false,
    liveActions: null,
    processed: false,
  });
}
