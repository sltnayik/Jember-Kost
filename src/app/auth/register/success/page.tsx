import Link from "next/link";
import { MailCheck } from "lucide-react";

import { AuthCardShell } from "@/components/auth/auth-card-shell";
import { Button } from "@/components/ui/button";

export default function RegisterSuccessPage() {
  return (
    <AuthCardShell
      title="Cek email verifikasi"
      description="Kami telah mengirim email verifikasi untuk mengaktifkan akun JemberKost Anda."
      icon={MailCheck}
    >
      <div className="grid gap-5 text-center">
        <div className="rounded-2xl border border-[#16A34A]/20 bg-[#16A34A]/5 p-4 text-sm leading-relaxed text-muted-foreground">
          Silakan cek inbox email Anda. Jika tidak ada, periksa juga folder spam
          atau promosi sebelum mencoba login.
        </div>

        <Button
          asChild
          className="h-11 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D]"
        >
          <Link href="/auth/login">Ke halaman login</Link>
        </Button>
      </div>
    </AuthCardShell>
  );
}
