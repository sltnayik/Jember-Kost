import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/auth";
import type { KostCampus, KostCardData, KostDetailData, KostDetailReview, KostFacility, KostFilterOptions, KostFilters, KostImage, KostListResult, KostReview, KostRow, LandingStats } from "@/types/kosts";
import type { Tables } from "@/types/database";

const DEFAULT_PER_PAGE = 9;
const FEATURED_LIMIT = 6;
const LATEST_LIMIT = 8;

type KostFacilityLink = Pick<Tables<"kost_facilities">, "kost_id" | "facility_id">;
type ProfilePreview = Pick<Tables<"profiles">, "id" | "full_name" | "avatar_url">;

type OwnerPreview = Pick<Tables<"profiles">, "id" | "full_name" | "avatar_url" | "phone">;

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

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
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

async function enrichKostRows(rows: KostRow[], userId: string | null): Promise<KostCardData[]> {
  if (rows.length === 0) {
    return [];
  }

  const supabase = await createClient();
  const kostIds = rows.map((kost) => kost.id);
  const campusIds = rows.map((kost) => kost.campus_id).filter((campusId): campusId is string => Boolean(campusId));

  const { data: imagesData } = await supabase.from("kost_images").select("*").in("kost_id", kostIds).order("is_thumbnail", { ascending: false }).order("created_at", { ascending: true });

  const { data: facilityLinksData } = await supabase.from("kost_facilities").select("kost_id, facility_id").in("kost_id", kostIds);

  const facilityIds = (facilityLinksData ?? []).map((link) => link.facility_id).filter((facilityId, index, array) => array.indexOf(facilityId) === index);

  const { data: facilitiesData } = facilityIds.length > 0 ? await supabase.from("facilities").select("*").in("id", facilityIds) : { data: [] as KostFacility[] };

  const { data: reviewsData } = await supabase.from("reviews").select("*").in("kost_id", kostIds).eq("is_hidden", false);

  const { data: campusesData } = campusIds.length > 0 ? await supabase.from("campuses").select("*").in("id", campusIds) : { data: [] as KostCampus[] };

  const { data: favoritesData } = userId && kostIds.length > 0 ? await supabase.from("favorites").select("kost_id").eq("user_id", userId).in("kost_id", kostIds) : { data: [] as Pick<Tables<"favorites">, "kost_id">[] };

  const images = (imagesData ?? []) as KostImage[];
  const facilityLinks = (facilityLinksData ?? []) as KostFacilityLink[];
  const facilities = (facilitiesData ?? []) as KostFacility[];
  const reviews = (reviewsData ?? []) as KostReview[];
  const campuses = (campusesData ?? []) as KostCampus[];
  const favoriteKostIds = new Set((favoritesData ?? []).map((item) => item.kost_id));

  return rows.map((kost) => {
    const kostImages = images.filter((image) => image.kost_id === kost.id);
    const links = facilityLinks.filter((link) => link.kost_id === kost.id);
    const kostFacilities = links.map((link) => facilities.find((facility) => facility.id === link.facility_id)).filter((facility): facility is KostFacility => Boolean(facility));
    const kostReviews = reviews.filter((review) => review.kost_id === kost.id);

    return {
      ...kost,
      thumbnail_url: kostImages.find((image) => image.is_thumbnail)?.image_url ?? kostImages[0]?.image_url ?? null,
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

  let query = supabase.from("kosts").select("*").eq("is_verified", true);

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

  if (filters.facilityId) {
    const { data: matchingKosts } = await supabase.from("kost_facilities").select("kost_id").eq("facility_id", filters.facilityId);
    const matchingIds = (matchingKosts ?? []).map((item) => item.kost_id);

    if (matchingIds.length === 0) {
      return {
        data: [],
        count: 0,
        page,
        perPage,
        pageCount: 1,
      };
    }

    query = query.in("id", matchingIds);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.sort === "price_low") {
    query = query.order("price", { ascending: true });
  } else if (filters.sort === "price_high") {
    query = query.order("price", { ascending: false });
  } else if (filters.sort === "name_asc") {
    query = query.order("name", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data } = await query;
  const rows = (data ?? []) as KostRow[];
  const userId = await getCurrentUserId();
  let enriched = await enrichKostRows(rows, userId);

  if (searchQuery) {
    const normalizedQuery = searchQuery.toLowerCase();
    enriched = enriched.filter((kost) => {
      const haystacks = [kost.name, kost.address, kost.district, kost.campus?.name].filter(Boolean).map((value) => String(value).toLowerCase());

      return haystacks.some((value) => value.includes(normalizedQuery));
    });
  }

  if (filters.sort === "rating_high") {
    enriched = enriched.sort((first, second) => second.rating.average - first.rating.average);
  } else if (filters.sort === "nearby") {
    enriched = enriched.sort((first, second) => {
      const firstDistance =
        first.latitude != null && first.longitude != null && first.campus?.latitude != null && first.campus?.longitude != null
          ? calculateDistance(first.latitude, first.longitude, first.campus.latitude, first.campus.longitude)
          : Number.POSITIVE_INFINITY;
      const secondDistance =
        second.latitude != null && second.longitude != null && second.campus?.latitude != null && second.campus?.longitude != null
          ? calculateDistance(second.latitude, second.longitude, second.campus.latitude, second.campus.longitude)
          : Number.POSITIVE_INFINITY;

      return firstDistance - secondDistance;
    });
  } else if (filters.sort === "name_asc") {
    enriched = enriched.sort((first, second) => first.name.localeCompare(second.name));
  } else if (filters.sort === "price_low") {
    enriched = enriched.sort((first, second) => first.price - second.price);
  } else if (filters.sort === "price_high") {
    enriched = enriched.sort((first, second) => second.price - first.price);
  } else {
    enriched = enriched.sort((first, second) => new Date(second.created_at ?? 0).getTime() - new Date(first.created_at ?? 0).getTime());
  }

  const totalCount = enriched.length;
  const paged = enriched.slice(from, to + 1);

  return {
    data: paged,
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
  const { data } = await supabase.from("kosts").select("*").eq("featured", true).eq("is_verified", true).order("created_at", { ascending: false }).limit(limit);

  return enrichKostRows((data ?? []) as KostRow[], await getCurrentUserId());
}

export async function getLatestKosts(limit = LATEST_LIMIT) {
  const supabase = await createClient();
  const { data } = await supabase.from("kosts").select("*").eq("is_verified", true).order("created_at", { ascending: false }).limit(limit);

  return enrichKostRows((data ?? []) as KostRow[], await getCurrentUserId());
}

export async function getNearbyKosts(limit = 6) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("kosts")
    .select("*, campuses(*)")
    .eq("is_verified", true)
    .not("campus_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit * 3);

  const rows = (data ?? []) as Array<KostRow & { campuses?: { latitude: number | null; longitude: number | null } | null }>;
  const enriched = await enrichKostRows(rows as KostRow[], await getCurrentUserId());

  enriched.sort((first, second) => {
    const firstDistance =
      first.latitude != null && first.longitude != null && first.campus?.latitude != null && first.campus?.longitude != null
        ? calculateDistance(first.latitude, first.longitude, first.campus.latitude, first.campus.longitude)
        : Number.POSITIVE_INFINITY;
    const secondDistance =
      second.latitude != null && second.longitude != null && second.campus?.latitude != null && second.campus?.longitude != null
        ? calculateDistance(second.latitude, second.longitude, second.campus.latitude, second.campus.longitude)
        : Number.POSITIVE_INFINITY;

    return firstDistance - secondDistance;
  });

  return enriched.slice(0, limit);
}

export async function getKostBySlug(slug: string): Promise<KostDetailData | null> {
  const supabase = await createClient();
  const { data: kost } = await supabase.from("kosts").select("*").eq("slug", slug).eq("is_verified", true).maybeSingle();

  if (!kost) {
    return null;
  }

  const [enriched] = await enrichKostRows([kost as KostRow], await getCurrentUserId());

  if (!enriched) {
    return null;
  }

  const { data: reviewsData } = await supabase.from("reviews").select("*").eq("kost_id", kost.id).eq("is_hidden", false).order("created_at", { ascending: false });

  const reviews = (reviewsData ?? []) as KostReview[];
  const reviewerIds = reviews.map((review) => review.user_id).filter((userId, index, array) => array.indexOf(userId) === index);

  const { data: profilesData } = reviewerIds.length > 0 ? await supabase.from("profiles").select("id, full_name, avatar_url").in("id", reviewerIds) : { data: [] as ProfilePreview[] };

  const profiles = (profilesData ?? []) as ProfilePreview[];

  const detailedReviews: KostDetailReview[] = reviews.map((review) => {
    const profile = profiles.find((item) => item.id === review.user_id);

    return {
      ...review,
      reviewer_name: profile?.full_name ?? "Pengguna JemberKost",
      reviewer_avatar_url: profile?.avatar_url ?? null,
    };
  });

  const userId = await getCurrentUserId();
  const { data: userReview } = userId ? await supabase.from("reviews").select("id, rating, comment, created_at").eq("kost_id", kost.id).eq("user_id", userId).eq("is_hidden", false).maybeSingle() : { data: null };

  const { data: ownerProfile } = await supabase.from("profiles").select("id, full_name, avatar_url, phone").eq("id", kost.owner_id).maybeSingle();

  return {
    ...enriched,
    reviews: detailedReviews,
    user_review: userReview ?? null,
    owner_name: ownerProfile?.full_name ?? null,
    owner_avatar_url: ownerProfile?.avatar_url ?? null,
    owner_phone: ownerProfile?.phone ?? null,
  };
}

export async function getKostFilterOptions(): Promise<KostFilterOptions> {
  const supabase = await createClient();
  const [{ data: campuses }, { data: kosts }, { data: facilities }] = await Promise.all([
    supabase.from("campuses").select("id, name").order("name", { ascending: true }),
    supabase.from("kosts").select("district").eq("is_verified", true).not("district", "is", null),
    supabase.from("facilities").select("id, name").order("name", { ascending: true }),
  ]);

  const districts = (kosts ?? [])
    .map((kost) => kost.district)
    .filter((district): district is string => Boolean(district))
    .filter((district, index, array) => array.indexOf(district) === index)
    .sort((first, second) => first.localeCompare(second));

  return {
    campuses: campuses ?? [],
    districts,
    facilities: facilities ?? [],
  };
}

export async function getLandingStats(): Promise<LandingStats> {
  const supabase = await createClient();
  const [{ data: kostRows }, campusesResult] = await Promise.all([supabase.from("kosts").select("id, room_total, room_available").eq("is_verified", true), supabase.from("campuses").select("id", { count: "exact", head: true })]);

  const totalRooms = (kostRows ?? []).reduce((sum, kost) => sum + Number(kost.room_total ?? 0), 0);
  const availableRooms = (kostRows ?? []).reduce((sum, kost) => sum + Number(kost.room_available ?? 0), 0);

  return {
    totalKosts: kostRows?.length ?? 0,
    totalCampuses: campusesResult?.count ?? 0,
    totalRooms,
    availableRooms,
  };
}

export async function getCampusKostSummaries() {
  const supabase = await createClient();
  const [{ data: campuses }, { data: kosts }] = await Promise.all([
    supabase.from("campuses").select("id, name").order("name", { ascending: true }),
    supabase.from("kosts").select("id, name, campus_id").eq("is_verified", true).not("campus_id", "is", null).order("created_at", { ascending: false }),
  ]);

  const rows = (kosts ?? []) as Array<Pick<KostRow, "id" | "name" | "campus_id">>;

  return (campuses ?? [])
    .map((campus) => {
      const campusKosts = rows.filter((kost) => kost.campus_id === campus.id);

      return {
        id: campus.id,
        name: campus.name,
        kostCount: campusKosts.length,
        latestNames: campusKosts.slice(0, 3).map((kost) => kost.name),
      };
    })
    .filter((campus) => campus.kostCount > 0);
}
