import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, MapPin, Phone, XCircle } from "lucide-react";

import { AdminKostActionButtons } from "./admin-kost-action-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils/format-rupiah";

type AdminKostStatus = "pending" | "available" | "full" | "rejected" | null;

type RelationValue<T> = T | T[] | null;

type AdminKostRow = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  district: string | null;
  price: number;
  whatsapp: string | null;
  rules: string | null;
  latitude: number | null;
  longitude: number | null;
  is_verified: boolean | null;
  status: AdminKostStatus;
  campuses: RelationValue<{
    name: string;
    address: string | null;
  }>;
  profiles: RelationValue<{
    full_name: string;
    email: string;
    phone: string | null;
  }>;
  kost_images:
    | {
        id: string;
        image_url: string;
        is_thumbnail: boolean | null;
      }[]
    | null;
};

const statusLabels: Record<NonNullable<AdminKostStatus>, string> = {
  pending: "Menunggu Verifikasi",
  available: "Terverifikasi",
  full: "Penuh",
  rejected: "Ditolak",
};

function getFirstRelation<T>(relation: RelationValue<T> | undefined) {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation ?? null;
}

function getStatusVariant(status: AdminKostStatus) {
  if (status === "rejected") {
    return "destructive" as const;
  }

  if (status === "available") {
    return "default" as const;
  }

  return "secondary" as const;
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <div className="text-sm text-foreground">{value || "-"}</div>
    </div>
  );
}

export default async function AdminKostDetailPage(
  props: PageProps<"/admin/kost/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kosts")
    .select(
      `
        id,
        name,
        description,
        address,
        district,
        price,
        whatsapp,
        rules,
        latitude,
        longitude,
        is_verified,
        status,
        campuses(name, address),
        profiles(full_name, email, phone),
        kost_images(id, image_url, is_thumbnail)
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    notFound();
  }

  const kost = data as unknown as AdminKostRow;
  const owner = getFirstRelation(kost.profiles);
  const campus = getFirstRelation(kost.campuses);
  const images = [...(kost.kost_images ?? [])].sort((first, second) => {
    if (first.is_thumbnail === second.is_thumbnail) {
      return 0;
    }

    return first.is_thumbnail ? -1 : 1;
  });
  const statusLabel = kost.status ? statusLabels[kost.status] : "Tidak diketahui";
  const verificationLabel = kost.is_verified ? "Sudah diverifikasi" : "Belum diverifikasi";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
            <Link href="/admin/kost">
              <ArrowLeft />
              Kembali
            </Link>
          </Button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-[#0F172A]">{kost.name}</h1>
              <Badge variant={getStatusVariant(kost.status)}>{statusLabel}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Detail data kos untuk proses verifikasi admin.
            </p>
          </div>
        </div>

        <AdminKostActionButtons kostId={kost.id} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kos</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <DetailItem label="Nama kos" value={kost.name} />
              <DetailItem label="Harga" value={`${formatRupiah(kost.price)} / bulan`} />
              <DetailItem label="Pemilik kos" value={owner?.full_name ?? "-"} />
              <DetailItem label="Kampus terdekat" value={campus?.name ?? "-"} />
              <DetailItem label="WhatsApp" value={kost.whatsapp ?? "-"} />
              <DetailItem
                label="Status verifikasi"
                value={
                  <span className="inline-flex items-center gap-2">
                    {kost.is_verified ? (
                      <CheckCircle2 className="size-4 text-green-600" />
                    ) : (
                      <XCircle className="size-4 text-muted-foreground" />
                    )}
                    {verificationLabel}
                  </span>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lokasi</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <DetailItem
                label="Alamat"
                value={
                  <span className="inline-flex gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span>
                      {kost.address}
                      {kost.district ? `, ${kost.district}` : ""}
                    </span>
                  </span>
                }
              />
              <DetailItem
                label="Koordinat"
                value={
                  kost.latitude !== null && kost.longitude !== null
                    ? `${kost.latitude}, ${kost.longitude}`
                    : "-"
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deskripsi dan Aturan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <DetailItem
                label="Deskripsi"
                value={
                  <p className="whitespace-pre-line leading-6">
                    {kost.description ?? "-"}
                  </p>
                }
              />
              <DetailItem
                label="Aturan kos"
                value={<p className="whitespace-pre-line leading-6">{kost.rules ?? "-"}</p>}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Galeri Foto</CardTitle>
            </CardHeader>
            <CardContent>
              {images.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((image) => (
                    <figure
                      key={image.id}
                      className="overflow-hidden rounded-lg border bg-muted"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={image.image_url}
                          alt={`Foto ${kost.name}`}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      {image.is_thumbnail ? (
                        <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                          Foto utama
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada foto untuk kos ini.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Kontak Pemilik</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem label="Nama" value={owner?.full_name ?? "-"} />
            <DetailItem label="Email" value={owner?.email ?? "-"} />
            <DetailItem label="Telepon profil" value={owner?.phone ?? "-"} />
            <DetailItem
              label="WhatsApp kos"
              value={
                kost.whatsapp ? (
                  <span className="inline-flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    {kost.whatsapp}
                  </span>
                ) : (
                  "-"
                )
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
