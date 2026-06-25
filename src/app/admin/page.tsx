import { ProfileCompletenessBanner } from "@/components/auth/profile-completeness-banner";
import { getCurrentProfile } from "@/services/auth";

export default async function AdminDashboardPage() {
  const profile = await getCurrentProfile();

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6">
      <ProfileCompletenessBanner profile={profile} />

      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A]">Dashboard Admin</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pantau pengguna, pemilik kos, dan proses verifikasi JemberKost.
        </p>
      </div>
    </main>
  );
}
