import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          <div>
            <h2 className="font-bold text-2xl text-emerald-600">
              JemberKost
            </h2>

            <p className="mt-4 text-sm text-muted-foreground">
              Platform pencarian kos modern untuk mahasiswa dan masyarakat di Kabupaten Jember.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">
              Navigasi
            </h3>

            <div className="space-y-3 text-sm text-muted-foreground">
              <Link href="/">Beranda</Link>
              <br />
              <Link href="/kost">Daftar Kos</Link>
              <br />
              <Link href="/map">Peta</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">
              Informasi
            </h3>

            <div className="space-y-3 text-sm text-muted-foreground">
              <Link href="/about">Tentang</Link>
              <br />
              <Link href="/contact">Kontak</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">
              Kontak
            </h3>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>Jember, Jawa Timur</p>
              <p>support@jemberkost.com</p>
            </div>
          </div>

        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          © 2026 JemberKost. All rights reserved.
        </div>

      </div>
    </footer>
  );
}