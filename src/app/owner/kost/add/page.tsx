import KostForm from "@/components/forms/kost-form";
import { getFacilities } from "@/services/owner.service";

export default async function AddKostPage() {
  const facilities = await getFacilities();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#16A34A]">Owner</p>
        <h1 className="text-3xl font-semibold text-[#0F172A]">Tambah Kos</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Isi detail kos dengan lengkap dan pilih lokasi di peta agar calon penghuni bisa menemukan properti Anda dengan mudah.</p>
      </div>

      <KostForm facilities={facilities} />
    </main>
  );
}
