import OwnerSidebar from "@/components/shared/owner-sidebar";

type OwnerShellProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function OwnerShell({ title, description, action, children }: OwnerShellProps) {
  return (
    <main className="container py-8 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
        <OwnerSidebar />
        <section className="min-w-0 space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-[#16A34A]/10 bg-white/90 p-5 shadow-sm shadow-slate-950/5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#16A34A]">Owner</p>
              <h1 className="mt-2 text-2xl font-semibold text-[#0F172A] sm:text-3xl">{title}</h1>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
