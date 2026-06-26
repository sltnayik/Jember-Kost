"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { updateKost } from "@/actions/kosts/update-kost";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { OwnerKostDetail } from "@/services/owner.service";

export function EditKostForm({ kost }: { kost: OwnerKostDetail }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateKost(kost.id, formData);

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
        <CardTitle>Informasi kos</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nama kos" name="name" defaultValue={kost.name} />
            <div className="space-y-2">
              <Label htmlFor="gender_type">Gender</Label>
              <select
                id="gender_type"
                name="gender_type"
                defaultValue={kost.gender_type}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-[#16A34A] focus-visible:ring-3 focus-visible:ring-[#16A34A]/30"
              >
                <option value="putra">Putra</option>
                <option value="putri">Putri</option>
                <option value="campur">Campur</option>
              </select>
            </div>
            <Field label="Harga per bulan" name="price" type="number" min={100000} step={1000} defaultValue={kost.price} />
            <Field label="Nomor WhatsApp" name="whatsapp" defaultValue={kost.whatsapp ?? ""} />
            <Field label="Jumlah kamar" name="room_total" type="number" min={1} defaultValue={kost.room_total ?? 1} />
            <Field label="Kamar tersedia" name="room_available" type="number" min={0} defaultValue={kost.room_available ?? 0} />
            <Field label="Kecamatan" name="district" defaultValue={kost.district ?? ""} />
            <Field label="Latitude" name="latitude" type="number" step="any" defaultValue={kost.latitude ?? ""} />
            <Field label="Longitude" name="longitude" type="number" step="any" defaultValue={kost.longitude ?? ""} />
            <Field label="Alamat lengkap" name="address" defaultValue={kost.address} className="md:col-span-2" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" name="description" defaultValue={kost.description ?? ""} className="min-h-28" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rules">Rules</Label>
            <Textarea id="rules" name="rules" defaultValue={kost.rules ?? ""} className="min-h-24" />
          </div>
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>Pastikan kamar tersedia tidak lebih besar dari jumlah kamar.</AlertDescription>
          </Alert>
          <div className="flex justify-end">
            <Button className="h-10 rounded-xl bg-[#16A34A] hover:bg-[#15803D]" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : <Save />}
              Simpan perubahan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  name,
  className,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
  name: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} className="mt-2 h-10" {...props} />
    </div>
  );
}
