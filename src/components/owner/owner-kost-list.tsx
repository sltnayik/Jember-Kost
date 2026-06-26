"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BedDouble, Camera, CheckSquare, DoorOpen, Eye, Pencil, Search, SlidersHorizontal } from "lucide-react";

import { DeleteKostButton } from "@/components/owner/delete-kost-button";
import { OwnerStatusBadge } from "@/components/owner/owner-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmptyState from "@/components/shared/empty-state";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import type { OwnerKostListItem, VerificationStatus } from "@/services/owner.service";

const PAGE_SIZE = 6;
const statusOptions = ["all", "pending", "approved", "rejected"] as const;

type StatusFilter = (typeof statusOptions)[number];

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function OwnerKostList({ kosts }: { kosts: OwnerKostListItem[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const filteredKosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return kosts.filter((kost) => {
      const matchesQuery = normalizedQuery.length === 0 || kost.name.toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === "all" || kost.verificationStatus === (status as VerificationStatus);

      return matchesQuery && matchesStatus;
    });
  }, [kosts, query, status]);

  const pageCount = Math.max(1, Math.ceil(filteredKosts.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleKosts = filteredKosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateStatus(value: string) {
    setStatus(statusOptions.includes(value as StatusFilter) ? (value as StatusFilter) : "all");
    setPage(1);
  }

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  return (
    <div className="space-y-5">
      <Card className="rounded-2xl bg-white p-4 shadow-sm shadow-slate-950/5">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Cari nama kos" className="h-10 pl-9" />
          </div>
          <Select value={status} onValueChange={updateStatus}>
            <SelectTrigger className="h-10 w-full">
              <SlidersHorizontal className="size-4" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {visibleKosts.length > 0 ? (
        <div className="grid gap-5">
          {visibleKosts.map((kost) => (
            <Card key={kost.id} className="rounded-2xl bg-white p-4 shadow-sm shadow-slate-950/5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                  {kost.thumbnailUrl ? (
                    <Image src={kost.thumbnailUrl} alt={kost.name} fill sizes="(min-width: 768px) 220px, 100vw" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Belum ada foto</div>
                  )}
                </div>
                <div className="min-w-0 space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="truncate text-xl font-semibold text-[#0F172A]">{kost.name}</h2>
                      <p className="mt-1 text-lg font-semibold text-[#16A34A]">{formatRupiah(kost.price)} / bulan</p>
                    </div>
                    <OwnerStatusBadge status={kost.verificationStatus} />
                  </div>
                  <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                    <span className="flex items-center gap-2">
                      <BedDouble className="size-4 text-[#16A34A]" />
                      {kost.room_available ?? 0} dari {kost.room_total ?? 0} kamar
                    </span>
                    <span>Dibuat {formatDate(kost.created_at)}</span>
                    <span>Urutan terbaru</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/owner/kost/${kost.id}`}>
                        <Eye />
                        Detail
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/owner/kost/${kost.id}/edit`}>
                        <Pencil />
                        Edit
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/owner/kost/${kost.id}/photos`}>
                        <Camera />
                        Foto
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/owner/kost/${kost.id}/facilities`}>
                        <CheckSquare />
                        Fasilitas
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/owner/kost/${kost.id}/rooms`}>
                        <DoorOpen />
                        Kamar
                      </Link>
                    </Button>
                    <DeleteKostButton kostId={kost.id} kostName={kost.name} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl bg-white shadow-sm shadow-slate-950/5">
          <EmptyState title="Kos tidak ditemukan" description="Coba ubah kata kunci atau filter status." />
        </Card>
      )}

      {filteredKosts.length > PAGE_SIZE ? (
        <div className="flex items-center justify-between rounded-2xl border bg-white p-3 text-sm shadow-sm shadow-slate-950/5">
          <span className="text-muted-foreground">
            Halaman {currentPage} dari {pageCount}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>
              Berikutnya
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
