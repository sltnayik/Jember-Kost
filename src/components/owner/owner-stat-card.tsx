import type { LucideIcon } from "lucide-react";

type OwnerStatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  tone?: "green" | "amber" | "red" | "slate" | "blue";
};

const toneClasses = {
  green: "bg-green-50 text-[#16A34A] ring-green-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  red: "bg-red-50 text-red-600 ring-red-100",
  slate: "bg-slate-50 text-slate-700 ring-slate-100",
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
};

export function OwnerStatCard({ title, value, description, icon: Icon, tone = "green" }: OwnerStatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-950/5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-[#0F172A]">{value}</p>
        </div>
        <div className={`flex size-11 items-center justify-center rounded-xl ring-1 ${toneClasses[tone]}`}>
          <Icon className="size-5" />
        </div>
      </div>
      {description ? <p className="mt-4 text-xs text-muted-foreground">{description}</p> : null}
    </div>
  );
}
