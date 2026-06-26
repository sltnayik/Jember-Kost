import "server-only";

import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/auth";
import type { Tables } from "@/types/database";

export type VerificationStatus = "pending" | "approved" | "rejected";

type KostImage = Pick<Tables<"kost_images">, "id" | "image_url" | "is_thumbnail" | "created_at">;
type Facility = Pick<Tables<"facilities">, "id" | "name" | "icon">;
type Campus = Pick<Tables<"campuses">, "id" | "name" | "address" | "latitude" | "longitude">;
type VerificationRequest = Pick<Tables<"verification_requests">, "status" | "notes" | "created_at">;

export type OwnerKostListItem = Pick<
  Tables<"kosts">,
  "id" | "name" | "price" | "room_total" | "room_available" | "created_at" | "status" | "is_verified"
> & {
  thumbnailUrl: string | null;
  verificationStatus: VerificationStatus;
};

export type OwnerKostDetail = Tables<"kosts"> & {
  images: KostImage[];
  facilities: Facility[];
  campus: Campus | null;
  verification: VerificationRequest | null;
};

export type OwnerDashboardStats = {
  totalKost: number;
  pending: number;
  approved: number;
  rejected: number;
  totalRooms: number;
  availableRooms: number;
};

export type OwnerDashboardData = {
  stats: OwnerDashboardStats;
  latestKosts: OwnerKostListItem[];
};

type FacilityRelation =
  | {
      id: string;
      name: string;
      icon: string | null;
    }[]
  | {
      id: string;
      name: string;
      icon: string | null;
    }
  | null;

type CampusRelation =
  | {
      id: string;
      name: string;
      address: string | null;
      latitude: number | null;
      longitude: number | null;
    }[]
  | {
      id: string;
      name: string;
      address: string | null;
      latitude: number | null;
      longitude: number | null;
    }
  | null;

function firstRelation<T>(value: T[] | T | null): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

export function resolveVerificationStatus(
  kost: Pick<Tables<"kosts">, "is_verified">,
  request?: Pick<Tables<"verification_requests">, "status" | "created_at"> | null,
): VerificationStatus {
  if (request?.status === "approved" || kost.is_verified) {
    return "approved";
  }

  if (request?.status === "rejected") {
    return "rejected";
  }

  return "pending";
}

export async function getOwnerDashboardData(ownerId: string): Promise<OwnerDashboardData> {
  const kosts = await getOwnerKosts(ownerId);
  const totalRooms = kosts.reduce((total, kost) => total + (kost.room_total ?? 0), 0);
  const availableRooms = kosts.reduce((total, kost) => total + (kost.room_available ?? 0), 0);

  return {
    stats: {
      totalKost: kosts.length,
      pending: kosts.filter((kost) => kost.verificationStatus === "pending").length,
      approved: kosts.filter((kost) => kost.verificationStatus === "approved").length,
      rejected: kosts.filter((kost) => kost.verificationStatus === "rejected").length,
      totalRooms,
      availableRooms,
    },
    latestKosts: kosts.slice(0, 5),
  };
}

export async function getOwnerKosts(ownerId?: string): Promise<OwnerKostListItem[]> {
  const user = ownerId ? null : await getCurrentUser();
  const resolvedOwnerId = ownerId ?? user?.id;

  if (!resolvedOwnerId) {
    return [];
  }

  const supabase = await createClient();
  const { data: kosts, error } = await supabase
    .from("kosts")
    .select("id, name, price, room_total, room_available, created_at, status, is_verified")
    .eq("owner_id", resolvedOwnerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = kosts ?? [];
  const ids = rows.map((kost) => kost.id);

  if (ids.length === 0) {
    return [];
  }

  const [{ data: images }, { data: verifications }] = await Promise.all([
    supabase
      .from("kost_images")
      .select("kost_id, image_url, is_thumbnail, created_at")
      .in("kost_id", ids)
      .order("created_at", { ascending: true }),
    supabase
      .from("verification_requests")
      .select("kost_id, status, created_at")
      .in("kost_id", ids)
      .order("created_at", { ascending: false }),
  ]);

  return rows.map((kost) => {
    const kostImages = (images ?? []).filter((image) => image.kost_id === kost.id);
    const thumbnail = kostImages.find((image) => image.is_thumbnail) ?? kostImages[0] ?? null;
    const verification = (verifications ?? []).find((request) => request.kost_id === kost.id) ?? null;

    return {
      ...kost,
      thumbnailUrl: thumbnail?.image_url ?? null,
      verificationStatus: resolveVerificationStatus(kost, verification),
    };
  });
}

export async function getOwnerKostDetail(kostId: string): Promise<OwnerKostDetail> {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const supabase = await createClient();
  const { data: kost, error } = await supabase
    .from("kosts")
    .select("*, campuses(id, name, address, latitude, longitude)")
    .eq("id", kostId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!kost) {
    notFound();
  }

  const [{ data: images }, { data: facilityLinks }, { data: verification }] = await Promise.all([
    supabase
      .from("kost_images")
      .select("id, image_url, is_thumbnail, created_at")
      .eq("kost_id", kost.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("kost_facilities")
      .select("facilities(id, name, icon)")
      .eq("kost_id", kost.id),
    supabase
      .from("verification_requests")
      .select("status, notes, created_at")
      .eq("kost_id", kost.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    ...kost,
    campus: firstRelation(kost.campuses as CampusRelation),
    images: (images ?? []) as KostImage[],
    facilities: (facilityLinks ?? [])
      .map((link) => firstRelation(link.facilities as FacilityRelation))
      .filter((facility): facility is Facility => Boolean(facility)),
    verification: verification ?? null,
  };
}

export async function getOwnerFacilities(kostId: string) {
  const [kost, supabase] = await Promise.all([getOwnerKostDetail(kostId), createClient()]);
  const { data: facilities, error } = await supabase.from("facilities").select("id, name, icon").order("name");

  if (error) {
    throw new Error(error.message);
  }

  return {
    kost,
    facilities: (facilities ?? []) as Facility[],
    selectedFacilityIds: new Set(kost.facilities.map((facility) => facility.id)),
  };
}
