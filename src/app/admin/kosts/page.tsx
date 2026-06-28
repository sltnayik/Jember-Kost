import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils/format-rupiah";

type AdminKostStatus = "pending" | "available" | "full" | "rejected" | string | null;

type RelationValue<T> = T | T[] | null;

type AdminKostRow = {
  id: string;
  name: string;
  status: AdminKostStatus;
  is_verified: boolean | null;
  price: number;
  created_at: string | null;
  campuses: RelationValue<{
    name: string;
  }>;
  profiles: RelationValue<{
    full_name: string;
  }>;
};

function getFirstRelation<T>(relation: RelationValue<T> | undefined) {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation ?? null;
}

function formatCreatedAt(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusLabel(status: AdminKostStatus, isVerified: boolean | null) {
  if (status === "rejected") {
    return "Ditolak";
  }

  if (status === "pending") {
    return "Menunggu Verifikasi";
  }

  if (status === "full") {
    return "Penuh";
  }

  if (isVerified || status === "available") {
    return "Disetujui";
  }

  return "Tidak diketahui";
}

function getStatusVariant(status: AdminKostStatus, isVerified: boolean | null) {
  if (status === "rejected") {
    return "destructive" as const;
  }

  if (isVerified || status === "available") {
    return "default" as const;
  }

  return "secondary" as const;
}

export default async function AdminKostsPage() {
  const supabase = await createClient();
  const { data: kosts, error } = await supabase
    .from("kosts")
    .select(
      `
        id,
        name,
        status,
        is_verified,
        price,
        created_at,
        campuses(name),
        profiles(full_name)
      `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const adminKosts = ((kosts ?? []) as unknown as AdminKostRow[]).map((kost) => ({
    id: kost.id,
    name: kost.name,
    status: kost.status,
    is_verified: kost.is_verified,
    price: kost.price,
    created_at: kost.created_at,
    campus: getFirstRelation(kost.campuses),
    owner: getFirstRelation(kost.profiles),
  }));

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0F172A]">Kelola Kos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Daftar seluruh kos yang terdaftar di JemberKost.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kos</TableHead>
              <TableHead>Pemilik</TableHead>
              <TableHead>Kampus Terdekat</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {adminKosts.map((kost) => (
              <TableRow key={kost.id}>
                <TableCell className="font-medium">{kost.name}</TableCell>
                <TableCell>{kost.owner?.full_name ?? "-"}</TableCell>
                <TableCell>{kost.campus?.name ?? "-"}</TableCell>
                <TableCell>{formatRupiah(kost.price)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(kost.status, kost.is_verified)}>
                    {getStatusLabel(kost.status, kost.is_verified)}
                  </Badge>
                </TableCell>
                <TableCell>{formatCreatedAt(kost.created_at)}</TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/kost/${kost.id}`}>Lihat Detail</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {adminKosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Belum ada data kos.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
