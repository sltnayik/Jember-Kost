"use client";

import { MapContainer, TileLayer } from "react-leaflet";

import { LocationPicker } from "./location-picker";

type Props = {
  onChange: (lat: number, lng: number) => void;
};

export default function KostLocationMap({ onChange }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#16A34A]/15 shadow-sm">
      <MapContainer center={[-8.1723, 113.7008]} zoom={13} scrollWheelZoom className="h-95 w-full" style={{ height: "380px", width: "100%" }}>
        <TileLayer attribution="© OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <LocationPicker onLocationSelect={onChange} />
      </MapContainer>
    </div>
  );
}
