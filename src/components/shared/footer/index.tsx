import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

import { BrandMark } from "@/components/shared/brand-mark";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <BrandMark className="text-lg font-semibold text-foreground" />
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">Platform pencarian kos modern untuk mahasiswa dan masyarakat di Jember, dengan pengalaman yang bersih dan responsif.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Menu</h3>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-foreground">
                Beranda
              </Link>
              <Link href="/kost" className="transition-colors hover:text-foreground">
                Cari Kos
              </Link>
              <Link href="/map" className="transition-colors hover:text-foreground">
                Peta
              </Link>
              <Link href="/about" className="transition-colors hover:text-foreground">
                Tentang
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Kontak</h3>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <a href="mailto:support@jemberkost.com" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
                <Mail className="size-4" />
                support@jemberkost.com
              </a>
              <a href="https://wa.me/6281234567890" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">JemberKost</h3>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">Pilih kos dengan tampilan yang rapi, informasi yang jelas, dan akses yang nyaman dari perangkat apa pun.</p>
          </div>
        </div>

        <div className="mt-12 border-t border-border/70 pt-6 text-sm text-muted-foreground">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 JemberKost. All rights reserved.</p>
            <p>Dirancang untuk pengalaman modern di mobile dan desktop.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
