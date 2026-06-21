import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Wifi, Bath } from "lucide-react";

export default function KostCard() {
  return (
    <Card className="overflow-hidden rounded-3xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="h-56 bg-gray-200"></div>

      <CardContent className="space-y-4 p-5">
        <div>
          <h3 className="font-bold text-lg">
            Kos Melati
          </h3>

          <div className="flex items-center gap-1 text-yellow-500 mt-1">
            <Star className="w-4 h-4 fill-yellow-500" />
            <span className="text-sm">4.8</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4" />
          Dekat Universitas Jember
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-600" />
            Wifi
          </div>

          <div className="flex items-center gap-2">
            <Bath className="w-4 h-4 text-emerald-600" />
            Kamar mandi dalam
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="font-bold text-emerald-700">
              Rp700.000
            </p>

            <p className="text-xs text-muted-foreground">
              / bulan
            </p>
          </div>

          <Button className="rounded-xl">
            Lihat Detail
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}