import OwnerSidebar from "@/components/shared/owner-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function OwnerLoading() {
  return (
    <main className="container py-8 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
        <OwnerSidebar />
        <section className="space-y-6">
          <div className="rounded-2xl border bg-white p-5 shadow-sm shadow-slate-950/5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-full max-w-lg" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-36 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </section>
      </div>
    </main>
  );
}
