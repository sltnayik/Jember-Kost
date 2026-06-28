"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Home, ImagePlus, Loader2, MapPin, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createKost } from "@/actions/kosts/create-kost";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { createKostSchema, type CreateKostInput } from "@/validations/kost";

const KostLocationMap = dynamic(() => import("@/components/maps/kost-location-map"), {
  ssr: false,
});

const MAX_KOST_IMAGES = 10;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const CREATE_KOST_TIMEOUT_MS = 45000;

type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type Facility = {
  id: string;
  name: string;
  icon: string | null;
};

function getFileExtension(file: File) {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

function withActionTimeout<T>(promise: Promise<T>, timeoutMs: number, fallbackMessage: string) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error(fallbackMessage));
    }, timeoutMs);

    promise.then(
      (value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      },
    );
  });
}

export default function KostForm({ facilities = [] }: { facilities?: Facility[] }) {
  const router = useRouter();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<Set<string>>(new Set());
  const [thumbnailId, setThumbnailId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectedImagesRef = useRef<SelectedImage[]>([]);

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
  const thumbnailIndex = selectedImages.findIndex((image) => image.id === thumbnailId);

  useEffect(() => {
    selectedImagesRef.current = selectedImages;
  }, [selectedImages]);

  useEffect(() => {
    return () => {
      selectedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  function setImageError(message: string) {
    setFormError(message);
    toast.error(message);
  }

  function validateImage(file: File) {
    const extension = getFileExtension(file);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type) || !ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
      return "Format foto harus jpg, jpeg, png, atau webp.";
    }

    return null;
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    if (selectedImages.length + files.length > MAX_KOST_IMAGES) {
      setImageError(`Maksimal ${MAX_KOST_IMAGES} foto kos.`);
      event.target.value = "";
      return;
    }

    const nextImages: SelectedImage[] = [];

    for (const file of files) {
      const imageError = validateImage(file);

      if (imageError) {
        nextImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
        setImageError(imageError);
        event.target.value = "";
        return;
      }

      nextImages.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    setFormError(null);
    const shouldSetInitialThumbnail = !thumbnailId && selectedImages.length === 0 && nextImages[0];

    setSelectedImages((currentImages) => {
      const images = [...currentImages, ...nextImages];

      return images;
    });

    if (shouldSetInitialThumbnail) {
      setThumbnailId(nextImages[0].id);
    }
    event.target.value = "";
  }

  function removeImage(imageId: string) {
    setSelectedImages((currentImages) => {
      const removedImage = currentImages.find((image) => image.id === imageId);
      const images = currentImages.filter((image) => image.id !== imageId);

      if (removedImage) {
        URL.revokeObjectURL(removedImage.previewUrl);
      }

      if (thumbnailId === imageId) {
        setThumbnailId(images[0]?.id ?? null);
      }

      return images;
    });
  }

  function toggleFacility(facilityId: string, checked: boolean) {
    setSelectedFacilityIds((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(facilityId);
      } else {
        next.delete(facilityId);
      }

      return next;
    });
  }

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
      formData.set("thumbnail_index", String(thumbnailIndex >= 0 ? thumbnailIndex : 0));
      selectedFacilityIds.forEach((facilityId) => formData.append("facility_ids", facilityId));

      console.log("CLIENT IMAGE SUBMIT", {
        selectedImageCount: selectedImages.length,
        images: selectedImages.map((image) => ({
          name: image.file.name,
          size: image.file.size,
          type: image.file.type,
        })),
      });

      selectedImages.forEach((image) => {
        formData.append("images", image.file, image.file.name);
      });

      const result = await withActionTimeout(createKost(formData), CREATE_KOST_TIMEOUT_MS, "Permintaan menyimpan kos terlalu lama. Silakan coba lagi.");

      if (!result?.success) {
        const message = result?.message ?? "Gagal menyimpan kos. Silakan coba lagi.";
        setFormError(message);
        toast.error(message, {
          description: "Foto kos tidak berhasil diunggah. Periksa bucket storage dan kebijakan akses Supabase.",
        });
        return;
      }

      setIsSubmitting(false);
      toast.success(result.message ?? "Kos berhasil disimpan.");

      router.replace(result.redirectTo ?? "/owner/kost");
      router.refresh();
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

            <div className="rounded-2xl border border-border/70 bg-white p-4">
              <div className="mb-4">
                <p className="font-medium text-[#0F172A]">Fasilitas</p>
                <p className="mt-1 text-sm text-muted-foreground">Pilih fasilitas yang tersedia di kos.</p>
              </div>

              {facilities.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {facilities.map((facility) => {
                    const checked = selectedFacilityIds.has(facility.id);

                    return (
                      <label
                        key={facility.id}
                        htmlFor={`facility-${facility.id}`}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition hover:border-[#16A34A]/40 hover:bg-green-50/50"
                      >
                        <Checkbox
                          id={`facility-${facility.id}`}
                          name="facility_ids"
                          value={facility.id}
                          checked={checked}
                          onCheckedChange={(value) => toggleFacility(facility.id, value === true)}
                        />
                        <span className="text-sm font-medium text-[#0F172A]">{facility.name}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada fasilitas tersedia.</p>
              )}
            </div>

            <div className="rounded-2xl border border-border/70 bg-white p-4">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-[#0F172A]">Foto kos</p>
                  <p className="mt-1 text-sm text-muted-foreground">Unggah hingga {MAX_KOST_IMAGES} foto. Format yang didukung: jpg, jpeg, png, webp.</p>
                </div>

                <Button type="button" variant="outline" className="w-full sm:w-auto" disabled={isSubmitting || selectedImages.length >= MAX_KOST_IMAGES} onClick={() => fileInputRef.current?.click()}>
                  <ImagePlus />
                  Tambah foto
                </Button>
              </div>

              <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" multiple className="sr-only" disabled={isSubmitting} onChange={handleImageChange} />

              {selectedImages.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedImages.map((image) => {
                    const isThumbnail = image.id === thumbnailId;

                    return (
                      <div key={image.id} className="overflow-hidden rounded-xl border bg-muted/40">
                        <div className="relative">
                          <div className="relative aspect-[4/3]">
                            <Image src={image.previewUrl} alt={image.file.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" unoptimized className="object-cover" />
                          </div>
                          {isThumbnail ? (
                            <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#16A34A] px-2 py-1 text-xs font-medium text-white">
                              <Check className="size-3" />
                              Thumbnail
                            </div>
                          ) : null}
                        </div>

                        <div className="grid gap-2 p-3">
                          <p className="truncate text-sm font-medium text-[#0F172A]">{image.file.name}</p>
                          <div className="flex gap-2">
                            <Button type="button" size="sm" variant={isThumbnail ? "secondary" : "outline"} className="flex-1" disabled={isSubmitting} onClick={() => setThumbnailId(image.id)}>
                              {isThumbnail ? "Thumbnail" : "Jadikan thumbnail"}
                            </Button>
                            <Button type="button" size="icon-sm" variant="destructive" disabled={isSubmitting} aria-label={`Hapus ${image.file.name}`} onClick={() => removeImage(image.id)}>
                              <Trash2 />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-4 text-center">
                  <ImagePlus className="mb-3 size-8 text-muted-foreground" />
                  <p className="text-sm font-medium text-[#0F172A]">Belum ada foto dipilih</p>
                  <p className="mt-1 text-sm text-muted-foreground">Foto dapat dipilih sekaligus sebelum kos disimpan.</p>
                </div>
              )}
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
