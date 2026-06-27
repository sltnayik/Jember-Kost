import { BrandMark } from "@/components/shared/brand-mark";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-[linear-gradient(180deg,#F8FAFC_0%,#FFFFFF_50%,#F0FDF4_100%)] px-4">
      <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-border/70 bg-background/95 px-8 py-10 shadow-lg shadow-slate-950/10">
        <BrandMark />
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Memuat pengalaman JemberKost...</p>
          <p className="mt-2 text-sm text-muted-foreground">Sedang menyiapkan halaman terbaik untuk Anda.</p>
        </div>
      </div>
    </div>
  );
}
