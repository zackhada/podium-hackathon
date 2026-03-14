"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PropertySetupResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SetupCompleteScreenProps {
  result: PropertySetupResult;
  onBack: () => void;
}

export function SetupCompleteScreen({ result, onBack }: SetupCompleteScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const { zillowData, comparables, cleaningServices, attractions } = result;

  const badgeColor = (badge?: string) => {
    if (badge === "Recommended") return "bg-green-100 text-green-700";
    if (badge === "Premium") return "bg-purple-100 text-purple-700";
    if (badge === "Budget") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-600";
  };

  const sourceColor = (source: string) =>
    source === "airbnb" ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700";

  const attractionIcon = (category: string) => {
    const icons: Record<string, string> = {
      beach: "🏖️", restaurant: "🍽️", activity: "🏄", shopping: "🛍️", landmark: "🗺️",
    };
    return icons[category] ?? "📍";
  };

  return (
    <div
      className={cn(
        "fixed top-0 right-0 bottom-0 left-64 z-[1001] overflow-y-auto bg-white transition-transform duration-700 ease-out",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Setup Complete</h1>
              <p className="text-sm text-gray-500">{result.address}</p>
            </div>
          </div>
          <button onClick={onBack} className="text-sm text-accent hover:underline">
            ← Back to map
          </button>
        </div>

        {/* Property Card with Street View hero */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-6">
          <div className="relative h-56 bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/street-view?lat=${result.location.lat}&lng=${result.location.lng}`}
              alt="Street View"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-5">
              <h2 className="text-xl font-bold text-white">{result.displayName}</h2>
              <p className="text-sm text-white/75">
                {zillowData.propertyType} · Built {zillowData.yearBuilt} · {zillowData.sqft.toLocaleString()} sqft · {zillowData.bedrooms}BR / {zillowData.bathrooms}BA
              </p>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-white font-medium">Street View</span>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Est. Value" value={`$${(zillowData.estimatedValue / 1_000_000).toFixed(2)}M`} />
              <StatCard label="Nightly Rate" value={`$${zillowData.suggestedNightlyRate}/night`} />
              <StatCard label="Annual Revenue" value={`$${(zillowData.projectedAnnualRevenue / 1000).toFixed(0)}K`} />
              <StatCard label="Occupancy Est." value={`${zillowData.occupancyEstimate}%`} />
            </div>
          </div>
        </div>

        {/* Comparables — full width with photo cards */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Comparable Listings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {comparables.map((comp) => (
              <div key={comp.id} className="rounded-xl border border-gray-100 overflow-hidden">
                {comp.image && (
                  <div className="relative h-36 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={comp.image}
                      alt={comp.name}
                      className="w-full h-full object-cover"
                    />
                    <span className={cn("absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full capitalize", sourceColor(comp.source))}>
                      {comp.source}
                    </span>
                  </div>
                )}
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 leading-snug mb-1">{comp.name}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {comp.rating} · {comp.reviewCount} reviews
                    </div>
                    <p className="text-sm font-bold text-gray-900">${comp.nightlyRate}/night</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{comp.distanceMiles} mi away · {comp.occupancy}% occ.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-column: Cleaning + Attractions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cleaning Services */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Cleaning Services</h3>
            <div className="space-y-3">
              {cleaningServices.map((svc) => (
                <div key={svc.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-gray-900">{svc.name}</p>
                      {svc.badge && (
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", badgeColor(svc.badge))}>
                          {svc.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {svc.rating} · {svc.reviewCount} reviews · {svc.turnaroundHours}hr turnaround
                    </div>
                  </div>
                  <p className="text-base font-bold text-gray-900 ml-3">${svc.pricePerTurnover}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Attractions */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Nearby Attractions</h3>
            <div className="space-y-2">
              {attractions.map((attr) => (
                <div key={attr.name} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                  <span className="text-xl">{attractionIcon(attr.category)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{attr.name}</p>
                    <p className="text-xs text-gray-500">{attr.distanceMiles} mi · ⭐ {attr.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button asChild className="bg-accent hover:bg-accent/90 text-white font-semibold px-6">
            <Link href="/">Add to Portfolio</Link>
          </Button>
          <Button variant="outline" className="font-semibold px-6">
            Save as Draft
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}
