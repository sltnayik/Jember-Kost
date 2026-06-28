"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/services/auth";

type ActionResult = {
  success: boolean;
  message: string;
};

export async function deleteUser(userId: string): Promise<ActionResult> {
  const profile = await getCurrentProfile();

  if (profile?.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  if (!userId) {
    return { success: false, message: "User id wajib diisi." };
  }

  if (profile.id === userId) {
    return { success: false, message: "Anda tidak dapat menghapus akun sendiri." };
  }

  const supabase = await createClient();
  const { data: targetUser, error: targetUserError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (targetUserError) {
    return { success: false, message: targetUserError.message };
  }

  if (!targetUser) {
    return { success: false, message: "User tidak ditemukan." };
  }

  const { data: ownedKosts, error: kostsError } = await supabase
    .from("kosts")
    .select("id")
    .eq("owner_id", userId);

  if (kostsError) {
    return { success: false, message: kostsError.message };
  }

  const kostIds = (ownedKosts ?? []).map((kost) => kost.id);

  if (kostIds.length > 0) {
    const deleteRelatedKostData = [
      supabase.from("kost_facilities").delete().in("kost_id", kostIds),
      supabase.from("kost_images").delete().in("kost_id", kostIds),
      supabase.from("verification_requests").delete().in("kost_id", kostIds),
      supabase.from("favorites").delete().in("kost_id", kostIds),
      supabase.from("reviews").delete().in("kost_id", kostIds),
      supabase.from("reports").delete().in("kost_id", kostIds),
    ];

    const relatedResults = await Promise.all(deleteRelatedKostData);
    const relatedError = relatedResults.find((result) => result.error)?.error;

    if (relatedError) {
      return { success: false, message: relatedError.message };
    }
  }

  const cleanupResults = await Promise.all([
    supabase.from("favorites").delete().eq("user_id", userId),
    supabase.from("reviews").delete().eq("user_id", userId),
    supabase.from("reports").delete().eq("reporter_id", userId),
    supabase.from("verification_requests").delete().eq("owner_id", userId),
  ]);
  const cleanupError = cleanupResults.find((result) => result.error)?.error;

  if (cleanupError) {
    return { success: false, message: cleanupError.message };
  }

  if (kostIds.length > 0) {
    const { error: deleteKostsError } = await supabase
      .from("kosts")
      .delete()
      .eq("owner_id", userId);

    if (deleteKostsError) {
      return { success: false, message: deleteKostsError.message };
    }
  }

  const { error: deleteProfileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (deleteProfileError) {
    return { success: false, message: deleteProfileError.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin/kost");
  revalidatePath("/admin/kosts");

  return { success: true, message: "User berhasil dihapus." };
}
