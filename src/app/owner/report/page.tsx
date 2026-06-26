import { BedDouble, Building2, CheckCircle2, Clock3, XCircle } from "lucide-react";

import { OwnerShell } from "@/components/owner/owner-shell";
import { OwnerStatCard } from "@/components/owner/owner-stat-card";
import { getCurrentUser } from "@/services/auth";
import { getOwnerDashboardData } from "@/services/owner.service";

export default async function OwnerReportPage() {
  const user = await getCurrentUser();
  const dashboard = user
    ? await getOwnerDashboardData(user.id)
    : {
        stats: { totalKost: 0, pending: 0, approved: 0, rejected: 0, totalRooms: 0, availableRooms: 0 },
      };

  return (
    <OwnerShell title="Laporan Owner" description="Ringkasan sederhana status kos dan ketersediaan kamar.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <OwnerStatCard title="Total Kos" value={dashboard.stats.totalKost} icon={Building2} tone="slate" />
        <OwnerStatCard title="Pending" value={dashboard.stats.pending} icon={Clock3} tone="amber" />
        <OwnerStatCard title="Approved" value={dashboard.stats.approved} icon={CheckCircle2} tone="green" />
        <OwnerStatCard title="Rejected" value={dashboard.stats.rejected} icon={XCircle} tone="red" />
        <OwnerStatCard title="Total Kamar" value={dashboard.stats.totalRooms} icon={BedDouble} tone="blue" />
        <OwnerStatCard title="Kamar Tersedia" value={dashboard.stats.availableRooms} icon={BedDouble} tone="green" />
      </div>
    </OwnerShell>
  );
}
