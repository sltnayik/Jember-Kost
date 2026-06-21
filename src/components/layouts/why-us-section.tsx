import {
  ShieldCheck,
  MapPinned,
  Wallet,
  Star,
} from "lucide-react";

const features = [
  {
    title: "Data Terverifikasi",
    description: "Informasi kos lebih terpercaya.",
    icon: ShieldCheck,
  },
  {
    title: "Lokasi Akurat",
    description: "Terintegrasi dengan peta.",
    icon: MapPinned,
  },
  {
    title: "Harga Transparan",
    description: "Tidak ada biaya tersembunyi.",
    icon: Wallet,
  },
  {
    title: "Review Pengguna",
    description: "Lihat pengalaman penghuni lain.",
    icon: Star,
  },
];

export default function WhyUsSection() {
  return (
    <section className="bg-muted/30 py-24">
      <div className="container mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            Mengapa JemberKost?
          </h2>

          <p className="text-muted-foreground mt-4">
            Solusi pencarian kos modern dan terpercaya.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-background rounded-3xl p-8 shadow-sm"
            >
              <feature.icon className="h-10 w-10 text-emerald-600 mb-6" />

              <h3 className="font-bold text-xl mb-3">
                {feature.title}
              </h3>

              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}