"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

interface StreetViewCardProps {
  lat: number;
  lng: number;
  address: string;
}

export function StreetViewCard({ lat, lng, address }: StreetViewCardProps) {
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Appear after flyTo has had time to zoom in (~4s)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const src = `/api/street-view?lat=${lat}&lng=${lng}`;

  return (
    <div
      className="fixed bottom-8 left-[calc(16rem+2rem)] z-[999] transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-gray-900 w-80">
        <div className="relative h-44 bg-gray-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="Street View"
            className="w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
          />
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            </div>
          )}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white font-medium">Street View</span>
          </div>
        </div>
        <div className="px-3.5 py-3 flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-accent flex-shrink-0" />
          <p className="text-xs text-white/70 truncate">{address}</p>
        </div>
      </div>
    </div>
  );
}
