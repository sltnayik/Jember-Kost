"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Heart, MapPin, Star, Users } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { toggleFavorite } from "@/actions/favorites";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { KostCardData } from "@/types/kosts";
import { formatCurrency } from "@/lib/utils";

interface KostCardProps {
  kost: KostCardData;
}

export default function KostCard({ kost }: KostCardProps) {
  const [isPending, startTransition] = useTransition();

  function handleFavorite(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    startTransition(async () => {
      const result = await toggleFavorite({ kostId: kost.id, path: `/kost/${kost.slug}` });
      if (!result.success) {
        toast.error(result.error ?? "Tidak dapat mengubah favorit.");
        return;
      }
      toast.success(result.isFavorited ? "Ditambahkan ke favorit." : "Dihapus dari favorit.");
    });
  }

  return (
    <Link href={`/kost/${kost.slug}`} className="group block">
      <Card className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-background shadow-sm shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-56 bg-muted">
          {kost.thumbnail_url ? (
            <Image src={kost.thumbnail_url} alt={kost.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Tidak ada foto</div>
          )}
          <button type="button" onClick={handleFavorite} className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/90 p-2 text-primary shadow-sm" disabled={isPending}>
            <Heart className={`size-4 ${kost.is_favorited ? "fill-current" : ""}`} />
          </button>
          {kost.is_verified ? (
            <Badge className="absolute left-3 top-3 rounded-full border-0 bg-primary/90 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
              <BadgeCheck className="mr-1 size-3" />
              Verified
            </Badge>
          ) : null}
        </div>

        <CardContent className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{kost.name}</h3>
              <div className="mt-1 flex items-center gap-1 text-amber-500">
                <Star className="size-4 fill-current" />
                <span className="text-sm font-medium">{kost.rating.average > 0 ? kost.rating.average.toFixed(1) : "Belum ada review"}</span>
              </div>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{kost.gender_type}</span>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1">
              <MapPin className="size-4 text-primary" />
              {kost.district ?? kost.address}
            </span>
            {kost.campus ? <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1">{kost.campus.name}</span> : null}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4 text-primary" />
            {kost.room_available ?? 0} / {kost.room_total ?? 0} kamar
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-lg font-semibold text-primary">{formatCurrency(kost.price)}</p>
              <p className="text-xs text-muted-foreground">/ bulan</p>
            </div>
            <Button className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">Lihat Detail</Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
