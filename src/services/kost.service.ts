import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/auth";
import type { Tables } from "@/types/database";

type OwnerKostStatus = "pending" | "available" | "full" | "rejected" | null;
type FacilityRelation =
  | {
      name: string;
    }[]
  | {
      name: string;
    }
  | null;

export type OwnerKost = Pick<
  Tables<"kosts">,
  "id" | "name" | "price" | "room_total" | "room_available"
> & {
  status: OwnerKostStatus;
  facilities: string[];
};

export async function getOwnerKosts(): Promise<OwnerKost[]> {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const supabase = await createClient();
  const { data: kosts } = await supabase
    .from("kosts")
    .select("id, name, price, room_total, room_available, status")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (kosts ?? []) as OwnerKost[];
  const kostIds = rows.map((kost) => kost.id);

  if (kostIds.length === 0) {
    return [];
  }

  const { data: facilityLinks } = await supabase
    .from("kost_facilities")
    .select("kost_id, facilities(name)")
    .in("kost_id", kostIds);

  return rows.map((kost) => ({
    ...kost,
    facilities: (facilityLinks ?? [])
      .filter((link) => link.kost_id === kost.id)
      .map((link) => {
        const relation = link.facilities as FacilityRelation;
        const facility = Array.isArray(relation) ? relation[0] : relation;

        return facility?.name;
      })
      .filter((facility): facility is string => Boolean(facility)),
  }));
}
