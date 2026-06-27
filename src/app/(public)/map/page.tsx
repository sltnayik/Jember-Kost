import { MapPinned, Search } from "lucide-react";
import { getKosts } from "@/data/kosts";
import PublicMap from "@/components/maps/public-map";

export default async function MapPage() {
  const { data: kosts } = await getKosts({ perPage: 1000 });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Peta Kos Jember</h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">Temukan lokasi kos terbaik di sekitar kampus-kampus Kabupaten Jember. Klik marker untuk melihat informasi singkat setiap kos.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Sidebar */}
        <aside className="rounded-2xl border bg-background p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Cari Lokasi</h2>

          <p className="mt-2 text-sm text-muted-foreground">Cari berdasarkan nama kos, kampus, atau kecamatan.</p>

          <div className="relative mt-5">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

            <input type="text" placeholder="Cari kos..." className="w-full rounded-xl border py-2.5 pl-10 pr-4 outline-none transition focus:border-primary" />
          </div>

          <div className="mt-6 rounded-xl bg-primary/5 p-5">
            <MapPinned className="mb-3 h-7 w-7 text-primary" />

            <h3 className="font-semibold">Lokasi Kos</h3>

            <p className="mt-2 text-sm text-muted-foreground">Seluruh marker pada peta menunjukkan lokasi kos yang telah diverifikasi dan tersedia di Kabupaten Jember.</p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Kampus Populer</p>

              <ul className="mt-3 space-y-2 text-sm">
                <li>• Universitas Jember</li>
                <li>• Politeknik Negeri Jember</li>
                <li>• UIN KHAS Jember</li>
                <li>• Universitas Muhammadiyah Jember</li>
              </ul>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-muted-foreground">Tips</p>

              <p className="mt-2 text-sm">Klik marker pada peta untuk melihat informasi singkat mengenai kos sebelum membuka halaman detailnya.</p>
            </div>
          </div>
        </aside>

        {/* Map */}
        <section className="overflow-hidden rounded-2xl border shadow-sm">
          <div className="h-[700px] w-full">
            <PublicMap kosts={kosts} />
          </div>
        </section>
      </div>
    </main>
  );
}
