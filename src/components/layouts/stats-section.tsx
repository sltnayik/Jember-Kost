export default function StatsSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border/70 bg-background p-6 shadow-sm shadow-black/5 sm:p-8 lg:p-10">
        <div className="grid gap-4 text-center sm:grid-cols-3">
          <div className="rounded-3xl bg-muted/40 p-6">
            <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">1000+</h2>
            <p className="mt-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Kos</p>
          </div>
          <div className="rounded-3xl bg-muted/40 p-6">
            <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">16</h2>
            <p className="mt-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Kampus</p>
          </div>
          <div className="rounded-3xl bg-muted/40 p-6">
            <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">5000+</h2>
            <p className="mt-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Mahasiswa</p>
          </div>
        </div>
      </div>
    </section>
  );
}
