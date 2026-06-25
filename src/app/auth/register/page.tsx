import { UserPlus } from "lucide-react";

import { AuthCardShell } from "@/components/auth/auth-card-shell";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <AuthCardShell
      title="Buat akun baru"
      description="Daftar sebagai pencari kos atau pemilik kos untuk mulai memakai JemberKost."
      icon={UserPlus}
    >
      <RegisterForm />
    </AuthCardShell>
  );
}
