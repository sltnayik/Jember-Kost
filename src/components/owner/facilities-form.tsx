"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { updateKostFacilities } from "@/actions/owner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Facility = {
  id: string;
  name: string;
  icon: string | null;
};

export function FacilitiesForm({
  kostId,
  facilities,
  selectedFacilityIds,
}: {
  kostId: string;
  facilities: Facility[];
  selectedFacilityIds: string[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(new Set(selectedFacilityIds));
  const [isPending, startTransition] = useTransition();

  function toggle(facilityId: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(facilityId);
      } else {
        next.delete(facilityId);
      }

      return next;
    });
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateKostFacilities(kostId, formData);

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
        <CardTitle>Checklist fasilitas</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => {
              const checked = selected.has(facility.id);

              return (
                <Label
                  key={facility.id}
                  htmlFor={facility.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition hover:border-[#16A34A]/40 hover:bg-green-50/50"
                >
                  <Checkbox id={facility.id} name="facility_ids" value={facility.id} checked={checked} onCheckedChange={(value) => toggle(facility.id, value === true)} />
                  <span className="text-sm font-medium text-[#0F172A]">{facility.name}</span>
                </Label>
              );
            })}
          </div>
          <div className="flex justify-end">
            <Button className="h-10 rounded-xl bg-[#16A34A] hover:bg-[#15803D]" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : <Save />}
              Simpan fasilitas
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
