import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

type OwnerKostRow = Pick<Tables<"kosts">, "id" | "name" | "price" | "room_total" | "room_available" | "is_verified" | "created_at">;

export type OwnerDashboardStats = {
  totalKost: number;
  totalRooms: number;
  availableRooms: number;
  verifiedKost: number;
  pendingVerification: number;
  averageRating: string;
};

export type OwnerDashboardData = {
  stats: OwnerDashboardStats;
  latestKosts: OwnerKostRow[];
};

export async function getOwnerDashboardData(ownerId: string): Promise<OwnerDashboardData> {
  const supabase = await createClient();
  const { data: kosts, error } = await supabase.from("kosts").select("id, name, price, room_total, room_available, is_verified, created_at").eq("owner_id", ownerId).order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const ownerKosts = (kosts ?? []) as OwnerKostRow[];
  const kostIds = ownerKosts.map((kost) => kost.id);
  const totalRooms = ownerKosts.reduce((total, kost) => total + (kost.room_total ?? 0), 0);
  const availableRooms = ownerKosts.reduce((total, kost) => total + (kost.room_available ?? 0), 0);
  const verifiedKost = ownerKosts.filter((kost) => kost.is_verified === true).length;
  const pendingVerification = ownerKosts.filter((kost) => kost.is_verified !== true).length;

  let averageRating = "0";

  if (kostIds.length > 0) {
    const { data: reviews, error: reviewsError } = await supabase.from("reviews").select("rating").in("kost_id", kostIds);

    if (reviewsError) {
      console.warn("Review belum tersedia", reviewsError);
    } else if (reviews && reviews.length > 0) {
      const ratingTotal = reviews.reduce((total, review) => total + review.rating, 0);

      averageRating = (ratingTotal / reviews.length).toFixed(1);
    }

    if (reviews && reviews.length > 0) {
      const ratingTotal = reviews.reduce((total, review) => total + review.rating, 0);
      averageRating = (ratingTotal / reviews.length).toFixed(1);
    }
  }

  return {
    stats: {
      totalKost: ownerKosts.length,
      totalRooms,
      availableRooms,
      verifiedKost,
      pendingVerification,
      averageRating,
    },
    latestKosts: ownerKosts.slice(0, 5),
  };
}
