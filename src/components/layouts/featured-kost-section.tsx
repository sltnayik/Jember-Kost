import KostCard from "@/components/cards/kost-card";

export default function FeaturedKostSection() {
  return (
    <section className="container mx-auto px-6 py-24">
      <div className="mb-12">
        <h2 className="text-4xl font-bold">
          Kos Populer di Jember
        </h2>

        <p className="text-muted-foreground mt-3">
          Temukan kos terbaik dengan fasilitas lengkap dan lokasi strategis.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <KostCard />
        <KostCard />
        <KostCard />
      </div>
    </section>
  );
}