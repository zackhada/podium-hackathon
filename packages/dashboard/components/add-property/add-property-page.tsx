"use client";

import { useState, useRef } from "react";
import { AddressInputScreen } from "./address-input-screen";
import { MapAnimationWrapper } from "./map-animation-wrapper";
import { SetupOverlay } from "./setup-overlay";
import { SetupCompleteScreen } from "./setup-complete-screen";
import { StreetViewCard } from "./street-view-card";
import type { PropertySetupResult } from "@/lib/types";

type Phase = "input" | "flying" | "complete";

// Maps imageKeyword returned by Claude to curated Unsplash photo IDs
const IMAGE_MAP: Record<string, string> = {
  "beachfront-condo":  "photo-1566073771259-6a8506099945",
  "beach-house":       "photo-1499793983690-e29da59ef1c2",
  "urban-apartment":   "photo-1522708323590-d24dbb6b0267",
  "city-loft":         "photo-1522708323590-d24dbb6b0267",
  "mountain-cabin":    "photo-1542718610-a1d656d1884c",
  "ski-chalet":        "photo-1542718610-a1d656d1884c",
  "lake-house":        "photo-1464822759023-fed622ff2c3b",
  "desert-home":       "photo-1512917774080-9991f1c4c750",
  "tropical-villa":    "photo-1613977257363-707ba9348227",
  "coastal-cottage":   "photo-1507525428034-b723cf961d3e",
};
const FALLBACK_IMAGES = [
  "photo-1600596542815-ffad4c1539a9",
  "photo-1580587771525-78b9dba3b914",
  "photo-1564013799919-ab600027ffc6",
];

function resolveImage(keyword?: string, fallbackIdx = 0): string {
  const id = (keyword && IMAGE_MAP[keyword]) || FALLBACK_IMAGES[fallbackIdx % FALLBACK_IMAGES.length];
  return `https://images.unsplash.com/${id}?w=640&h=360&fit=crop&auto=format`;
}

export default function AddPropertyPage() {
  const [phase, setPhase] = useState<Phase>("input");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [setupResult, setSetupResult] = useState<PropertySetupResult | null>(null);

  // Holds the in-flight API promise so the overlay and fetch can race
  const apiPromiseRef = useRef<Promise<PropertySetupResult> | null>(null);

  function handleAddressSubmit(addr: string, lat: number, lng: number) {
    setAddress(addr);
    setCoords({ lat, lng });
    setPhase("flying");

    // Kick off AI analysis immediately in parallel with the map animation
    apiPromiseRef.current = fetch("/api/analyze-property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: addr, lat, lng }),
    })
      .then((r) => r.json())
      .then((data) => ({
        address: addr,
        displayName: addr.split(",")[0],
        location: { lat, lng },
        zillowData: data.zillowData,
        comparables: (data.comparables as Array<{ imageKeyword?: string } & Record<string, unknown>>).map(
          (c, i) => ({ ...c, image: resolveImage(c.imageKeyword, i) })
        ),
        attractions: data.attractions,
        cleaningServices: data.cleaningServices,
      } as PropertySetupResult));
  }

  async function handleOverlayComplete() {
    // Overlay animation is done — await the API result (usually already resolved)
    const result = await apiPromiseRef.current;
    if (result) {
      setSetupResult(result);
      setPhase("complete");
    }
  }

  return (
    <>
      {phase === "input" && (
        <AddressInputScreen onSubmit={handleAddressSubmit} />
      )}

      {(phase === "flying" || phase === "complete") && coords && (
        <MapAnimationWrapper lat={coords.lat} lng={coords.lng} />
      )}

      {phase === "flying" && coords && (
        <>
          <SetupOverlay address={address} onComplete={handleOverlayComplete} />
          <StreetViewCard lat={coords.lat} lng={coords.lng} address={address} />
        </>
      )}

      {phase === "complete" && setupResult && (
        <SetupCompleteScreen
          result={setupResult}
          onBack={() => setPhase("flying")}
        />
      )}
    </>
  );
}
