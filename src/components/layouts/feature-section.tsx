import { MapPinned, MessageCircleMore, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Kos Terverifikasi",
    description: "Kurasi informasi kos agar lebih rapi dan meyakinkan untuk dilihat pengguna.",
    icon: ShieldCheck,
  },
  {
    title: "Lokasi Akurat",
    description: "Tata letak yang menonjolkan lokasi agar pencarian terasa lebih cepat dan jelas.",
    icon: MapPinned,
  },
  {
    title: "Hubungi via WhatsApp",
    description: "Aksi kontak dibuat lebih mudah dengan gaya yang familiar dan cepat dipahami.",
    icon: MessageCircleMore,
  },
];

export default function FeatureSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Kenapa JemberKost</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Pengalaman pencarian yang lebih bersih dan profesional.</h2>
          <p className="mt-4 text-muted-foreground">Setiap bagian UI dirapikan agar pengguna bisa fokus pada informasi penting tanpa distraksi visual.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-[2rem] border border-border/70 bg-background p-6 shadow-sm shadow-black/5 transition-all hover:-translate-y-1 hover:shadow-md">
              <feature.icon className="size-11 rounded-2xl bg-primary/10 p-2.5 text-primary" />
              <h3 className="mt-5 text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
