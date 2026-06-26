"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

const KOST_IMAGES_BUCKET = "kost-images";
const PROFILE_BUCKET_CANDIDATES = ["avatars", "profile-images", "profiles"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

type ActionResult = {
  success: boolean;
  message: string;
};

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
    return extension;
  }

  const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return extensionByType[file.type] ?? "";
}

function isValidImage(file: File) {
  return ALLOWED_IMAGE_TYPES.includes(file.type) && ALLOWED_IMAGE_EXTENSIONS.includes(getFileExtension(file));
}

function getStoragePathFromPublicUrl(url: string, bucket: string) {
  const marker = `/object/public/${bucket}/`;
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(markerIndex + marker.length));
}

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, userId: user?.id ?? null };
}

async function ensureOwnedKost(supabase: Awaited<ReturnType<typeof createClient>>, kostId: string, userId: string) {
  const { data: kost, error } = await supabase
    .from("kosts")
    .select("id")
    .eq("id", kostId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(kost);
}

export async function updateKostFacilities(kostId: string, formData: FormData): Promise<ActionResult> {
  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { success: false, message: "Anda harus login terlebih dahulu." };
  }

  if (!(await ensureOwnedKost(supabase, kostId, userId))) {
    return { success: false, message: "Kos tidak ditemukan atau bukan milik Anda." };
  }

  const facilityIds = formData.getAll("facility_ids").filter((value): value is string => typeof value === "string");

  const { error: deleteError } = await supabase.from("kost_facilities").delete().eq("kost_id", kostId);

  if (deleteError) {
    return { success: false, message: deleteError.message };
  }

  if (facilityIds.length > 0) {
    const { error: insertError } = await supabase.from("kost_facilities").insert(
      facilityIds.map((facilityId) => ({
        kost_id: kostId,
        facility_id: facilityId,
      })),
    );

    if (insertError) {
      return { success: false, message: insertError.message };
    }
  }

  revalidatePath("/owner/kost");
  revalidatePath(`/owner/kost/${kostId}`);
  revalidatePath(`/owner/kost/${kostId}/facilities`);

  return { success: true, message: "Fasilitas berhasil diperbarui." };
}

export async function addKostPhotos(kostId: string, formData: FormData): Promise<ActionResult> {
  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { success: false, message: "Anda harus login terlebih dahulu." };
  }

  if (!(await ensureOwnedKost(supabase, kostId, userId))) {
    return { success: false, message: "Kos tidak ditemukan atau bukan milik Anda." };
  }

  const files = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length === 0) {
    return { success: false, message: "Pilih minimal satu foto." };
  }

  for (const file of files) {
    if (!isValidImage(file)) {
      return { success: false, message: "Format foto harus jpg, jpeg, png, atau webp." };
    }
  }

  const uploadedPaths: string[] = [];
  const rows = [];

  try {
    for (const file of files) {
      const extension = getFileExtension(file);
      const path = `${userId}/${kostId}/${crypto.randomUUID()}.${extension}`;
      const upload = await supabase.storage.from(KOST_IMAGES_BUCKET).upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

      if (upload.error) {
        throw new Error(upload.error.message);
      }

      uploadedPaths.push(path);

      const {
        data: { publicUrl },
      } = supabase.storage.from(KOST_IMAGES_BUCKET).getPublicUrl(path);

      rows.push({
        kost_id: kostId,
        image_url: publicUrl,
        is_thumbnail: false,
      });
    }

    const { data: currentImages } = await supabase.from("kost_images").select("id").eq("kost_id", kostId).limit(1);

    if (rows.length > 0 && (!currentImages || currentImages.length === 0)) {
      rows[0].is_thumbnail = true;
    }

    const { error } = await supabase.from("kost_images").insert(rows);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(KOST_IMAGES_BUCKET).remove(uploadedPaths);
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengunggah foto.",
    };
  }

  revalidatePath("/owner/kost");
  revalidatePath(`/owner/kost/${kostId}`);
  revalidatePath(`/owner/kost/${kostId}/photos`);

  return { success: true, message: "Foto berhasil ditambahkan." };
}

export async function deleteKostPhoto(kostId: string, imageId: string): Promise<ActionResult> {
  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { success: false, message: "Anda harus login terlebih dahulu." };
  }

  if (!(await ensureOwnedKost(supabase, kostId, userId))) {
    return { success: false, message: "Kos tidak ditemukan atau bukan milik Anda." };
  }

  const { data: image, error: imageError } = await supabase
    .from("kost_images")
    .select("id, image_url, is_thumbnail")
    .eq("id", imageId)
    .eq("kost_id", kostId)
    .maybeSingle();

  if (imageError) {
    return { success: false, message: imageError.message };
  }

  if (!image) {
    return { success: false, message: "Foto tidak ditemukan." };
  }

  const { error } = await supabase.from("kost_images").delete().eq("id", imageId).eq("kost_id", kostId);

  if (error) {
    return { success: false, message: error.message };
  }

  const path = getStoragePathFromPublicUrl(image.image_url, KOST_IMAGES_BUCKET);

  if (path) {
    await supabase.storage.from(KOST_IMAGES_BUCKET).remove([path]);
  }

  if (image.is_thumbnail) {
    const { data: nextImage } = await supabase
      .from("kost_images")
      .select("id")
      .eq("kost_id", kostId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextImage) {
      await supabase.from("kost_images").update({ is_thumbnail: true }).eq("id", nextImage.id);
    }
  }

  revalidatePath("/owner/kost");
  revalidatePath(`/owner/kost/${kostId}`);
  revalidatePath(`/owner/kost/${kostId}/photos`);

  return { success: true, message: "Foto berhasil dihapus." };
}

export async function setKostThumbnail(kostId: string, imageId: string): Promise<ActionResult> {
  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { success: false, message: "Anda harus login terlebih dahulu." };
  }

  if (!(await ensureOwnedKost(supabase, kostId, userId))) {
    return { success: false, message: "Kos tidak ditemukan atau bukan milik Anda." };
  }

  await supabase.from("kost_images").update({ is_thumbnail: false }).eq("kost_id", kostId);
  const { error } = await supabase.from("kost_images").update({ is_thumbnail: true }).eq("id", imageId).eq("kost_id", kostId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/owner/kost");
  revalidatePath(`/owner/kost/${kostId}`);
  revalidatePath(`/owner/kost/${kostId}/photos`);

  return { success: true, message: "Thumbnail berhasil diperbarui." };
}

export async function updateOwnerProfile(formData: FormData): Promise<ActionResult> {
  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { success: false, message: "Anda harus login terlebih dahulu." };
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const avatar = formData.get("avatar");

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

  if (avatar instanceof File && avatar.size > 0) {
    if (!isValidImage(avatar)) {
      return { success: false, message: "Format foto profil harus jpg, jpeg, png, atau webp." };
    }

    const { data: buckets } = await supabase.storage.listBuckets();
    const bucket = PROFILE_BUCKET_CANDIDATES.find((bucketName) => buckets?.some((item) => item.name === bucketName));

    if (!bucket) {
      return { success: false, message: "Bucket foto profil belum tersedia di Supabase." };
    }

    const extension = getFileExtension(avatar);
    const path = `${userId}/${crypto.randomUUID()}.${extension}`;
    const upload = await supabase.storage.from(bucket).upload(path, avatar, {
      contentType: avatar.type || "application/octet-stream",
      upsert: false,
    });

    if (upload.error) {
      return { success: false, message: upload.error.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    updatePayload.avatar_url = publicUrl;
  }

  const { error } = await supabase.from("profiles").update(updatePayload).eq("id", userId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/owner/profile");
  revalidatePath("/owner");
  revalidatePath("/owner/dashboard");

  return { success: true, message: "Profil berhasil diperbarui." };
}
