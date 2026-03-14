"use client";

import dynamic from "next/dynamic";

const Inner = dynamic(() => import("./map-animation-inner"), { ssr: false });

interface MapAnimationWrapperProps {
  lat: number;
  lng: number;
}

export function MapAnimationWrapper({ lat, lng }: MapAnimationWrapperProps) {
  return <Inner lat={lat} lng={lng} />;
}
