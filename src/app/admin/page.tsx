import { Building2, Clock3, UserRound, Users } from "lucide-react";

import { BrandMark } from "@/components/shared/brand-mark";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

const pendingStatus = "pending";

function StatCard({ title, value, icon: Icon }: { title: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <div className="rounded-xl bg-[#16A34A]/10 p-2">
          <Icon className="h-5 w-5 text-[#16A34A]" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [users, owners, kosts, pendingKosts] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "user"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "owner"),
    supabase.from("kosts").select("id", { count: "exact", head: true }),
    supabase.from("kosts").select("id", { count: "exact", head: true }).eq("is_verified", false).eq("status", pendingStatus),
  ]);
  console.log({
    usersCount: users.count,
    ownersCount: owners.count,
    kostsCount: kosts.count,
    pendingCount: pendingKosts.count,

    usersError: users.error,
    ownersError: owners.error,
    kostsError: kosts.error,
    pendingError: pendingKosts.error,
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <BrandMark className="text-lg" imageClassName="rounded-xl" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#16A34A]">Admin</p>
            <h1 className="text-2xl font-semibold text-[#0F172A]">Dashboard Admin</h1>
          </div>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Pantau pengguna, pemilik kos, dan proses verifikasi JemberKost.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total User" value={users.count ?? 0} icon={Users} />
        <StatCard title="Total Owner" value={owners.count ?? 0} icon={UserRound} />
        <StatCard title="Total Kos" value={kosts.count ?? 0} icon={Building2} />
        <StatCard title="Kos Menunggu Verifikasi" value={pendingKosts.count ?? 0} icon={Clock3} />
      </div>
    </div>
  );
}
