import OwnerSidebar from "@/components/shared/owner-sidebar";
import StatsCard from "@/components/cards/stats-card";
import { ProfileCompletenessBanner } from "@/components/auth/profile-completeness-banner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BedDouble,
  Building2,
  CheckCircle2,
  Clock3,
  Star,
} from "lucide-react";

import { formatRupiah } from "@/lib/utils/format-rupiah";
import { getCurrentProfile, getCurrentUser } from "@/services/auth";
import { getOwnerDashboardData } from "@/services/owner.service";

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

export default async function OwnerPage() {
  const [user, profile] = await Promise.all([getCurrentUser(), getCurrentProfile()]);
  const dashboard = user
    ? await getOwnerDashboardData(user.id)
    : {
        stats: {
          totalKost: 0,
          totalRooms: 0,
          availableRooms: 0,
          verifiedKost: 0,
          pendingVerification: 0,
          averageRating: "0",
        },
        latestKosts: [],
      };
  const { stats, latestKosts } = dashboard;

  return (
    <main className="container py-10">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <OwnerSidebar />

        <section className="space-y-8">
          <ProfileCompletenessBanner profile={profile} />

          <div>
            <h1 className="text-3xl font-bold">Dashboard Owner</h1>
            <p className="text-muted-foreground">Kelola kos dan pantau performanya.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard title="Total Kos" value={stats.totalKost} icon={Building2} />
            <StatsCard title="Total Kamar" value={stats.totalRooms} icon={BedDouble} />
            <StatsCard title="Kamar Tersedia" value={stats.availableRooms} icon={BedDouble} />
            <StatsCard title="Kos Terverifikasi" value={stats.verifiedKost} icon={CheckCircle2} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <StatsCard
              title="Menunggu Verifikasi"
              value={stats.pendingVerification}
              icon={Clock3}
            />
            <StatsCard title="Rata-rata Rating" value={stats.averageRating} icon={Star} />
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Kos Terbaru</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Daftar kos terbaru milik Anda.
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kos</TableHead>
                  <TableHead>Status Verifikasi</TableHead>
                  <TableHead>Kamar Tersedia</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {latestKosts.map((kost) => (
                  <TableRow key={kost.id}>
                    <TableCell className="font-medium">{kost.name}</TableCell>
                    <TableCell>
                      {kost.is_verified ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Terverifikasi
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                          Menunggu Verifikasi
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {kost.room_available ?? 0} dari {kost.room_total ?? 0}
                    </TableCell>
                    <TableCell>{formatRupiah(kost.price)}</TableCell>
                    <TableCell>{formatCreatedAt(kost.created_at)}</TableCell>
                  </TableRow>
                ))}

                {latestKosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      Belum ada kos yang ditambahkan.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </main>
  );
}
