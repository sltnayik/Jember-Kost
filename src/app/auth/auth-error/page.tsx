import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-[#0F172A]">
          Autentikasi gagal
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Link autentikasi tidak valid atau sesi sudah kedaluwarsa.
        </p>
        <Button asChild className="mt-6 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D]">
          <Link href="/auth/login">Kembali login</Link>
        </Button>
      </div>
    </main>
  );
}
