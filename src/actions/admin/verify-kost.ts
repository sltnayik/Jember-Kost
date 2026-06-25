"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/services/auth";
import type { TablesUpdate } from "@/types/database";

const availableStatus = "available" as TablesUpdate<"kosts">["status"];

export async function verifyKost(formData: FormData) {
  const profile = await getCurrentProfile();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const kostId = String(formData.get("kost_id") ?? "");

  if (!kostId) {
    throw new Error("Kost id wajib diisi");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kosts")
    .update({
      is_verified: true,
      status: availableStatus,
    })
    .eq("id", kostId)
    .select();

  console.log(data);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/kost");
  revalidatePath("/owner/kost");

  revalidatePath("/admin");
  revalidatePath("/admin/kost");
  revalidatePath("/owner");
  revalidatePath("/owner/kost");

  redirect("/admin/kost?toast=verified");
}
