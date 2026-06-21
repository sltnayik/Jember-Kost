import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-28">
      <div className="container mx-auto px-6">

        <div className="rounded-[40px] bg-emerald-600 p-16 text-center text-white">

          <h2 className="text-5xl font-bold">
            Temukan Kos Impianmu Sekarang
          </h2>

          <p className="mt-5 text-emerald-100">
            Cari kos terbaik dengan mudah, cepat, dan terpercaya.
          </p>

          <Button
            size="lg"
            className="mt-10 bg-white text-emerald-700 hover:bg-white"
          >
            Cari Kos Sekarang
          </Button>

        </div>
      </div>
    </section>
  );
}