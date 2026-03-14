import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { address, lat, lng } = await req.json();

  const prompt = `You are a vacation rental market analyst with deep knowledge of real estate values and short-term rental markets across the US and globally.

Given this property address and coordinates, provide a realistic market analysis as if you scraped Zillow and analyzed Airbnb/VRBO listings.

Address: ${address}
Coordinates: ${lat}, ${lng}

Return ONLY a valid JSON object with NO markdown, NO code blocks — just raw JSON matching this exact structure:

{
  "zillowData": {
    "estimatedValue": <realistic home value in USD for this specific market>,
    "bedrooms": <typical for this market, 1-4>,
    "bathrooms": <typical for this market>,
    "sqft": <realistic sqft>,
    "yearBuilt": <realistic year>,
    "propertyType": <"Condo" | "House" | "Studio" | "Townhouse" | "Apartment">,
    "suggestedNightlyRate": <realistic Airbnb rate for this location>,
    "projectedAnnualRevenue": <realistic annual revenue>,
    "occupancyEstimate": <realistic occupancy % as integer>
  },
  "comparables": [
    {
      "id": "comp-1",
      "name": <creative realistic Airbnb listing name>,
      "nightlyRate": <realistic rate slightly below suggested>,
      "occupancy": <realistic occupancy %>,
      "source": "airbnb",
      "distanceMiles": <0.2-0.6>,
      "rating": <4.7-4.95>,
      "reviewCount": <50-300>,
      "imageKeyword": <one of: "beachfront-condo" | "mountain-cabin" | "urban-apartment" | "beach-house" | "desert-home" | "lake-house" | "ski-chalet" | "city-loft" | "tropical-villa" | "coastal-cottage" — pick the most fitting for this location>
    },
    {
      "id": "comp-2",
      "name": <creative realistic Airbnb listing name>,
      "nightlyRate": <realistic rate close to suggested>,
      "occupancy": <realistic occupancy %>,
      "source": "airbnb",
      "distanceMiles": <0.4-1.0>,
      "rating": <4.6-4.9>,
      "reviewCount": <40-250>,
      "imageKeyword": <same options as above>
    },
    {
      "id": "comp-3",
      "name": <creative realistic VRBO listing name>,
      "nightlyRate": <realistic rate slightly above suggested>,
      "occupancy": <realistic occupancy %>,
      "source": "vrbo",
      "distanceMiles": <0.5-1.5>,
      "rating": <4.7-4.95>,
      "reviewCount": <30-200>,
      "imageKeyword": <same options as above>
    }
  ],
  "attractions": [
    {
      "name": <real or realistic local attraction name>,
      "category": <"beach" | "restaurant" | "activity" | "shopping" | "landmark">,
      "distanceMiles": <realistic distance>,
      "rating": <4.0-5.0>
    },
    <4 more — mix of categories, all realistic for this exact location>
  ],
  "cleaningServices": [
    {
      "id": "clean-1",
      "name": <local-sounding cleaning service name>,
      "pricePerTurnover": <market-appropriate low price>,
      "rating": 4.4,
      "reviewCount": 67,
      "turnaroundHours": 3,
      "badge": "Budget"
    },
    {
      "id": "clean-2",
      "name": <local-sounding cleaning service name>,
      "pricePerTurnover": <market-appropriate mid price>,
      "rating": 4.8,
      "reviewCount": 142,
      "turnaroundHours": 2,
      "badge": "Recommended"
    },
    {
      "id": "clean-3",
      "name": <local-sounding cleaning service name>,
      "pricePerTurnover": <market-appropriate premium price>,
      "rating": 4.9,
      "reviewCount": 88,
      "turnaroundHours": 1.5,
      "badge": "Premium"
    }
  ]
}

Be specific to the actual location. For example, if near a beach, reflect beach rental premiums. If urban NYC, reflect Manhattan prices. If rural, reflect lower rates. Use real local attraction names when you know them.`;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  // Strip any accidental markdown fences
  const json = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const data = JSON.parse(json);

  return NextResponse.json(data);
}
