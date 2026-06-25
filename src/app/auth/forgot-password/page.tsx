import { KeyRound } from "lucide-react";

import { AuthCardShell } from "@/components/auth/auth-card-shell";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthCardShell
      title="Reset password"
      description="Kami akan mengirim link aman untuk membuat password baru."
      icon={KeyRound}
    >
      <ForgotPasswordForm />
    </AuthCardShell>
  );
}
