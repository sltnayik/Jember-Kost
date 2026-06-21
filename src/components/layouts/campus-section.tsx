import { GraduationCap } from "lucide-react";

const campuses = ["Universitas Jember", "Politeknik Negeri Jember", "UIN KHAS Jember", "Universitas Muhammadiyah Jember", "Universitas dr. Soebandi", "Institut Teknologi dan Sains Mandala"];

export default function CampusSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Kampus yang didukung</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Jelajahi kos berdasarkan kampus tujuan.</h2>
          <p className="mt-4 text-muted-foreground">Kartu kampus didesain lebih modern agar mudah dipindai dan terasa konsisten dengan layout utama.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {campuses.map((campus) => (
            <div key={campus} className="rounded-[2rem] border border-border/70 bg-background p-6 shadow-sm shadow-black/5 transition-all hover:-translate-y-1 hover:shadow-md">
              <GraduationCap className="mb-5 size-10 rounded-2xl bg-primary/10 p-2.5 text-primary" />

              <h3 className="text-lg font-semibold text-foreground">{campus}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
