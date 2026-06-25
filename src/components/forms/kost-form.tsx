"use client";

import dynamic from "next/dynamic";
import { AlertCircle, Home, Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createKost } from "@/actions/kosts/create-kost";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createKostSchema, type CreateKostInput } from "@/validations/kost";

const KostLocationMap = dynamic(() => import("@/components/maps/kost-location-map"), {
  ssr: false,
});

export default function KostForm() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateKostInput>({
    defaultValues: {
      name: "",
      description: "",
      gender_type: "putri",
      price: 100000,
      address: "",
      district: "",
      room_total: 1,
      whatsapp: "",
      rules: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const locationSelected = latitude !== "" && longitude !== "";

  async function onSubmit(values: CreateKostInput) {
    setFormError(null);

    const validationResult = createKostSchema.safeParse(values);

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      const message = firstIssue?.message ?? "Silakan lengkapi form dengan benar.";

      setFormError(message);
      toast.error(message);
      return;
    }

    if (!latitude || !longitude) {
      setFormError("Pilih lokasi kos pada peta terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      Object.entries(validationResult.data).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          return;
        }

        if (typeof value === "number") {
          formData.append(key, String(value));
          return;
        }

        formData.append(key, value);
      });

      formData.set("latitude", latitude);
      formData.set("longitude", longitude);

      const result = await createKost(formData);

      if (!result.success) {
        setFormError(result.message);
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      window.location.href = "/owner/kost";
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Gagal menyimpan kos. Silakan coba lagi.";

      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 bg-white/95 shadow-xl shadow-slate-950/10">
      <CardHeader className="border-b border-[#16A34A]/10 bg-linear-to-r from-[#F0FDF4] to-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#16A34A]/10 text-[#16A34A] ring-1 ring-[#16A34A]/15">
            <Home className="size-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-[#0F172A]">Informasi kos baru</CardTitle>
            <CardDescription className="mt-1 text-sm">Lengkapi detail kos dan pilih lokasi agar calon penghuni lebih mudah menemukannya.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            {formError ? (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama kos</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Kos Putri Harmoni" {...field} />
                    </FormControl>
                    <FormDescription>Nama kos yang mudah diingat dan menarik.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe penghuni</FormLabel>
                    <FormControl>
                      <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-[#16A34A] focus-visible:ring-2 focus-visible:ring-[#16A34A]/20" {...field}>
                        <option value="putra">Putra</option>
                        <option value="putri">Putri</option>
                        <option value="campur">Campur</option>
                      </select>
                    </FormControl>
                    <FormDescription>Pilih tipe penghuni yang sesuai.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga per bulan</FormLabel>
                    <FormControl>
                      <Input type="number" min="100000" step="1000" placeholder="1000000" value={field.value ?? ""} onChange={(event) => field.onChange(event.target.value === "" ? 0 : Number(event.target.value))} />
                    </FormControl>
                    <FormDescription>Harga dalam rupiah per bulan.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="room_total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah kamar</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" step="1" placeholder="10" value={field.value ?? ""} onChange={(event) => field.onChange(event.target.value === "" ? 0 : Number(event.target.value))} />
                    </FormControl>
                    <FormDescription>Jumlah kamar yang tersedia.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Alamat lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Jalan Merdeka No. 12" {...field} />
                    </FormControl>
                    <FormDescription>Alamat yang akan ditampilkan kepada calon penghuni.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kecamatan</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Sumbersari" {...field} />
                    </FormControl>
                    <FormDescription>Isi kecamatan kos berada.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 081234567890" {...field} />
                    </FormControl>
                    <FormDescription>Nomor yang bisa dihubungi calon penghuni.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Jelaskan fasilitas, lingkungan, dan keunggulan kos Anda." className="min-h-28" {...field} />
                    </FormControl>
                    <FormDescription>Deskripsi minimal 20 karakter agar lebih menarik.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rules"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Aturan kos</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Contoh: Tidak boleh merokok, jam malam 22.00, tamu wajib lapor." className="min-h-24" {...field} />
                    </FormControl>
                    <FormDescription>Berikan aturan yang jelas untuk penghuni.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-2xl border border-[#16A34A]/15 bg-[#F0FDF4]/70 p-4">
              <div className="mb-3 flex items-start gap-2">
                <MapPin className="mt-0.5 size-5 shrink-0 text-[#16A34A]" />
                <div>
                  <p className="font-medium text-[#0F172A]">Lokasi kos</p>
                  <p className="text-sm text-muted-foreground">Klik peta untuk menentukan lokasi kos. Kampus terdekat akan dipilih otomatis.</p>
                </div>
              </div>

              <KostLocationMap
                onChange={(lat, lng) => {
                  setLatitude(String(lat));
                  setLongitude(String(lng));
                  form.setValue("latitude", lat, {
                    shouldValidate: true,
                  });
                  form.setValue("longitude", lng, {
                    shouldValidate: true,
                  });
                }}
              />

              {!locationSelected ? (
                <Alert className="mt-4 border-[#16A34A]/20 bg-white/90 text-[#166534]">
                  <AlertCircle className="size-4" />
                  <AlertDescription>Silakan pilih lokasi pada peta agar sistem bisa menentukan kampus terdekat.</AlertDescription>
                </Alert>
              ) : (
                <div className="mt-4 rounded-xl border border-[#16A34A]/20 bg-white px-3 py-2 text-sm text-[#166534]">
                  <p className="font-medium">Lokasi dipilih</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Latitude: {latitude} · Longitude: {longitude}
                  </p>
                </div>
              )}

              <input type="hidden" name="latitude" value={latitude} />
              <input type="hidden" name="longitude" value={longitude} />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border/60 pt-4">
              <Button type="submit" className="h-11 rounded-xl bg-[#16A34A] px-5 text-white hover:bg-[#15803D]" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 animate-spin" /> : null}
                {isSubmitting ? "Menyimpan..." : "Simpan kos"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
