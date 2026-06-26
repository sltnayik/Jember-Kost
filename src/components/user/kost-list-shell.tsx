"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Filter, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmptyState from "@/components/shared/empty-state";
import KostCard from "@/components/cards/kost-card";
import type { KostCardData, KostFilterOptions } from "@/types/kosts";

interface KostListShellProps {
  initialKosts: KostCardData[];
  initialCount: number;
  filterOptions: KostFilterOptions;
  initialQuery?: string;
  initialCampusId?: string;
  initialDistrict?: string;
  initialGender?: string;
  initialFacilityId?: string;
  initialSort?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  initialStatus?: string;
}

export function KostListShell({
  initialKosts,
  initialCount,
  filterOptions,
  initialQuery = "",
  initialCampusId = "",
  initialDistrict = "",
  initialGender = "",
  initialFacilityId = "",
  initialSort = "latest",
  initialMinPrice = "",
  initialMaxPrice = "",
  initialStatus = "",
}: KostListShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const hasMounted = useRef(false);
  const [query, setQuery] = useState(initialQuery);
  const [campusId, setCampusId] = useState(initialCampusId);
  const [district, setDistrict] = useState(initialDistrict);
  const [gender, setGender] = useState(initialGender);
  const [facilityId, setFacilityId] = useState(initialFacilityId);
  const [sort, setSort] = useState(initialSort);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [status, setStatus] = useState(initialStatus);

  const hasFilters = useMemo(() => Boolean(query || campusId || district || gender || facilityId || minPrice || maxPrice || status), [campusId, district, facilityId, gender, maxPrice, minPrice, query, status]);

  const items = initialKosts;

  function applyFilters(event?: React.FormEvent) {
    event?.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    if (campusId) params.set("campusId", campusId);
    if (district) params.set("district", district);
    if (gender) params.set("gender", gender);
    if (facilityId) params.set("facilityId", facilityId);
    if (sort && sort !== "latest") params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (status) params.set("status", status);

    const target = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(target);
  }

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      applyFilters();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query, campusId, district, gender, facilityId, sort, minPrice, maxPrice, status]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-3xl border border-border/70 bg-background/90 shadow-sm shadow-black/5">
        <CardContent className="p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Temukan kos yang sesuai</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Daftar Kos Jember</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Jelajahi opsi kos terverifikasi dengan pencarian cepat, filter, dan urutan sesuai kebutuhan.</p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              <Filter className="size-4" />
              {initialCount} hasil
            </div>
          </div>

          <form onSubmit={applyFilters} className="mt-6 grid gap-3 lg:grid-cols-[1.3fr_1fr_0.8fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, alamat, kecamatan, kampus..." className="h-12 rounded-2xl border-border/70 bg-background pl-9" />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-12 rounded-2xl border-border/70 bg-background">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Terbaru</SelectItem>
                <SelectItem value="price_low">Termurah</SelectItem>
                <SelectItem value="price_high">Termahal</SelectItem>
                <SelectItem value="name_asc">Nama A-Z</SelectItem>
                <SelectItem value="nearby">Terdekat kampus</SelectItem>
                <SelectItem value="rating_high">Rating terbaik</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" variant="outline" className="h-12 rounded-2xl border-border/70 bg-background">
              <SlidersHorizontal className="mr-2 size-4" />
              Terapkan
            </Button>
            <Button asChild className="h-12 rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90">
              <Link href="/kost">Reset</Link>
            </Button>
          </form>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <Input value={minPrice} onChange={(event) => setMinPrice(event.target.value)} inputMode="numeric" placeholder="Harga min" className="h-11 rounded-2xl border-border/70 bg-background" />
            <Input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} inputMode="numeric" placeholder="Harga max" className="h-11 rounded-2xl border-border/70 bg-background" />
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="h-11 rounded-2xl border-border/70 bg-background">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="putra">Putra</SelectItem>
                <SelectItem value="putri">Putri</SelectItem>
                <SelectItem value="campur">Campur</SelectItem>
              </SelectContent>
            </Select>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="h-11 rounded-2xl border-border/70 bg-background">
                <SelectValue placeholder="Kecamatan" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.districts.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11 rounded-2xl border-border/70 bg-background">
                <SelectValue placeholder="Status kamar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Tersedia</SelectItem>
                <SelectItem value="full">Penuh</SelectItem>
              </SelectContent>
            </Select>
            <Select value={campusId} onValueChange={setCampusId}>
              <SelectTrigger className="h-11 rounded-2xl border-border/70 bg-background">
                <SelectValue placeholder="Kampus" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.campuses.map((campus) => (
                  <SelectItem key={campus.id} value={campus.id}>
                    {campus.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={facilityId} onValueChange={setFacilityId}>
              <SelectTrigger className="h-11 rounded-2xl border-border/70 bg-background">
                <SelectValue placeholder="Fasilitas" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.facilities.map((facility) => (
                  <SelectItem key={facility.id} value={facility.id}>
                    {facility.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasFilters ? <div className="mt-4 text-sm text-muted-foreground">Filter aktif membantu Anda mempersempit hasil pencarian.</div> : null}
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <EmptyState title="Belum ada kos yang cocok" description="Coba ubah kata kunci atau filter untuk melihat hasil lain." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((kost) => (
            <KostCard key={kost.id} kost={kost} />
          ))}
        </div>
      )}
    </div>
  );
}
