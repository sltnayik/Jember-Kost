import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPinned, Search } from "lucide-react";

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
                16 Kampus Didukung
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-background p-4 shadow-md shadow-black/10 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-muted/60 p-4">
                  <div className="h-56 rounded-2xl bg-[linear-gradient(135deg,rgba(22,163,74,0.20),rgba(15,23,42,0.10)),linear-gradient(180deg,rgba(255,255,255,0.8),rgba(255,255,255,0.2))] dark:bg-[linear-gradient(135deg,rgba(22,163,74,0.18),rgba(255,255,255,0.06)),linear-gradient(180deg,rgba(15,23,42,0.8),rgba(15,23,42,0.45))]" />
                </div>
                <div className="grid gap-4">
                  <div className="rounded-3xl border border-border/70 bg-muted/30 p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">Rekomendasi populer</p>
                    <p className="mt-2 text-xl font-semibold text-foreground">Kos dekat kampus</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Tampilan kartu yang bersih untuk memudahkan eksplorasi harga, fasilitas, dan lokasi.</p>
                  </div>
                  <div className="rounded-3xl border border-border/70 bg-primary/10 p-4 shadow-sm">
                    <p className="text-sm text-primary">Quick insight</p>
                    <p className="mt-2 text-xl font-semibold text-foreground">Lebih cepat, lebih jelas</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Interface dibuat ringan dan nyaman di mobile maupun desktop.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
