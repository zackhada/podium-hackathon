"use client";

import dynamic from "next/dynamic";

const MapPageInner = dynamic(() => import("./map-page-inner"), { ssr: false });

export function MapPage() {
  return (
    <div className="-m-8" style={{ height: "100vh" }}>
      <MapPageInner />
    </div>
  );
}
