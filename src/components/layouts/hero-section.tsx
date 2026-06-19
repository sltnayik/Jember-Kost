import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-100 -z-10" />

      <div className="container mx-auto px-6 py-28">
        <div className="max-w-4xl">

          <div className="inline-flex rounded-full border bg-white px-4 py-2 text-sm shadow-sm">
            🏠 Platform Pencarian Kos Terpercaya di Jember
          </div>

          <h1 className="mt-8 text-5xl md:text-7xl font-bold leading-tight text-slate-900">
            Temukan
            <span className="text-emerald-600"> Kos Terbaik </span>
            untuk Mahasiswa di Jember
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-2xl">
            Cari kos putra, putri, maupun campur dengan harga yang sesuai,
            lokasi strategis, dan fasilitas lengkap.
          </p>

          <div className="mt-10 flex gap-4">
            <Link href="/kost">
              <Button size="lg" className="rounded-2xl">
                Cari Kos
              </Button>
            </Link>

            <Link href="/auth/register">
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl"
              >
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}