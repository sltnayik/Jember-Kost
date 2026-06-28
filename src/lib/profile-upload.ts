"use client";

import { createClient } from "@/lib/supabase/client";

const PROFILE_BUCKET = "profile";
const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024;

export type UploadedProfileImage = {
  publicUrl: string;
  path: string;
};

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension) {
    return extension;
  }

  return file.type.split("/")[1] || "jpg";
}

export function validateProfileImage(file: File) {
  if (!file.type.startsWith("image/")) {
    return "File harus berupa gambar.";
  }

  if (file.size > MAX_PROFILE_IMAGE_SIZE) {
    return "Ukuran foto profil maksimal 2 MB.";
  }

  return null;
}

export async function uploadProfileImage(file: File): Promise<UploadedProfileImage> {
  const validationError = validateProfileImage(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Anda harus login terlebih dahulu.");
  }

  const path = `${user.id}/${crypto.randomUUID()}.${getFileExtension(file)}`;
  const { error } = await supabase.storage.from(PROFILE_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PROFILE_BUCKET).getPublicUrl(path);

  return { publicUrl, path };
}

export async function removeProfileImage(path: string) {
  const supabase = createClient();
  await supabase.storage.from(PROFILE_BUCKET).remove([path]);
}
