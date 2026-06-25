import { LockKeyhole } from "lucide-react";

import { AuthCardShell } from "@/components/auth/auth-card-shell";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthCardShell
      title="Buat password baru"
      description="Gunakan password baru yang kuat untuk mengamankan akun Anda."
      icon={LockKeyhole}
    >
      <ResetPasswordForm />
    </AuthCardShell>
  );
}
