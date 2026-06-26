import Link from "next/link";

import KostCard from "@/components/cards/kost-card";
import type { KostCardData } from "@/types/kosts";

interface HomeKostSectionProps {
  title: string;
  description: string;
  kosts: KostCardData[];
}

export function HomeKostSection({ title, description, kosts }: HomeKostSectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">JemberKost</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
          </div>
          <Link href="/kost" className="text-sm font-semibold text-primary">
            Lihat semua
          </Link>
        </div>

        {kosts.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border/70 bg-muted/30 p-8 text-center text-sm text-muted-foreground">Belum ada kos yang tersedia saat ini.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {kosts.map((kost) => (
              <KostCard key={kost.id} kost={kost} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
