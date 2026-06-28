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
import { removeProfileImage, uploadProfileImage, validateProfileImage } from "@/lib/profile-upload";
import type { AuthProfile } from "@/types/auth";

export function ProfileForm({ profile }: { profile: AuthProfile }) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("full_name") ?? "");
    const phone = String(formData.get("phone") ?? "");

    startTransition(async () => {
      let uploadedPath: string | null = null;
      let nextAvatarUrl: string | null = null;

      try {
        if (selectedFile) {
          const uploaded = await uploadProfileImage(selectedFile);
          uploadedPath = uploaded.path;
          nextAvatarUrl = uploaded.publicUrl;
        }

        const result = await updateOwnerProfile({
          fullName,
          phone,
          avatarUrl: nextAvatarUrl,
        });

        if (!result.success) {
          if (uploadedPath) {
            await removeProfileImage(uploadedPath);
          }

          toast.error(result.message);
          return;
        }

        if (result.avatarUrl) {
          setAvatarUrl(result.avatarUrl);
        }

        setSelectedFile(null);
        setPreview(null);
        toast.success(result.message);
        router.refresh();
      } catch (error) {
        if (uploadedPath) {
          await removeProfileImage(uploadedPath);
        }

        toast.error(error instanceof Error ? error.message : "Gagal memperbarui profil.");
      }
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
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {preview ? (
              <div className="relative size-24 overflow-hidden rounded-2xl border bg-muted">
                <Image src={preview} alt="Preview foto profil" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <Avatar className="size-24 rounded-2xl">
                <AvatarImage src={avatarUrl ?? undefined} alt={profile.full_name} />
                <AvatarFallback className="rounded-2xl bg-green-50 text-lg font-semibold text-[#16A34A]">{initials}</AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-2">
              <Label htmlFor="avatar">Foto profil</Label>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;

                  if (!file) {
                    setSelectedFile(null);
                    setPreview(null);
                    return;
                  }

                  const validationError = validateProfileImage(file);

                  if (validationError) {
                    toast.error(validationError);
                    event.target.value = "";
                    setSelectedFile(null);
                    setPreview(null);
                    return;
                  }

                  setSelectedFile(file);
                  setPreview(URL.createObjectURL(file));
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
