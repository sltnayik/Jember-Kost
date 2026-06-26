import { getCurrentProfile } from "@/services/auth";
import { ProfileShell } from "@/components/user/profile-shell";

export default async function UserProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Profil</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Profil pengguna</h1>
        <p className="mt-2 text-sm text-muted-foreground">Perbarui nama, foto, dan nomor WhatsApp untuk pengalaman yang lebih personal.</p>
      </div>
      <ProfileShell profile={profile} />
    </main>
  );
}
