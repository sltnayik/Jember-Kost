import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[linear-gradient(180deg,#F8FAFC_0%,#FFFFFF_52%,#ECFDF5_100%)] px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl border-0 bg-white/95 shadow-xl shadow-slate-950/10 ring-1 ring-slate-200">
        <CardHeader className="gap-3 text-center">
          <Link href="/" className="mx-auto text-xl font-semibold text-[#0F172A]">
            Jember<span className="text-[#16A34A]">Kost</span>
          </Link>
          <div className="grid gap-2">
            <CardTitle className="text-2xl font-semibold text-[#0F172A]">
              Login ke akun
            </CardTitle>
            <CardDescription>
              Masuk untuk melanjutkan pencarian atau pengelolaan kos.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
