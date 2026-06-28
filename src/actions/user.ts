"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/auth";

const PROFILE_BUCKET = "profile";

type ActionResult = {
  success: boolean;
  message: string;
  avatarUrl?: string;
};

function getStoragePathFromPublicUrl(url: string, bucket: string) {
  const marker = `/object/public/${bucket}/`;
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(url.substring(markerIndex + marker.length));
}

type UpdateProfileInput = {
  fullName: string;
  phone: string;
  avatarUrl?: string | null;
};

export async function updateUserProfile(input: UpdateProfileInput): Promise<ActionResult> {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, message: "Anda harus login terlebih dahulu." };
  }

  const supabase = await createClient();
  const fullName = input.fullName.trim();
  const phone = input.phone.trim();
  const avatarUrl = input.avatarUrl?.trim() || null;

  if (fullName.length < 3) {
    return { success: false, message: "Nama minimal 3 karakter." };
  }

  const updatePayload: {
    full_name: string;
    phone: string | null;
    avatar_url?: string;
    updated_at: string;
  } = {
    full_name: fullName,
    phone: phone || null,
    updated_at: new Date().toISOString(),
  };

  if (avatarUrl) {
    updatePayload.avatar_url = avatarUrl;
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const { error } = await supabase.from("profiles").update(updatePayload).eq("id", user.id);

  if (error) {
    if (updatePayload.avatar_url) {
      const newPath = getStoragePathFromPublicUrl(updatePayload.avatar_url, PROFILE_BUCKET);

      if (newPath) {
        await supabase.storage.from(PROFILE_BUCKET).remove([newPath]);
      }
    }

    return { success: false, message: error.message };
  }

  // Delete old avatar if new one was uploaded
  if (updatePayload.avatar_url && currentProfile?.avatar_url) {
    const oldPath = getStoragePathFromPublicUrl(currentProfile.avatar_url, PROFILE_BUCKET);

    if (oldPath) {
      await supabase.storage.from(PROFILE_BUCKET).remove([oldPath]);
    }
  }

  revalidatePath("/user/profile");
  revalidatePath("/admin");
  return { success: true, message: "Profil berhasil diperbarui.", avatarUrl: updatePayload.avatar_url };
}
