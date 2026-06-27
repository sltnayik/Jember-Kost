import type { LandingStats } from "@/types/kosts";

interface StatsSectionProps {
  stats: LandingStats;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const items = [
    { label: "Total Kos", value: stats.totalKosts },
    { label: "Total Kampus", value: stats.totalCampuses },
    { label: "Total Kamar", value: stats.totalRooms },
    { label: "Kamar Tersedia", value: stats.availableRooms },
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border/70 bg-background p-6 shadow-sm shadow-black/5 sm:p-8 lg:p-10">
        <div className="grid gap-4 text-center md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="rounded-[1.6rem] border border-border/70 bg-muted/40 p-6">
              <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{item.value}</h2>
              <p className="mt-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
