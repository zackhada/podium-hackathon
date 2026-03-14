import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { guestPhone, guestName, callbackScript } = await req.json();

  const apiKey = process.env.VAPI_API_KEY;
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;

  if (!apiKey) {
    return NextResponse.json({ error: "VAPI_API_KEY not configured" }, { status: 500 });
  }
  if (!phoneNumberId) {
    return NextResponse.json(
      { error: "VAPI_PHONE_NUMBER_ID not configured" },
      { status: 500 }
    );
  }

  // Normalize to E.164
  const e164Phone = "+" + guestPhone.replace(/\D/g, "").replace(/^1/, "1");

  const vapiPayload = {
    phoneNumberId,
    customer: {
      number: e164Phone,
      name: guestName,
    },
    assistant: {
      name: "PropBot",
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are PropBot, a friendly AI assistant for a vacation rental. You are calling back a guest to deliver a resolution to their reported issue. Deliver the resolution message clearly and warmly, then end the call. Keep it brief.`,
          },
        ],
      },
      voice: {
        provider: "11labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM",
      },
      firstMessage: callbackScript,
      endCallMessage: "Thank you for your patience. Have a wonderful rest of your stay!",
    },
  };

  const response = await fetch("https://api.vapi.ai/call/phone", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vapiPayload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("[VAPI] callback call failed:", JSON.stringify(data));
    return NextResponse.json(
      { error: data.message || "VAPI callback failed", details: data },
      { status: response.status }
    );
  }

  return NextResponse.json({ callId: data.id, status: data.status });
}
