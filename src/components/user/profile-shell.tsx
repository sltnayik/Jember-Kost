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
import { updateOwnerProfile } from "@/actions/owner";
import type { AuthProfile } from "@/types/auth";

interface ProfileShellProps {
  profile: AuthProfile;
}

export function ProfileShell({ profile }: ProfileShellProps) {
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
        <form action={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {preview ? (
              <div className="relative size-24 overflow-hidden rounded-2xl border bg-muted">
                <Image src={preview} alt="Preview foto profil" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <Avatar className="size-24 rounded-2xl">
                <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name} />
                <AvatarFallback className="rounded-2xl bg-primary/10 text-lg font-semibold text-primary">{initials}</AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-2">
              <Label htmlFor="avatar">Foto profil</Label>
              <Input id="avatar" name="avatar" type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(event) => setPreview(event.target.files?.[0] ? URL.createObjectURL(event.target.files[0]) : null)} />
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
