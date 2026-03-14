import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { guestPhone, guestName, propertyName, propertyId } = await req.json();

  const apiKey = process.env.VAPI_API_KEY;
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;

  if (!apiKey) {
    return NextResponse.json({ error: "VAPI_API_KEY not configured" }, { status: 500 });
  }
  if (!phoneNumberId) {
    return NextResponse.json({ error: "VAPI_PHONE_NUMBER_ID not configured — create a phone number at dashboard.vapi.ai then add its ID to .env" }, { status: 500 });
  }

  // Normalize to E.164 format required by VAPI (e.g. "+1 (949) 685-8843" → "+19496858843")
  const e164Phone = "+" + guestPhone.replace(/\D/g, "").replace(/^1/, "1");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const vapiPayload = {
    phoneNumberId,
    customer: {
      number: e164Phone,
      name: guestName,
    },
    assistant: {
      name: "PropBot",
      server: {
        url: `${baseUrl}/api/vapi/webhook`,
      },
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are PropBot, a friendly AI assistant managing vacation rentals for ${propertyName} in Honolulu, Hawaii. You are calling guest ${guestName} to check in on their stay.

Your goals:
1. Greet them warmly and ask how their stay is going
2. Listen carefully for any issues: AC/heating, plumbing, wifi/internet, appliances, cleanliness, missing supplies, noise, safety, lock/access problems, broken fixtures
3. If they mention a problem, ask for specifics (location, severity, how long it has been happening)
4. Reassure them you will dispatch help right away
5. Keep the call brief and professional — under 2 minutes

Be warm, concise, and conversational. This is a phone call so keep each response to 1-2 sentences.`,
          },
        ],
      },
      voice: {
        provider: "11labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM",
      },
      firstMessage: `Hi ${guestName}! This is PropBot calling from ${propertyName}. I'm just checking in to make sure everything is going great with your stay. How's everything so far?`,
      endCallMessage: "Great, I'll make sure everything is taken care of for you right away. Enjoy the rest of your stay in Hawaii!",
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
    console.error("[VAPI] call failed:", JSON.stringify(data));
    return NextResponse.json(
      { error: data.message || "VAPI call failed", details: data },
      { status: response.status }
    );
  }

  return NextResponse.json({ callId: data.id, status: data.status });
}
