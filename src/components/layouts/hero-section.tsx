import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPinned, Search } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(22,163,74,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.10),transparent_26%)]" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="max-w-3xl">
            <Badge variant="outline" className="rounded-full border-border/70 bg-background px-4 py-2 text-sm text-foreground shadow-sm shadow-black/5">
              Platform kos modern di Jember
            </Badge>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">Temukan Kos Terbaik di Jember</h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Jelajahi pilihan kos yang nyaman, lokasi strategis, dan tampilan informasi yang lebih rapi untuk membantu keputusanmu lebih cepat.</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/kost">
                <Button size="lg" className="rounded-2xl bg-primary px-6 text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90">
                  Cari Kos
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/map">
                <Button size="lg" variant="outline" className="rounded-2xl border-border/70 px-6 shadow-sm shadow-black/5 hover:bg-muted">
                  Lihat Peta
                  <MapPinned className="size-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 shadow-sm shadow-black/5">
                <BadgeCheck className="size-4 text-primary" />
                1000+ Kos Terdaftar
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 shadow-sm shadow-black/5">
                <Search className="size-4 text-amber-500" />
                15 Kampus Didukung
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-3xl" />

            <div className="rounded-2xl overflow-hidden border shadow-sm">
              <Image src="/images/dashboard-preview.png" alt="Dashboard Preview" width={900} height={600} priority className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
