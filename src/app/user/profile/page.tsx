import { getCurrentProfile } from "@/services/auth";
import { UserShell } from "@/components/user/user-shell";
import { ProfileShell } from "@/components/user/profile-shell";

export default async function UserProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return null;
  }

  return (
    <UserShell title="Profil pengguna" description="Perbarui nama, foto, dan nomor WhatsApp untuk pengalaman yang lebih personal.">
      <ProfileShell profile={profile} />
    </UserShell>
  );
}
