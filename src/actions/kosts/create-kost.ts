"use server";
import { createClient } from "@/lib/supabase/server";
import { createKostSchema } from "@/validations/kost";
import { getCampuses } from "@/services/campus.service";
import { calculateDistance } from "@/services/location.service";

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createKost(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  console.log("FORM DATA");
  console.log({
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
  });

  const parsed = createKostSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    gender_type: formData.get("gender_type"),
    price: formData.get("price"),
    address: formData.get("address"),
    district: formData.get("district"),
    room_total: formData.get("room_total"),
    whatsapp: formData.get("whatsapp"),
    rules: formData.get("rules"),

    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
  });

  const slug = generateSlug(parsed.name);

  /*
   * Cari kampus terdekat
   */
  console.log("LAT LNG");
  console.log({
    latitude: parsed.latitude,
    longitude: parsed.longitude,
  });

  const campuses = await getCampuses();

  console.log("TOTAL CAMPUSES");
  console.log(campuses.length);

  console.log("FIRST CAMPUS");
  console.log(campuses[0]);

  let nearestCampusId: string | null = null;
  let nearestDistance = Infinity;

  for (const campus of campuses) {
    if (campus.latitude == null || campus.longitude == null) {
      continue;
    }

    const distance = calculateDistance(
      Number(parsed.latitude),
      Number(parsed.longitude),

      Number(campus.latitude),
      Number(campus.longitude),
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestCampusId = campus.id;
    }
  }

  if (nearestCampusId) {
    console.log("KAMPUS TERDEKAT:");
    console.log({
      id: nearestCampusId,
      distance: nearestDistance,
    });
  } else {
    console.warn("Tidak ada kampus yang bisa dipakai, lanjutkan dengan campus_id null");
  }

  const { error } = await supabase.from("kosts").insert({
    owner_id: user.id,

    campus_id: nearestCampusId,

    name: parsed.name,

    slug,

    description: parsed.description,

    gender_type: parsed.gender_type,

    price: parsed.price,

    address: parsed.address,

    district: parsed.district,

    latitude: parsed.latitude,

    longitude: parsed.longitude,

    room_total: parsed.room_total,

    room_available: parsed.room_total,

    whatsapp: parsed.whatsapp,

    rules: parsed.rules,

    status: "pending",

    is_verified: false,
  });

  if (error) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Kos berhasil ditambahkan dan menunggu verifikasi admin.",
  };
}
