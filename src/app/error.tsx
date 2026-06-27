"use client";

import Link from "next/link";

import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <BrandMark />
        </div>

        <h1 className="text-4xl font-bold">Terjadi Kesalahan</h1>

        <p className="text-muted-foreground mt-4">Silakan coba beberapa saat lagi.</p>

        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={() => reset()}>Coba Lagi</Button>
          <Button variant="outline" asChild>
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
