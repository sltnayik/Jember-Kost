import Link from "next/link";
import { BarChart3, BedDouble, Building2, CheckCircle2, Clock3, ClipboardList, PlusCircle, User, XCircle } from "lucide-react";

import { ProfileCompletenessBanner } from "@/components/auth/profile-completeness-banner";
import { OwnerShell } from "@/components/owner/owner-shell";
import { OwnerStatCard } from "@/components/owner/owner-stat-card";
import { OwnerStatusBadge } from "@/components/owner/owner-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { getCurrentProfile, getCurrentUser } from "@/services/auth";
import { getOwnerDashboardData } from "@/services/owner.service";

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

export default async function OwnerPage() {
  const [user, profile] = await Promise.all([getCurrentUser(), getCurrentProfile()]);
  const dashboard = user
    ? await getOwnerDashboardData(user.id)
    : {
        stats: { totalKost: 0, pending: 0, approved: 0, rejected: 0, totalRooms: 0, availableRooms: 0 },
        latestKosts: [],
      };

  return (
    <OwnerShell
      title="Dashboard Owner"
      description="Pantau status verifikasi, kamar, dan aktivitas terbaru kos Anda."
      action={
        <Button asChild className="h-10 rounded-xl bg-[#16A34A] hover:bg-[#15803D]">
          <Link href="/owner/kost/add">
            <PlusCircle />
            Tambah Kos
          </Link>
        </Button>
      }
    >
      {profile ? <ProfileCompletenessBanner profile={profile} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <OwnerStatCard title="Total Kos" value={dashboard.stats.totalKost} icon={Building2} tone="slate" />
        <OwnerStatCard title="Pending" value={dashboard.stats.pending} icon={Clock3} tone="amber" />
        <OwnerStatCard title="Approved" value={dashboard.stats.approved} icon={CheckCircle2} tone="green" />
        <OwnerStatCard title="Rejected" value={dashboard.stats.rejected} icon={XCircle} tone="red" />
        <OwnerStatCard title="Total Kamar" value={dashboard.stats.totalRooms} icon={BedDouble} tone="blue" />
        <OwnerStatCard title="Kamar Tersedia" value={dashboard.stats.availableRooms} icon={BedDouble} tone="green" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <QuickAction href="/owner/kost/add" icon={PlusCircle} label="Tambah Kos" />
        <QuickAction href="/owner/kost" icon={ClipboardList} label="Kelola Kos" />
        <QuickAction href="/owner/profile" icon={User} label="Profil" />
        <QuickAction href="/owner/report" icon={BarChart3} label="Laporan" />
      </div>

      <Card className="rounded-2xl bg-white shadow-sm shadow-slate-950/5">
        <CardHeader className="border-b bg-green-50/60">
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Kamar</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Dibuat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboard.latestKosts.map((kost) => (
                <TableRow key={kost.id}>
                  <TableCell className="font-medium">{kost.name}</TableCell>
                  <TableCell>
                    <OwnerStatusBadge status={kost.verificationStatus} />
                  </TableCell>
                  <TableCell>
                    {kost.room_available ?? 0} / {kost.room_total ?? 0}
                  </TableCell>
                  <TableCell>{formatRupiah(kost.price)}</TableCell>
                  <TableCell>{formatDate(kost.created_at)}</TableCell>
                </TableRow>
              ))}
              {dashboard.latestKosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Belum ada aktivitas kos.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </OwnerShell>
  );
}

function QuickAction({ href, icon: Icon, label }: { href: string; icon: typeof PlusCircle; label: string }) {
  return (
    <Button asChild variant="outline" className="h-14 justify-start rounded-2xl bg-white shadow-sm shadow-slate-950/5">
      <Link href={href}>
        <Icon className="text-[#16A34A]" />
        {label}
      </Link>
    </Button>
  );
}
