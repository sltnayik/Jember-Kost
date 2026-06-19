import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/auth";
import type {
  KostCampus,
  KostCardData,
  KostDetailData,
  KostDetailReview,
  KostFacility,
  KostFilterOptions,
  KostFilters,
  KostImage,
  KostListResult,
  KostReview,
  KostRow,
  LandingStats,
} from "@/types/kosts";
import type { Tables } from "@/types/database";

const DEFAULT_PER_PAGE = 9;
const FEATURED_LIMIT = 6;
const LATEST_LIMIT = 8;

type KostFacilityLink = Pick<Tables<"kost_facilities">, "kost_id" | "facility_id">;
type ProfilePreview = Pick<Tables<"profiles">, "id" | "full_name" | "avatar_url">;

function normalizePage(value: number | undefined) {
  if (!value || Number.isNaN(value) || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

function normalizePerPage(value: number | undefined) {
  if (!value || Number.isNaN(value) || value < 1) {
    return DEFAULT_PER_PAGE;
  }

  return Math.min(Math.floor(value), 24);
}

function sanitizeSearchQuery(query: string | undefined) {
  return query?.trim().replace(/[,%()]/g, " ") || undefined;
}

function calculateRating(reviews: KostReview[]) {
  if (reviews.length === 0) {
    return {
      average: 0,
      count: 0,
    };
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);

  return {
    average: Number((total / reviews.length).toFixed(1)),
    count: reviews.length,
  };
}

async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

async function enrichKostRows(
  rows: KostRow[],
  userId: string | null
): Promise<KostCardData[]> {
  if (rows.length === 0) {
    return [];
  }

  const supabase = await createClient();
  const kostIds = rows.map((kost) => kost.id);
  const campusIds = rows
    .map((kost) => kost.campus_id)
    .filter((campusId): campusId is string => Boolean(campusId));

  const { data: imagesData } = await supabase
    .from("kost_images")
    .select("*")
    .in("kost_id", kostIds)
    .order("is_thumbnail", { ascending: false })
    .order("created_at", { ascending: true });

  const { data: facilityLinksData } = await supabase
    .from("kost_facilities")
    .select("kost_id, facility_id")
    .in("kost_id", kostIds);

  const facilityIds = (facilityLinksData ?? [])
    .map((link) => link.facility_id)
    .filter((facilityId, index, array) => array.indexOf(facilityId) === index);

  const { data: facilitiesData } =
    facilityIds.length > 0
      ? await supabase.from("facilities").select("*").in("id", facilityIds)
      : { data: [] as KostFacility[] };

  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*")
    .in("kost_id", kostIds)
    .eq("is_hidden", false);

  const { data: campusesData } =
    campusIds.length > 0
      ? await supabase.from("campuses").select("*").in("id", campusIds)
      : { data: [] as KostCampus[] };

  const { data: favoritesData } =
    userId && kostIds.length > 0
      ? await supabase
          .from("favorites")
          .select("kost_id")
          .eq("user_id", userId)
          .in("kost_id", kostIds)
      : { data: [] as Pick<Tables<"favorites">, "kost_id">[] };

  const images = (imagesData ?? []) as KostImage[];
  const facilityLinks = (facilityLinksData ?? []) as KostFacilityLink[];
  const facilities = (facilitiesData ?? []) as KostFacility[];
  const reviews = (reviewsData ?? []) as KostReview[];
  const campuses = (campusesData ?? []) as KostCampus[];
  const favoriteKostIds = new Set((favoritesData ?? []).map((item) => item.kost_id));

  return rows.map((kost) => {
    const kostImages = images.filter((image) => image.kost_id === kost.id);
    const links = facilityLinks.filter((link) => link.kost_id === kost.id);
    const kostFacilities = links
      .map((link) => facilities.find((facility) => facility.id === link.facility_id))
      .filter((facility): facility is KostFacility => Boolean(facility));
    const kostReviews = reviews.filter((review) => review.kost_id === kost.id);

    return {
      ...kost,
      thumbnail_url:
        kostImages.find((image) => image.is_thumbnail)?.image_url ??
        kostImages[0]?.image_url ??
        null,
      images: kostImages,
      facilities: kostFacilities,
      campus: campuses.find((campus) => campus.id === kost.campus_id) ?? null,
      rating: calculateRating(kostReviews),
      is_favorited: favoriteKostIds.has(kost.id),
    };
  });
}

export async function getKosts(filters: KostFilters = {}): Promise<KostListResult> {
  const supabase = await createClient();
  const page = normalizePage(filters.page);
  const perPage = normalizePerPage(filters.perPage);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  const searchQuery = sanitizeSearchQuery(filters.query);
  const shouldSortByRating = filters.sort === "rating_high";

  let query = supabase.from("kosts").select("*", { count: "exact" });

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%`);
  }

  if (filters.minPrice) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters.genderType) {
    query = query.eq("gender_type", filters.genderType);
  }

  if (filters.district) {
    query = query.eq("district", filters.district);
  }

  if (filters.campusId) {
    query = query.eq("campus_id", filters.campusId);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.sort === "price_low") {
    query = query.order("price", { ascending: true });
  } else if (filters.sort === "price_high") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, count } = shouldSortByRating
    ? await query
    : await query.range(from, to);

  const rows = ((data ?? []) as KostRow[]).filter((kost) => kost.is_verified ?? true);
  const userId = await getCurrentUserId();
  let enriched = await enrichKostRows(rows, userId);

  if (shouldSortByRating) {
    enriched = enriched
      .sort((first, second) => second.rating.average - first.rating.average)
      .slice(from, to + 1);
  }

  const totalCount = count ?? enriched.length;

  return {
    data: enriched,
    count: totalCount,
    page,
    perPage,
    pageCount: Math.max(1, Math.ceil(totalCount / perPage)),
  };
}

export async function searchKosts(filters: KostFilters = {}) {
  return getKosts(filters);
}

export async function getFeaturedKosts(limit = FEATURED_LIMIT) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("kosts")
    .select("*")
    .eq("featured", true)
    .eq("is_verified", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return enrichKostRows((data ?? []) as KostRow[], await getCurrentUserId());
}

export async function getLatestKosts(limit = LATEST_LIMIT) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("kosts")
    .select("*")
    .eq("is_verified", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return enrichKostRows((data ?? []) as KostRow[], await getCurrentUserId());
}

export async function getKostBySlug(slug: string): Promise<KostDetailData | null> {
  const supabase = await createClient();
  const { data: kost } = await supabase
    .from("kosts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!kost) {
    return null;
  }

  const [enriched] = await enrichKostRows([kost as KostRow], await getCurrentUserId());

  if (!enriched) {
    return null;
  }

  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*")
    .eq("kost_id", kost.id)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false });

  const reviews = (reviewsData ?? []) as KostReview[];
  const reviewerIds = reviews
    .map((review) => review.user_id)
    .filter((userId, index, array) => array.indexOf(userId) === index);

  const { data: profilesData } =
    reviewerIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", reviewerIds)
      : { data: [] as ProfilePreview[] };

  const profiles = (profilesData ?? []) as ProfilePreview[];

  const detailedReviews: KostDetailReview[] = reviews.map((review) => {
    const profile = profiles.find((item) => item.id === review.user_id);

    return {
      ...review,
      reviewer_name: profile?.full_name ?? "Pengguna JemberKost",
      reviewer_avatar_url: profile?.avatar_url ?? null,
    };
  });

  return {
    ...enriched,
    reviews: detailedReviews,
  };
}

export async function getKostFilterOptions(): Promise<KostFilterOptions> {
  const supabase = await createClient();
  const [{ data: campuses }, { data: kosts }] = await Promise.all([
    supabase.from("campuses").select("id, name").order("name", { ascending: true }),
    supabase.from("kosts").select("district").not("district", "is", null),
  ]);

  const districts = (kosts ?? [])
    .map((kost) => kost.district)
    .filter((district): district is string => Boolean(district))
    .filter((district, index, array) => array.indexOf(district) === index)
    .sort((first, second) => first.localeCompare(second));

  return {
    campuses: campuses ?? [],
    districts,
  };
}

export async function getLandingStats(): Promise<LandingStats> {
  const supabase = await createClient();
  const [kosts, owners, users, reviews] = await Promise.all([
    supabase.from("kosts").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "owner"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "user"),
    supabase.from("reviews").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalKosts: kosts.count ?? 0,
    totalOwners: owners.count ?? 0,
    totalUsers: users.count ?? 0,
    totalReviews: reviews.count ?? 0,
  };
}
