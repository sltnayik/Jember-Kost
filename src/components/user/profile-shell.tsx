"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Loader2, Save, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserProfile } from "@/actions/user";
import { removeProfileImage, uploadProfileImage, validateProfileImage } from "@/lib/profile-upload";
import type { AuthProfile } from "@/types/auth";

interface ProfileShellProps {
  profile: AuthProfile;
}

export function ProfileShell({ profile }: ProfileShellProps) {
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

        const result = await updateUserProfile({
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
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="rounded-[2rem] border border-border/70 bg-background shadow-sm shadow-black/5">
      <CardHeader>
        <CardTitle>Profil Anda</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {preview ? (
              <div className="relative size-24 overflow-hidden rounded-2xl border bg-muted">
                <Image src={preview} alt="Preview foto profil" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <Avatar className="size-24 rounded-2xl">
                <AvatarImage src={avatarUrl ?? undefined} alt={profile.full_name} />
                <AvatarFallback className="rounded-2xl bg-primary/10 text-lg font-semibold text-primary">{initials}</AvatarFallback>
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
              <p className="text-xs text-muted-foreground">Preview foto akan muncul sebelum disimpan.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nama</Label>
              <Input id="full_name" name="full_name" defaultValue={profile.full_name} className="h-11 rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor WhatsApp</Label>
              <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} className="h-11 rounded-2xl" />
            </div>
          </div>

          <Button type="submit" className="rounded-2xl bg-primary text-primary-foreground" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : preview ? <Upload className="mr-2 size-4" /> : <Save className="mr-2 size-4" />}
            Simpan profil
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
