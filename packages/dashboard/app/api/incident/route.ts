import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const CONTEXTS = [
  { property: "Waikiki Beachfront Condo", propertyId: "prop-1", guest: "Jim Christian", time: "2:14 AM" },
  { property: "Diamond Head Ocean Suite", propertyId: "prop-2", guest: "James Park", time: "7:22 PM" },
  { property: "Kailua Beach House", propertyId: "prop-3", guest: "Robert Kim", time: "11:48 PM" },
  { property: "Waikiki Studio Retreat", propertyId: "prop-4", guest: "David Brown", time: "9:15 PM" },
  { property: "Manoa Valley Townhouse", propertyId: "prop-5", guest: "Chris Martinez", time: "3:40 PM" },
];

export async function POST(req: NextRequest) {
  const { description, contextIndex } = await req.json();

  const ctx =
    contextIndex != null
      ? CONTEXTS[contextIndex % CONTEXTS.length]
      : CONTEXTS[Math.floor(Math.random() * CONTEXTS.length)];

  const prompt = `You are OpenClaw, an AI property management agent for vacation rentals in Honolulu, Hawaii.

A property manager has reported the following incident:
- Property: ${ctx.property}
- Guest: ${ctx.guest}
- Time: ${ctx.time}
- Incident: ${description}

Generate a realistic, professional incident response. Return ONLY valid JSON — no markdown fences, no comments, just raw JSON — with this exact structure:

{
  "propertyName": "${ctx.property}",
  "propertyId": "${ctx.propertyId}",
  "thinkingTrace": [
    "Parsing incident signal...",
    "Property: ${ctx.property} · Guest: ${ctx.guest} · ${ctx.time}",
    "<check relevant maintenance or history, e.g. 'Checking AC log...' or 'Reviewing plumbing history...'>",
    "<root cause diagnosis with confidence, e.g. 'Root cause: loose fan bracket — 94% confidence'>",
    "Drafting 3-action response plan..."
  ],
  "script": [
    { "text": "Calling from ${ctx.property}.", "dim": true },
    { "text": "<${ctx.guest} messaged at ${ctx.time} — describe the incident naturally, end with a relevant emoji>", "dim": false },
    { "text": "<your diagnosis / what data or history informed it>", "dim": false },
    { "text": "Here's my plan:", "dim": false }
  ],
  "actionItems": [
    {
      "iconType": "<wrench | cart | calendar | message | wifi | droplets | lock | thermometer>",
      "label": "<action with timing, e.g. 'Steve\\'s Plumbing emergency · Tonight'>",
      "cost": "<'$150' or '—'>"
    },
    {
      "iconType": "<icon>",
      "label": "<second action>",
      "cost": "<cost or '—'>"
    },
    {
      "iconType": "<icon>",
      "label": "<third action>",
      "cost": "<cost or '—'>"
    }
  ],
  "total": "<total like '$239' — sum of numeric costs>",
  "totalLabel": "<short confident resolution phrase, e.g. 'Resolved before guest wakes up'>",
  "liveActions": [
    {
      "category": "<cleaning | amazon | repair | pricing | messaging | calendar>",
      "title": "<short title>",
      "description": "<1-2 sentence description of the action taken>",
      "status": "<'completed' | 'in-progress'>",
      "cost": <number or null>,
      "reasoning": "<specific reasoning chain: what signal triggered this → what data was checked → why this vendor → cost vs threshold → outcome>"
    },
    { "category": "...", "title": "...", "description": "...", "status": "...", "cost": null, "reasoning": "..." },
    { "category": "...", "title": "...", "description": "...", "status": "completed", "cost": null, "reasoning": "..." }
  ]
}

Use real Honolulu vendors where relevant:
- HVAC/AC: Standard Air Hawaii (808) 302-0644
- Plumbing: Steve's Plumbing & A/C Service
- Handyman: Kama'aina Handyman (808) 393-1163, Handy Andy Hawaii (veteran-owned)
- Appliances: Oahu Appliance Repair Service (808) 561-4833, Honolulu Appliance Repair Pro
- Cleaning: Waikiki Housekeeping (808) 763-9877, VacayClean (Maid in Oahu), Bolt Laundry
- Supplies: Instacart from Foodland Farms, Longs Drugs, Costco Iwilei, Don Quijote

The reasoning field should be detailed and chain-of-thought style. Make the scenario feel urgent but handled with calm professionalism.`;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  const json = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const data = JSON.parse(json);

  return NextResponse.json(data);
}
