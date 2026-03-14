"use client";

import dynamic from "next/dynamic";

const MapInner = dynamic(() => import("./property-map-inner"), { ssr: false });

export function PropertyMap() {
  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-border">
      <MapInner />
    </div>
  );
}
