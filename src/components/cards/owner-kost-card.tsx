import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { formatRupiah } from "@/lib/utils/format-rupiah";

interface OwnerKostCardProps {
  id: string;
  name: string;
  price: number;
  room_total: number;
  room_available: number;
  facilities: string[];
}

export default function OwnerKostCard({
  id,
  name,
  price,
  room_total,
  room_available,
  facilities,
}: OwnerKostCardProps) {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="space-y-4">

        <div>
          <h3 className="text-xl font-semibold">
            {name}
          </h3>

          <p className="text-lg font-medium text-green-600">
            {formatRupiah(price)} / bulan
          </p>
        </div>

        <p className="text-muted-foreground">
          {room_available} dari {room_total} kamar tersedia
        </p>

        <div className="flex flex-wrap gap-2">
          {facilities.map((facility) => (
            <span
              key={facility}
              className="rounded-full bg-muted px-3 py-1 text-sm"
            >
              {facility}
            </span>
          ))}
        </div>

        <div className="flex gap-3">

          <Link
            href={`/owner/kost/${id}/edit`}
            className="flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-muted"
          >
            <Pencil size={16} />
            Edit
          </Link>

          <button
            className="flex items-center gap-2 rounded-xl border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Trash2 size={16} />
            Hapus
          </button>

        </div>

      </div>
    </div>
  );
}