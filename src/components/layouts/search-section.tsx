import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchSection() {
  return (
    <section className="-mt-10 relative z-10">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-xl border p-6">

          <div className="grid md:grid-cols-4 gap-4">

            <Input
              placeholder="Nama kos atau alamat"
              className="h-14 rounded-2xl"
            />

            <Input
              placeholder="Kecamatan"
              className="h-14 rounded-2xl"
            />

            <Input
              placeholder="Budget maksimal"
              className="h-14 rounded-2xl"
            />

            <Button className="h-14 rounded-2xl">
              <Search className="mr-2 h-5 w-5" />
              Cari Kos
            </Button>

          </div>
        </div>
      </div>
    </section>
  );
}