import { redirect } from "next/navigation";

import { OwnerShell } from "@/components/owner/owner-shell";
import { ProfileForm } from "@/components/owner/profile-form";
import { getCurrentProfile } from "@/services/auth";

export default async function OwnerProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  return (
    <OwnerShell title="Profil Owner" description="Kelola nama, foto profil, dan nomor WhatsApp yang tampil di akun owner Anda.">
      <ProfileForm profile={profile} />
    </OwnerShell>
  );
}
