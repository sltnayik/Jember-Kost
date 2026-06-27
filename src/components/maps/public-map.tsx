"use client";

import "leaflet/dist/leaflet.css";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { useMemo } from "react";
import L from "leaflet";
import Link from "next/link";
import type { KostCardData } from "@/types/kosts";

type Props = {
  kosts: KostCardData[];
};

const defaultIcon = L.icon({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function PublicMap({ kosts }: Props) {
  const center: [number, number] = [-8.172, 113.7];
  const validKosts = useMemo(() => kosts.filter((kost) => kost.latitude != null && kost.longitude != null), [kosts]);

  return (
    <MapContainer center={center} zoom={13} className="h-full w-full">
      <TileLayer attribution="© OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {validKosts.map((kost) => {
        const position: [number, number] = [kost.latitude as number, kost.longitude as number];

        return (
          <Marker key={kost.id} position={position} icon={defaultIcon}>
            <Popup>
              <div className="space-y-2">
                {kost.thumbnail_url ? (
                  <img src={kost.thumbnail_url} alt={kost.name} className="h-24 w-full rounded-md object-cover" />
                ) : (
                  <div className="flex h-24 w-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">Tidak ada foto</div>
                )}

                <h3 className="font-semibold">{kost.name}</h3>
                <p className="text-sm text-muted-foreground">Rp{Number(kost.price ?? 0).toLocaleString("id-ID")}</p>
                <p className="text-sm">Sisa kamar: {kost.room_available ?? 0}</p>

                <Link href={`/kost/${kost.slug}`} className="inline-flex text-sm font-medium text-primary underline">
                  Lihat Detail
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
