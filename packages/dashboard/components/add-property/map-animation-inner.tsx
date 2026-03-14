"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FlyController } from "./fly-controller";

interface MapAnimationInnerProps {
  lat: number;
  lng: number;
}

export default function MapAnimationInner({ lat, lng }: MapAnimationInnerProps) {
  const [showLight, setShowLight] = useState(false);
  const [hideGlobe, setHideGlobe] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowLight(true), 3000);
    const t2 = setTimeout(() => setHideGlobe(true), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 bottom-0 left-64 z-40">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_matter_all/{z}/{x}/{y}{r}.png"
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          opacity={showLight ? 1 : 0}
          className="transition-opacity duration-1000"
        />
        <FlyController lat={lat} lng={lng} />
      </MapContainer>

      {/* Globe pulse overlay */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700"
        style={{ opacity: hideGlobe ? 0 : 1 }}
      >
        <div className="relative flex items-center justify-center w-64 h-64">
          <span className="absolute inline-flex h-64 w-64 rounded-full border border-white/20 animate-ping opacity-30" />
          <div className="w-64 h-64 rounded-full border border-white/20" />
        </div>
      </div>
    </div>
  );
}
