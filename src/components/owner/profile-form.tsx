"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Upload } from "lucide-react";
import { toast } from "sonner";

import { updateOwnerProfile } from "@/actions/owner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthProfile } from "@/types/auth";

export function ProfileForm({ profile }: { profile: AuthProfile }) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateOwnerProfile(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  const initials = profile.full_name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="rounded-2xl bg-white shadow-sm shadow-slate-950/5">
      <CardHeader className="border-b bg-green-50/60">
        <CardTitle>Informasi profil</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="grid gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {preview ? (
              <div className="relative size-24 overflow-hidden rounded-2xl border bg-muted">
                <Image src={preview} alt="Preview foto profil" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <Avatar className="size-24 rounded-2xl">
                <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name} />
                <AvatarFallback className="rounded-2xl bg-green-50 text-lg font-semibold text-[#16A34A]">{initials}</AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-2">
              <Label htmlFor="avatar">Foto profil</Label>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
              <p className="text-xs text-muted-foreground">Preview muncul sebelum disimpan. Upload memakai bucket profil yang sudah tersedia.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nama</Label>
              <Input id="full_name" name="full_name" defaultValue={profile.full_name} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor WhatsApp</Label>
              <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} className="h-10" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="h-10 rounded-xl bg-[#16A34A] hover:bg-[#15803D]" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : preview ? <Upload /> : <Save />}
              Simpan profil
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
