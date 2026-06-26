import { SearchX } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export default function EmptyState({ title, description, icon: Icon = SearchX }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-border/70 bg-muted/30 px-6 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-8" />
      </div>

      <h2 className="mt-6 text-2xl font-semibold text-foreground">{title}</h2>

      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}
