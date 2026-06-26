"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { calculateDistance } from "@/services/location.service";
import { getCampuses } from "@/services/campus.service";
import { updateKostSchema, updateRoomsSchema } from "@/validations/kost";

type ActionResult = {
  success: boolean;
  message: string;
};

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

async function getOwnedKost(supabase: Awaited<ReturnType<typeof createClient>>, kostId: string, userId: string) {
  const { data: kost, error } = await supabase
    .from("kosts")
    .select("id, owner_id")
    .eq("id", kostId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return kost;
}

async function getNearestCampusId(latitude: number, longitude: number) {
  const campuses = await getCampuses();
  let nearestCampusId: string | null = null;
  let nearestDistance = Infinity;

  for (const campus of campuses) {
    if (campus.latitude == null || campus.longitude == null) {
      continue;
    }

    const distance = calculateDistance(latitude, longitude, Number(campus.latitude), Number(campus.longitude));

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestCampusId = campus.id;
    }
  }

  return nearestCampusId;
}

export async function updateKost(kostId: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Anda harus login terlebih dahulu." };
  }

  const ownedKost = await getOwnedKost(supabase, kostId, user.id);

  if (!ownedKost) {
    return { success: false, message: "Kos tidak ditemukan atau bukan milik Anda." };
  }

  const parsed = updateKostSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    gender_type: formData.get("gender_type"),
    price: formData.get("price"),
    address: formData.get("address"),
    district: formData.get("district"),
    room_total: formData.get("room_total"),
    room_available: formData.get("room_available"),
    whatsapp: formData.get("whatsapp"),
    rules: formData.get("rules"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data kos tidak valid.",
    };
  }

  const nearestCampusId = await getNearestCampusId(parsed.data.latitude, parsed.data.longitude);
  const { error } = await supabase
    .from("kosts")
    .update({
      campus_id: nearestCampusId,
      name: parsed.data.name,
      slug: generateSlug(parsed.data.name),
      description: parsed.data.description,
      gender_type: parsed.data.gender_type,
      price: parsed.data.price,
      address: parsed.data.address,
      district: parsed.data.district,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      room_total: parsed.data.room_total,
      room_available: parsed.data.room_available,
      whatsapp: parsed.data.whatsapp,
      rules: parsed.data.rules,
      updated_at: new Date().toISOString(),
    })
    .eq("id", kostId)
    .eq("owner_id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/owner");
  revalidatePath("/owner/dashboard");
  revalidatePath("/owner/kost");
  revalidatePath(`/owner/kost/${kostId}`);
  revalidatePath(`/owner/kost/${kostId}/edit`);

  return { success: true, message: "Kos berhasil diperbarui." };
}

export async function updateKostRooms(kostId: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Anda harus login terlebih dahulu." };
  }

  const ownedKost = await getOwnedKost(supabase, kostId, user.id);

  if (!ownedKost) {
    return { success: false, message: "Kos tidak ditemukan atau bukan milik Anda." };
  }

  const parsed = updateRoomsSchema.safeParse({
    room_total: formData.get("room_total"),
    room_available: formData.get("room_available"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data kamar tidak valid.",
    };
  }

  const { error } = await supabase
    .from("kosts")
    .update({
      room_total: parsed.data.room_total,
      room_available: parsed.data.room_available,
      updated_at: new Date().toISOString(),
    })
    .eq("id", kostId)
    .eq("owner_id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/owner");
  revalidatePath("/owner/dashboard");
  revalidatePath("/owner/kost");
  revalidatePath(`/owner/kost/${kostId}`);
  revalidatePath(`/owner/kost/${kostId}/rooms`);

  return { success: true, message: "Jumlah kamar berhasil diperbarui." };
}
