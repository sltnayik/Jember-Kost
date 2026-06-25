import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { AuthProfile } from "@/types/auth";

type ProfileCompletenessBannerProps = {
  profile: AuthProfile | null;
};

export function ProfileCompletenessBanner({
  profile,
}: ProfileCompletenessBannerProps) {
  if (profile?.phone) {
    return null;
  }

  const profilePath = profile?.role === "owner" ? "/owner/profile" : "/user/profile";

  return (
    <Alert className="grid-cols-[auto_1fr] rounded-2xl border-[#16A34A]/30 bg-[#16A34A]/5 text-[#0F172A]">
      <AlertCircle className="size-5 text-[#16A34A]" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <AlertTitle>Lengkapi nomor WhatsApp</AlertTitle>
          <AlertDescription className="mt-1 text-muted-foreground">
            Nomor WhatsApp membantu komunikasi akun dan proses pemesanan kos.
          </AlertDescription>
        </div>
        <Button
          asChild
          size="sm"
          className="rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D]"
        >
          <Link href={profilePath}>Lengkapi profil</Link>
        </Button>
      </div>
    </Alert>
  );
}
