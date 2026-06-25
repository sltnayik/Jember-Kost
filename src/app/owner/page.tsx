import OwnerSidebar from "@/components/shared/owner-sidebar";
import StatsCard from "@/components/cards/stats-card";
import { ProfileCompletenessBanner } from "@/components/auth/profile-completeness-banner";

import {
  Building2,
  BedDouble,
  Star,
  MessageSquare,
} from "lucide-react";

import { getOwnerStats } from "@/services/owner.service";
import { getCurrentProfile } from "@/services/auth";

export default async function OwnerPage() {
  const [stats, profile] = await Promise.all([
    getOwnerStats(),
    getCurrentProfile(),
  ]);

  return (
    <main className="container py-10">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">

        <OwnerSidebar />

        <section className="space-y-8">
          <ProfileCompletenessBanner profile={profile} />

          <div>
            <h1 className="text-3xl font-bold">
              Dashboard Owner
            </h1>

            <p className="text-muted-foreground">
              Kelola kos dan pantau performanya.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <StatsCard
              title="Total Kos"
              value={stats.totalKost}
              icon={Building2}
            />

            <StatsCard
              title="Total Kamar"
              value={stats.totalRooms}
              icon={BedDouble}
            />

            <StatsCard
              title="Review"
              value={stats.totalReviews}
              icon={MessageSquare}
            />

            <StatsCard
              title="Rating"
              value={stats.averageRating}
              icon={Star}
            />

          </div>

          <div className="rounded-3xl border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-semibold">
              Selamat datang 👋
            </h2>

            <p className="mt-2 text-muted-foreground">
              Dashboard owner siap digunakan.
              Selanjutnya kita akan membuat halaman
              &quot;Kos Saya&quot; dan CRUD data kos.
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}
