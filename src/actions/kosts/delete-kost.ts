"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

const KOST_IMAGES_BUCKET = "kost-images";

type ActionResult = {
  success: boolean;
  message: string;
};

function getStoragePathFromPublicUrl(url: string) {
  const marker = `/object/public/${KOST_IMAGES_BUCKET}/`;
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(markerIndex + marker.length));
}

export async function deleteKost(kostId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Anda harus login terlebih dahulu." };
  }

  const { data: kost, error: kostError } = await supabase
    .from("kosts")
    .select("id")
    .eq("id", kostId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (kostError) {
    return { success: false, message: kostError.message };
  }

  if (!kost) {
    return { success: false, message: "Kos tidak ditemukan atau bukan milik Anda." };
  }

  const { data: images } = await supabase.from("kost_images").select("image_url").eq("kost_id", kostId);
  const storagePaths = (images ?? [])
    .map((image) => getStoragePathFromPublicUrl(image.image_url))
    .filter((path): path is string => Boolean(path));

  await supabase.from("kost_facilities").delete().eq("kost_id", kostId);
  await supabase.from("kost_images").delete().eq("kost_id", kostId);
  await supabase.from("verification_requests").delete().eq("kost_id", kostId);
  await supabase.from("favorites").delete().eq("kost_id", kostId);
  await supabase.from("reviews").delete().eq("kost_id", kostId);
  await supabase.from("reports").delete().eq("kost_id", kostId);

  const { error } = await supabase.from("kosts").delete().eq("id", kostId).eq("owner_id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  if (storagePaths.length > 0) {
    await supabase.storage.from(KOST_IMAGES_BUCKET).remove(storagePaths);
  }

  revalidatePath("/owner");
  revalidatePath("/owner/dashboard");
  revalidatePath("/owner/kost");

  return { success: true, message: "Kos berhasil dihapus." };
}
