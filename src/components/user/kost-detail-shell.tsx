"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { BadgeCheck, CalendarDays, CheckCircle2, Heart, MapPin, MessageCircle, Share2, Star, Users } from "lucide-react";
import { toast } from "sonner";

import { toggleFavorite } from "@/actions/favorites";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { KostDetailData } from "@/types/kosts";
import { formatCurrency, normalizeWhatsappNumber } from "@/lib/utils";

interface KostDetailShellProps {
  kost: KostDetailData;
}

export function KostDetailShell({ kost }: KostDetailShellProps) {
  const [selectedImage, setSelectedImage] = useState(kost.thumbnail_url ?? kost.images[0]?.image_url ?? "");
  const [isPending, startTransition] = useTransition();
  const whatsapp = useMemo(() => normalizeWhatsappNumber(kost.whatsapp), [kost.whatsapp]);

  const imageList = kost.images.length > 0 ? kost.images : [{ image_url: kost.thumbnail_url ?? "", id: kost.id }];

  function handleSelectImage(index: number) {
    const image = imageList[index];
    if (image?.image_url) {
      setSelectedImage(image.image_url);
    }
  }

  function handlePrevious() {
    const currentIndex = imageList.findIndex((image) => image.image_url === selectedImage);
    const prevIndex = currentIndex <= 0 ? imageList.length - 1 : currentIndex - 1;
    handleSelectImage(prevIndex);
  }

  function handleNext() {
    const currentIndex = imageList.findIndex((image) => image.image_url === selectedImage);
    const nextIndex = currentIndex >= imageList.length - 1 ? 0 : currentIndex + 1;
    handleSelectImage(nextIndex);
  }

  async function handleFavorite() {
    startTransition(async () => {
      const result = await toggleFavorite({ kostId: kost.id, path: `/kost/${kost.slug}` });
      if (!result.success) {
        toast.error(result.error ?? "Tidak dapat mengubah favorit.");
        return;
      }
      toast.success(result.isFavorited ? "Ditambahkan ke favorit." : "Dihapus dari favorit.");
    });
  }

  async function handleShare(option: "copy" | "whatsapp") {
    const shareUrl = window.location.href;

    if (option === "whatsapp") {
      const number = whatsapp?.replace(/\D/g, "") ?? "";
      window.open(`https://wa.me/${number}`, "_blank", "noopener,noreferrer");
      toast.success("Membuka WhatsApp pemilik kos.");
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link disalin ke clipboard.");
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-sm shadow-black/5">
          <div className="p-4 sm:p-5">
            <div className="relative aspect-4/3 overflow-hidden rounded-[1.5rem] bg-muted">
              {selectedImage ? <Image src={selectedImage} alt={kost.name} fill className="object-cover" unoptimized /> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Tidak ada foto tersedia</div>}
              <div className="absolute inset-x-4 bottom-4 flex justify-between gap-3">
                <Button type="button" variant="secondary" className="rounded-full bg-background/90 text-foreground shadow-sm" onClick={handlePrevious}>
                  Sebelumnya
                </Button>
                <Button type="button" variant="secondary" className="rounded-full bg-background/90 text-foreground shadow-sm" onClick={handleNext}>
                  Selanjutnya
                </Button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {imageList.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => handleSelectImage(imageList.findIndex((item) => item.id === image.id))}
                  className={`relative aspect-video overflow-hidden rounded-2xl border ${selectedImage === image.image_url ? "border-primary" : "border-border/70"}`}
                >
                  <Image src={image.image_url} alt={`${kost.name} preview`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2rem] border border-border/70 bg-background shadow-sm shadow-black/5">
            <CardContent className="space-y-5 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">{kost.district ?? "Jember"}</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{kost.name}</h1>
                </div>
                <BadgeCheck className="size-6 text-primary" />
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{kost.gender_type}</span>
                <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">{kost.room_available ?? 0} kamar tersedia</span>
                <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">{kost.status}</span>
              </div>

              <div className="rounded-3xl bg-linear-to-br from-primary/10 via-background to-background p-5">
                <p className="text-sm text-muted-foreground">Mulai dari</p>
                <p className="mt-2 text-4xl font-semibold text-foreground">{formatCurrency(kost.price)}</p>
                <p className="mt-2 text-sm text-muted-foreground">per bulan</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="rounded-2xl bg-primary px-5 text-primary-foreground" onClick={handleFavorite} disabled={isPending}>
                  <Heart className={`mr-2 size-4 ${kost.is_favorited ? "fill-current" : ""}`} />
                  {kost.is_favorited ? "Favorit" : "Tambah Favorit"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-2xl border-border/70 bg-background">
                      <Share2 className="mr-2 size-4" />
                      Bagikan
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl">
                    <DropdownMenuItem onClick={() => void handleShare("copy")}>Salin tautan</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => void handleShare("whatsapp")}>Bagikan ke WhatsApp</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {whatsapp ? (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
                >
                  <MessageCircle className="size-4" />
                  HUBUNGI PEMILIK
                </a>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-border/70 bg-background shadow-sm shadow-black/5">
            <CardHeader>
              <CardTitle>Informasi singkat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                {kost.address}
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                {kost.gender_type}
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" />
                {new Date(kost.created_at ?? Date.now()).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[2rem] border border-border/70 bg-background shadow-sm shadow-black/5">
          <CardHeader>
            <CardTitle>Deskripsi & aturan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">Deskripsi</p>
              <p className="mt-2">{kost.description ?? "Belum ada deskripsi tambahan."}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Aturan</p>
              <p className="mt-2">{kost.rules ?? "Tidak ada aturan khusus yang dicantumkan."}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-border/70 bg-background shadow-sm shadow-black/5">
          <CardHeader>
            <CardTitle>Fasilitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {kost.facilities.length > 0 ? (
                kost.facilities.map((facility) => (
                  <span key={facility.id} className="rounded-full border border-border/70 bg-muted px-3 py-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mr-2 inline size-4 text-primary" />
                    {facility.name}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada fasilitas yang terdaftar.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="rounded-[2rem] border border-border/70 bg-background shadow-sm shadow-black/5">
          <CardHeader>
            <CardTitle>Lokasi & kampus terdekat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-hidden rounded-[1.4rem] border border-border/70">
              <div className="aspect-video bg-muted" />
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">{kost.address}</p>
              <p className="mt-2">Kampus terdekat: {kost.campus?.name ?? "-"}</p>
              {kost.latitude && kost.longitude && kost.campus?.latitude && kost.campus?.longitude ? (
                <p className="mt-2">Jarak: {Math.round(Math.sqrt((kost.latitude - kost.campus.latitude) ** 2 + (kost.longitude - kost.campus.longitude) ** 2) * 111)} km</p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-border/70 bg-background shadow-sm shadow-black/5">
          <CardHeader>
            <CardTitle>Owner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-12 rounded-2xl">
                <AvatarImage src={kost.owner_avatar_url ?? undefined} alt={kost.owner_name ?? "Owner"} />
                <AvatarFallback className="rounded-2xl bg-primary/10 text-sm font-semibold text-primary">{(kost.owner_name ?? "Owner").slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{kost.owner_name ?? "Owner"}</p>
                <p className="text-sm text-muted-foreground">Pemilik kos</p>
              </div>
            </div>
            {whatsapp ? (
              <Button asChild className="w-full rounded-2xl bg-primary text-primary-foreground">
                <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 size-4" />
                  Hubungi pemilik
                </a>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[2rem] border border-border/70 bg-background shadow-sm shadow-black/5">
        <CardHeader>
          <CardTitle>Ulasan & rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-primary">
              <Star className="size-4 fill-current" />
              <span className="font-semibold">{kost.rating.average > 0 ? kost.rating.average.toFixed(1) : "Belum ada review"}</span>
            </div>
            <p className="text-sm text-muted-foreground">{kost.rating.count} review</p>
          </div>

          {kost.reviews.length > 0 ? (
            kost.reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{review.reviewer_name}</p>
                    <p className="text-sm text-muted-foreground">{new Date(review.created_at ?? Date.now()).toLocaleDateString("id-ID")}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-sm font-medium text-amber-600">
                    <Star className="size-4 fill-current" />
                    {review.rating}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{review.comment ?? "Tidak ada komentar."}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada ulasan untuk kos ini.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
