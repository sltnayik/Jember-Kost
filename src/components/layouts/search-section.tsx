"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    const target = trimmed ? `/kost?query=${encodeURIComponent(trimmed)}` : "/kost";
    router.push(target);
  }

  return (
    <section className="relative z-10 -mt-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-border/70 bg-background p-4 shadow-md shadow-black/10 sm:p-6 lg:p-8">
          <form onSubmit={handleSearch} className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama kos, alamat, kecamatan, atau kampus terdekat"
              className="h-14 rounded-2xl border-border/70 bg-background px-4 shadow-sm shadow-black/5"
            />

            <Button type="submit" className="h-14 rounded-2xl bg-primary px-6 text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90">
              <Search className="mr-2 size-5" />
              Cari Sekarang
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
