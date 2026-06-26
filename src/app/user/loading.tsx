import { Skeleton } from "@/components/ui/skeleton";

export default function UserLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-8 w-72 rounded-2xl" />
        <Skeleton className="h-4 w-96 rounded-2xl" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-[2rem] border border-border/70 bg-background p-5">
              <Skeleton className="h-44 rounded-[1.5rem]" />
              <Skeleton className="h-5 w-3/4 rounded-2xl" />
              <Skeleton className="h-4 w-1/2 rounded-2xl" />
              <Skeleton className="h-4 w-2/3 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
