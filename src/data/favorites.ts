import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/auth";
import type { Favorite } from "@/types/favorite";

export async function getCurrentUserFavorites(): Promise<Favorite[]> {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function isKostFavorited(kostId: string): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("kost_id", kostId)
    .maybeSingle();

  return Boolean(data);
}
