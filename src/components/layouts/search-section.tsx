import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SearchSection() {
  return (
    <section className="relative z-10 -mt-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-border/70 bg-background p-4 shadow-md shadow-black/10 sm:p-6 lg:p-8">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr_auto]">
            <Select>
              <SelectTrigger className="h-14 w-full rounded-2xl border-border/70 bg-background px-4 text-sm shadow-sm shadow-black/5">
                <SelectValue placeholder="Kecamatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sumbersari">Sumbersari</SelectItem>
                <SelectItem value="jember-kidul">Jember Kidul</SelectItem>
                <SelectItem value="patrang">Patrang</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="h-14 w-full rounded-2xl border-border/70 bg-background px-4 text-sm shadow-sm shadow-black/5">
                <SelectValue placeholder="Jenis kos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="putra">Putra</SelectItem>
                <SelectItem value="putri">Putri</SelectItem>
                <SelectItem value="campur">Campur</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="Harga maksimal" className="h-14 rounded-2xl border-border/70 bg-background px-4 shadow-sm shadow-black/5" />

            <Button className="h-14 rounded-2xl bg-primary px-6 text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90">
              <Search className="size-5" />
              Cari Sekarang
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
