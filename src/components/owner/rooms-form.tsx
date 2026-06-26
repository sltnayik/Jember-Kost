"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { updateKostRooms } from "@/actions/kosts/update-kost";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OwnerKostDetail } from "@/services/owner.service";

export function RoomsForm({ kost }: { kost: OwnerKostDetail }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateKostRooms(kost.id, formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <Card className="rounded-2xl bg-white shadow-sm shadow-slate-950/5">
      <CardHeader className="border-b bg-green-50/60">
        <CardTitle>Kelola kamar</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="room_total">Jumlah kamar</Label>
            <Input id="room_total" name="room_total" type="number" min={1} defaultValue={kost.room_total ?? 1} className="h-10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room_available">Kamar tersedia</Label>
            <Input id="room_available" name="room_available" type="number" min={0} defaultValue={kost.room_available ?? 0} className="h-10" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button className="h-10 rounded-xl bg-[#16A34A] hover:bg-[#15803D]" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : <Save />}
              Simpan kamar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
