import OwnerSidebar from "@/components/shared/owner-sidebar";
import OwnerKostCard from "@/components/cards/owner-kost-card";
import Link from "next/link";

import { getOwnerKosts } from "@/services/kost.service";

export default async function OwnerKostPage() {
  const kosts = await getOwnerKosts();

  return (
    <main className="container py-10">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <OwnerSidebar />

        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Kos Saya</h1>

              <p className="text-muted-foreground">Kelola seluruh kos yang Anda miliki.</p>
            </div>

            <Link href="/owner/kost/add" className="rounded-2xl bg-green-600 px-5 py-3 text-white hover:bg-green-700">
              Tambah Kos
            </Link>
          </div>

          <div className="grid gap-6">
            {kosts.map((kost) => (
              <OwnerKostCard key={kost.id} {...kost} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
