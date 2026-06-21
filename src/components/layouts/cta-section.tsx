import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-primary px-6 py-14 text-center text-primary-foreground shadow-md shadow-primary/20 sm:px-10 lg:px-16">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">Temukan Kos Impianmu Sekarang</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-primary-foreground/80 sm:text-base">Mulai dari tampilan yang lebih modern dan nyaman, lalu lanjutkan pencarian kos dengan lebih cepat dan percaya diri.</p>
          <Button size="lg" className="mt-8 rounded-2xl bg-background px-6 text-foreground shadow-sm shadow-black/10 hover:bg-background/90">
            Cari Kos
          </Button>
        </div>
      </div>
    </section>
  );
}
