import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-20">

      <SearchX className="w-16 h-16 text-muted-foreground" />

      <h2 className="mt-6 text-2xl font-bold">
        {title}
      </h2>

      <p className="text-muted-foreground mt-3">
        {description}
      </p>

    </div>
  );
}