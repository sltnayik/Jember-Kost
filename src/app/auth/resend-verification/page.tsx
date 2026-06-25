import { Send } from "lucide-react";

import { AuthCardShell } from "@/components/auth/auth-card-shell";
import { ResendVerificationForm } from "@/components/forms/resend-verification-form";

export default function ResendVerificationPage() {
  return (
    <AuthCardShell
      title="Kirim ulang verifikasi"
      description="Masukkan email akun Anda untuk menerima ulang link verifikasi."
      icon={Send}
    >
      <ResendVerificationForm />
    </AuthCardShell>
  );
}
