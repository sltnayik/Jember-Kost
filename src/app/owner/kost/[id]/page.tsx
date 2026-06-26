import Image from "next/image";
import Link from "next/link";
import { BedDouble, Camera, CheckCircle2, Edit, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

import { DeleteKostButton } from "@/components/owner/delete-kost-button";
import { OwnerShell } from "@/components/owner/owner-shell";
import { OwnerStatCard } from "@/components/owner/owner-stat-card";
import { OwnerStatusBadge } from "@/components/owner/owner-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { getOwnerKostDetail, resolveVerificationStatus } from "@/services/owner.service";

type Props = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default async function OwnerKostDetailPage({ params }: Props) {
  const { id } = await params;
  const kost = await getOwnerKostDetail(id);
  const verificationStatus = resolveVerificationStatus(kost, kost.verification);
  const thumbnail = kost.images.find((image) => image.is_thumbnail) ?? kost.images[0] ?? null;
  const mapSrc =
    kost.latitude != null && kost.longitude != null
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${kost.longitude - 0.01}%2C${kost.latitude - 0.01}%2C${kost.longitude + 0.01}%2C${kost.latitude + 0.01}&layer=mapnik&marker=${kost.latitude}%2C${kost.longitude}`
      : null;

  return (
    <OwnerShell
      title={kost.name}
      description="Detail lengkap kos, status, lokasi, foto, dan fasilitas."
      action={
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="h-10 rounded-xl">
            <Link href={`/owner/kost/${kost.id}/edit`}>
              <Edit />
              Edit
            </Link>
          </Button>
          <DeleteKostButton kostId={kost.id} kostName={kost.name} />
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OwnerStatCard title="Harga" value={`${formatRupiah(kost.price)}`} icon={ShieldCheck} tone="green" />
        <OwnerStatCard title="Total Kamar" value={kost.room_total ?? 0} icon={BedDouble} tone="blue" />
        <OwnerStatCard title="Kamar Tersedia" value={kost.room_available ?? 0} icon={BedDouble} tone="green" />
        <div className="rounded-2xl border bg-white p-5 shadow-sm shadow-slate-950/5">
          <p className="text-sm text-muted-foreground">Status</p>
          <div className="mt-4">
            <OwnerStatusBadge status={verificationStatus} />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Dibuat {formatDate(kost.created_at)}</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <Card className="rounded-2xl bg-white shadow-sm shadow-slate-950/5">
          <CardHeader className="border-b bg-green-50/60">
            <CardTitle>Gallery foto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
              {thumbnail ? (
                <Image src={thumbnail.image_url} alt={kost.name} fill priority sizes="(min-width: 1280px) 60vw, 100vw" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Belum ada foto</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {kost.images.map((image, index) => (
                <div key={image.id} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                  <Image src={image.image_url} alt={`${kost.name} ${index + 1}`} fill sizes="25vw" className="object-cover" />
                </div>
              ))}
            </div>
            <Button asChild variant="outline">
              <Link href={`/owner/kost/${kost.id}/photos`}>
                <Camera />
                Kelola foto
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white shadow-sm shadow-slate-950/5">
          <CardHeader className="border-b bg-green-50/60">
            <CardTitle>Informasi lengkap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Info label="Alamat" value={kost.address} />
            <Info label="Kecamatan" value={kost.district ?? "-"} />
            <Info label="Gender" value={kost.gender_type} />
            <Info label="Kampus terdekat" value={kost.campus?.name ?? "-"} />
            <Info label="WhatsApp" value={kost.whatsapp ?? "-"} />
            <Info label="Tanggal dibuat" value={formatDate(kost.created_at)} />
            {kost.whatsapp ? (
              <Button asChild className="w-full bg-[#16A34A] hover:bg-[#15803D]">
                <a href={`https://wa.me/${kost.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                  <MessageCircle />
                  Hubungi WhatsApp
                </a>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="rounded-2xl bg-white shadow-sm shadow-slate-950/5">
          <CardHeader className="border-b bg-green-50/60">
            <CardTitle>Deskripsi dan rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <TextBlock title="Deskripsi" value={kost.description ?? "Belum ada deskripsi."} />
            <TextBlock title="Rules" value={kost.rules ?? "Belum ada rules."} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white shadow-sm shadow-slate-950/5">
          <CardHeader className="border-b bg-green-50/60">
            <CardTitle>Fasilitas</CardTitle>
          </CardHeader>
          <CardContent>
            {kost.facilities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {kost.facilities.map((facility) => (
                  <span key={facility.id} className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-sm text-green-700">
                    <CheckCircle2 className="size-4" />
                    {facility.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada fasilitas dipilih.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl bg-white shadow-sm shadow-slate-950/5">
        <CardHeader className="border-b bg-green-50/60">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5 text-[#16A34A]" />
            Lokasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mapSrc ? (
            <iframe title={`Peta ${kost.name}`} src={mapSrc} className="h-80 w-full rounded-xl border" loading="lazy" />
          ) : (
            <p className="text-sm text-muted-foreground">Koordinat lokasi belum tersedia.</p>
          )}
        </CardContent>
      </Card>
    </OwnerShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-[#0F172A]">{value}</p>
    </div>
  );
}

function TextBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <h2 className="font-semibold text-[#0F172A]">{title}</h2>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}
