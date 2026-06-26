"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createKostSchema } from "@/validations/kost";
import { getCampuses } from "@/services/campus.service";
import { calculateDistance } from "@/services/location.service";

const KOST_IMAGES_BUCKET = "kost-images";
const MAX_KOST_IMAGES = 10;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "webp") {
    return extension;
  }

  const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return extensionByType[file.type] ?? "";
}

function getKostImages(formData: FormData) {
  const rawImages = formData.getAll("images");

  console.log("SERVER RAW IMAGE ENTRIES", {
    totalEntries: rawImages.length,
    entries: rawImages.map((value, index) => ({
      index,
      constructorName: value?.constructor?.name ?? null,
      isFile: value instanceof File,
      isBlob: value instanceof Blob,
      type: value instanceof Blob ? value.type : null,
      size: value instanceof Blob ? value.size : null,
      name: value instanceof File ? value.name : null,
    })),
  });

  return rawImages.reduce<File[]>((acc, value, index) => {
    if (!(value instanceof Blob)) {
      return acc;
    }

    const blobValue = value as Blob;
    const file =
      value instanceof File
        ? value
        : new File([blobValue], `image-${index + 1}${blobValue.type ? `.${blobValue.type.split("/").pop()}` : ""}`, {
            type: blobValue.type || "application/octet-stream",
          });

    if (file.size > 0) {
      acc.push(file);
    }

    return acc;
  }, []);
}

function validateKostImages(files: File[]) {
  if (files.length > MAX_KOST_IMAGES) {
    return `Maksimal ${MAX_KOST_IMAGES} foto kos.`;
  }

  for (const file of files) {
    const extension = getFileExtension(file);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type) || !ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
      return "Format foto harus jpg, jpeg, png, atau webp.";
    }
  }

  return null;
}

export async function createKost(formData: FormData) {
  const supabase = await createClient();
  console.log("ENV DEBUG", {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("AUTH DEBUG", {
    userId: user?.id ?? null,
    userError,
  });

  if (!user) {
    throw new Error("Unauthorized");
  }

  const images = getKostImages(formData);

  console.log("IMAGES DEBUG", {
    total: images.length,
    files: images.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    })),
  });

  const imageValidationError = validateKostImages(images);

  if (imageValidationError) {
    return {
      success: false,
      message: imageValidationError,
    };
  }

  console.log("FORM DATA DEBUG", {
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    thumbnailIndex: formData.get("thumbnail_index"),
    rawImageCount: formData.getAll("images").length,
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

    const distance = calculateDistance(Number(parsed.latitude), Number(parsed.longitude), Number(campus.latitude), Number(campus.longitude));

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestCampusId = campus.id;
    }
  }

  const { data: kost, error } = await supabase
    .from("kosts")
    .insert({
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
    })
    .select("id")
    .single();

  if (error) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }

  if (images.length > 0) {
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    console.log("BUCKET DEBUG", {
      buckets,
      bucketError,
    });

    const thumbnailIndexValue = Number(formData.get("thumbnail_index") ?? 0);
    const thumbnailIndex = Number.isInteger(thumbnailIndexValue) && thumbnailIndexValue >= 0 && thumbnailIndexValue < images.length ? thumbnailIndexValue : 0;

    const uploadedPaths: string[] = [];

    try {
      const imageRows = [];

      console.log("BUCKET NAME:", KOST_IMAGES_BUCKET);
      console.log("THUMBNAIL INDEX:", thumbnailIndex);

      for (const [index, image] of images.entries()) {
        console.log("UPLOAD IMAGE", {
          index,
          name: image.name,
          size: image.size,
          type: image.type,
        });

        const extension = getFileExtension(image);
        const path = `${user.id}/${kost.id}/${crypto.randomUUID()}.${extension}`;

        const uploadResult = await supabase.storage.from(KOST_IMAGES_BUCKET).upload(path, image, {
          contentType: image.type || "application/octet-stream",
          upsert: false,
        });

        if (uploadResult.error) {
          throw new Error(JSON.stringify(uploadResult.error));
        }

        uploadedPaths.push(path);

        const {
          data: { publicUrl },
        } = supabase.storage.from(KOST_IMAGES_BUCKET).getPublicUrl(path);

        imageRows.push({
          kost_id: kost.id,
          image_url: publicUrl,
          is_thumbnail: index === thumbnailIndex,
        });
      }

      const { error: imageInsertError } = await supabase.from("kost_images").insert(imageRows);

      if (imageInsertError) {
        throw new Error(imageInsertError.message);
      }
    } catch (uploadError) {

      if (uploadedPaths.length > 0) {
        await supabase.storage.from(KOST_IMAGES_BUCKET).remove(uploadedPaths);
      }

      const { error: deleteError } = await supabase.from("kosts").delete().eq("id", kost.id);

      if (deleteError) {
        console.error("ROLLBACK DELETE ERROR", deleteError);
      }

      const detailMessage = uploadError instanceof Error ? uploadError.message : "Gagal mengunggah foto kos.";

      return {
        success: false,
        message: `Gagal mengunggah foto kos. ${detailMessage}`,
      };
    }
  }

  revalidatePath("/owner/kost");
  revalidatePath("/owner");

  return {
    success: true,
    message: "Kos berhasil disimpan.",
    redirectTo: "/owner/kost",
  };
}
