"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface FlyControllerProps {
  lat: number;
  lng: number;
  onReady?: () => void;
}

export function FlyController({ lat, lng, onReady }: FlyControllerProps) {
  const map = useMap();

  useEffect(() => {
    const t = setTimeout(() => {
      map.flyTo([lat, lng], 17, { animate: true, duration: 4.5, easeLinearity: 0.1 });
      onReady?.();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
