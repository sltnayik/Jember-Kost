"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { addKostPhotos, deleteKostPhoto, setKostThumbnail } from "@/actions/owner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { OwnerKostDetail } from "@/services/owner.service";

export function PhotosManager({ kost }: { kost: OwnerKostDetail }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleUpload() {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file, file.name));

    startTransition(async () => {
      const result = await addKostPhotos(kost.id, formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setFiles([]);
      if (fileRef.current) {
        fileRef.current.value = "";
      }
      router.refresh();
    });
  }

  function runPhotoAction(action: () => Promise<{ success: boolean; message: string }>) {
    startTransition(async () => {
      const result = await action();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <Card className="rounded-2xl bg-white shadow-sm shadow-slate-950/5">
        <CardHeader className="border-b bg-green-50/60">
          <CardTitle>Tambah foto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          />
          <div className="flex flex-col gap-3 rounded-xl border border-dashed bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-[#0F172A]">{files.length > 0 ? `${files.length} foto siap diunggah` : "Pilih foto kos"}</p>
              <p className="mt-1 text-sm text-muted-foreground">Urutan foto mengikuti waktu unggah. Format: jpg, jpeg, png, webp.</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={isPending}>
                <ImagePlus />
                Pilih
              </Button>
              <Button type="button" className="bg-[#16A34A] hover:bg-[#15803D]" onClick={handleUpload} disabled={isPending || files.length === 0}>
                {isPending ? <Loader2 className="animate-spin" /> : <ImagePlus />}
                Upload
              </Button>
            </div>
          </div>
          {isPending ? <div className="h-2 overflow-hidden rounded-full bg-green-100"><div className="h-full w-2/3 animate-pulse rounded-full bg-[#16A34A]" /></div> : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kost.images.map((image, index) => (
          <Card key={image.id} className="rounded-2xl bg-white shadow-sm shadow-slate-950/5">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image src={image.image_url} alt={`${kost.name} foto ${index + 1}`} fill sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-[#0F172A] shadow-sm">Urutan {index + 1}</div>
              {image.is_thumbnail ? (
                <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#16A34A] px-3 py-1 text-xs font-medium text-white shadow-sm">
                  <Check className="size-3" />
                  Thumbnail
                </div>
              ) : null}
            </div>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled={isPending || Boolean(image.is_thumbnail)} onClick={() => runPhotoAction(() => setKostThumbnail(kost.id, image.id))}>
                <Star />
                Jadikan thumbnail
              </Button>
              <DeletePhotoButton disabled={isPending} onConfirm={() => runPhotoAction(() => deleteKostPhoto(kost.id, image.id))} />
            </CardContent>
          </Card>
        ))}
      </div>

      {kost.images.length === 0 ? (
        <Card className="rounded-2xl bg-white p-10 text-center text-sm text-muted-foreground shadow-sm shadow-slate-950/5">Belum ada foto untuk kos ini.</Card>
      ) : null}
    </div>
  );
}

function DeletePhotoButton({ disabled, onConfirm }: { disabled: boolean; onConfirm: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={disabled}>
          <Trash2 />
          Hapus
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus foto?</DialogTitle>
          <DialogDescription>Foto akan dihapus dari daftar kos dan storage bila path tersedia.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={onConfirm}>
              <Trash2 />
              Hapus
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
