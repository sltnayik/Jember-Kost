import { LogIn } from "lucide-react";

import { AuthCardShell } from "@/components/auth/auth-card-shell";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <AuthCardShell
      title="Login ke akun"
      description="Masuk untuk melanjutkan pencarian atau pengelolaan kos di Jember."
      icon={LogIn}
    >
      <LoginForm />
    </AuthCardShell>
  );
}
