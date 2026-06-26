"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/services/auth";
import type { TablesUpdate } from "@/types/database";

const rejectedStatus = "rejected" as TablesUpdate<"kosts">["status"];

export async function rejectKost(formData: FormData) {
  const profile = await getCurrentProfile();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const kostId = String(formData.get("kost_id") ?? "");

  if (!kostId) {
    throw new Error("Kost id wajib diisi");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("kosts")
    .update({
      is_verified: false,
      status: rejectedStatus,
    })
    .eq("id", kostId)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/kost");
  revalidatePath("/owner");
  revalidatePath("/owner/kost");

  redirect("/admin/kost?toast=rejected");
}
