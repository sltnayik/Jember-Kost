"use client";

import L from "leaflet";
import { useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";

type Props = {
  onLocationSelect: (lat: number, lng: number) => void;
};

const markerIcon = L.divIcon({
  html: '<div style="width:16px;height:16px;border-radius:9999px;border:2px solid white;background:#16A34A;box-shadow:0 0 0 4px rgba(22,163,74,0.2)"></div>',
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export function LocationPicker({ onLocationSelect }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}
