import Link from "next/link";

import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <BrandMark />
        </div>

        <h1 className="text-8xl font-bold text-emerald-600">404</h1>

        <h2 className="text-3xl font-bold mt-6">Halaman tidak ditemukan</h2>

        <p className="text-muted-foreground mt-4">Halaman yang Anda cari tidak tersedia.</p>

        <Button className="mt-8" asChild>
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </div>
  );
}
