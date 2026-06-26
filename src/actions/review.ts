"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/auth";
import { reviewSchema } from "@/validations/review";

export type ReviewActionResult = {
  success: boolean;
  message: string;
  reviewId?: string;
};

type ReviewPayload = {
  kostId: string;
  reviewId?: string;
  rating: number;
  comment: string;
  path: string;
};

export async function upsertReview({ kostId, reviewId, rating, comment, path }: ReviewPayload): Promise<ReviewActionResult> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "Silakan login untuk menulis ulasan.",
    };
  }

  const parsed = reviewSchema.safeParse({ rating, comment });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data ulasan tidak valid.",
    };
  }

  const supabase = await createClient();
  const existingReview = reviewId ? null : await supabase.from("reviews").select("id").eq("user_id", user.id).eq("kost_id", kostId).maybeSingle();

  const payload = {
    kost_id: kostId,
    user_id: user.id,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
  };

  const { data, error } = reviewId
    ? await supabase.from("reviews").update(payload).eq("id", reviewId).eq("user_id", user.id).select("id").single()
    : existingReview?.data?.id
      ? await supabase.from("reviews").update(payload).eq("id", existingReview.data.id).eq("user_id", user.id).select("id").single()
      : await supabase.from("reviews").insert(payload).select("id").single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message ?? "Gagal menyimpan ulasan.",
    };
  }

  revalidatePath(path);
  revalidatePath("/user/profile");

  return {
    success: true,
    message: reviewId ? "Ulasan berhasil diperbarui." : "Ulasan berhasil dikirim.",
    reviewId: data.id,
  };
}

export async function deleteReview(reviewId: string, path: string): Promise<ReviewActionResult> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "Silakan login untuk menghapus ulasan.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId).eq("user_id", user.id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath(path);
  revalidatePath("/user/profile");

  return {
    success: true,
    message: "Ulasan berhasil dihapus.",
  };
}
