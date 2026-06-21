export default function StatsSection() {
  return (
    <section className="container mx-auto px-6 py-24">
      <div className="grid md:grid-cols-4 gap-8 text-center">

        <div>
          <h2 className="text-5xl font-bold text-emerald-600">
            500+
          </h2>

          <p className="mt-3 text-muted-foreground">
            Kos Terdaftar
          </p>
        </div>

        <div>
          <h2 className="text-5xl font-bold text-emerald-600">
            20+
          </h2>

          <p className="mt-3 text-muted-foreground">
            Kampus
          </p>
        </div>

        <div>
          <h2 className="text-5xl font-bold text-emerald-600">
            1000+
          </h2>

          <p className="mt-3 text-muted-foreground">
            Mahasiswa
          </p>
        </div>

        <div>
          <h2 className="text-5xl font-bold text-emerald-600">
            4.9
          </h2>

          <p className="mt-3 text-muted-foreground">
            Rating
          </p>
        </div>

      </div>
    </section>
  );
}