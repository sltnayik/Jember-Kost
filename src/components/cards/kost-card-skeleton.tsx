import { Skeleton } from "@/components/ui/skeleton";

export default function KostCardSkeleton() {
  return (
    <div className="space-y-4">

      <Skeleton className="h-56 rounded-3xl" />

      <Skeleton className="h-6 w-2/3" />

      <Skeleton className="h-4 w-1/2" />

      <Skeleton className="h-4 w-3/4" />

    </div>
  );
}