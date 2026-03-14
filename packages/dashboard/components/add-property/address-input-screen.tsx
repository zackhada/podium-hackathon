"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PropBotIcon } from "@/components/ui/prop-bot-icon";
import { Button } from "@/components/ui/button";

interface AddressInputScreenProps {
  onSubmit: (address: string, lat: number, lng: number) => void;
}

export function AddressInputScreen({ onSubmit }: AddressInputScreenProps) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      if (res.ok) {
        const { lat, lng, formattedAddress } = await res.json();
        onSubmit(formattedAddress ?? address, lat, lng);
        return;
      }
    } catch {
      // fall through to Nominatim fallback
    }

    // Fallback: Nominatim
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data?.length > 0) {
        onSubmit(address, parseFloat(data[0].lat), parseFloat(data[0].lon));
        return;
      }
    } catch {
      // fall through
    }

    setError("Couldn't find that address. Try adding a city or zip code.");
    setLoading(false);
  }

  return (
    <div className="fixed top-0 right-0 bottom-0 left-64 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-10 max-w-lg w-full mx-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
            <PropBotIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">PropBot</h1>
            <p className="text-xs text-white/50">AI Property Setup</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">Add a New Property</h2>
        <p className="text-white/60 mb-8 text-sm leading-relaxed">
          Enter the property address and PropBot will automatically pull pricing data,
          find comparable listings, and connect your services.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Ocean Drive, Miami, FL"
              className="w-full rounded-xl border border-white/15 px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.06)" }}
              disabled={loading}
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>

          <Button
            type="submit"
            disabled={loading || !address.trim()}
            className="w-full rounded-xl py-3.5 font-semibold text-sm bg-accent hover:bg-accent/90 text-white disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Looking up address...
              </span>
            ) : (
              "Set Up Property →"
            )}
          </Button>
        </form>

        <p className="mt-6 text-xs text-white/30 text-center">
          PropBot will analyze the market, scan comparables, and pull a Street View photo
        </p>
      </div>
    </div>
  );
}
