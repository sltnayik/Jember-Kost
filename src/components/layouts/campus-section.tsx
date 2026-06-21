import {
  GraduationCap,
} from "lucide-react";

const campuses = [
  "Universitas Jember",
  "Politeknik Negeri Jember",
  "UIN KHAS Jember",
  "Universitas Muhammadiyah Jember",
  "Universitas dr. Soebandi",
  "Institut Teknologi dan Sains Mandala",
];

export default function CampusSection() {
  return (
    <section className="container mx-auto px-6 py-24">
      <div className="mb-12">
        <h2 className="text-4xl font-bold">
          Kampus Populer
        </h2>

        <p className="text-muted-foreground mt-3">
          Cari kos dekat kampus favoritmu.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campuses.map((campus) => (
          <div
            key={campus}
            className="border rounded-3xl p-8 hover:shadow-lg transition"
          >
            <GraduationCap className="h-10 w-10 text-emerald-600 mb-5" />

            <h3 className="font-semibold text-lg">
              {campus}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}