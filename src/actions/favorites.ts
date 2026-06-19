"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/auth";
import type { FavoriteActionInput, FavoriteActionResult } from "@/types/favorite";

export async function toggleFavorite({
  kostId,
  path,
}: FavoriteActionInput): Promise<FavoriteActionResult> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "Silakan login untuk menyimpan kos favorit.",
    };
  }

  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("kost_id", kostId)
    .maybeSingle();

  if (readError) {
    return {
      success: false,
      error: readError.message,
    };
  }

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath(path);
    revalidatePath("/kost");

    return {
      success: true,
      isFavorited: false,
    };
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    kost_id: kostId,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath(path);
  revalidatePath("/kost");

  return {
    success: true,
    isFavorited: true,
  };
}
