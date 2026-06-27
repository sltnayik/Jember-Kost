import type { Enums, Tables } from "@/types/database";

export type KostRow = Tables<"kosts">;
export type KostImage = Tables<"kost_images">;
export type KostFacility = Tables<"facilities">;
export type KostCampus = Tables<"campuses">;
export type KostReview = Tables<"reviews">;
export type KostGenderType = Enums<"gender_type">;
export type KostStatus = Enums<"kost_status">;

export type KostSort = "latest" | "price_low" | "price_high" | "rating_high" | "nearby" | "name_asc";

export type KostFilters = {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  genderType?: KostGenderType;
  district?: string;
  campusId?: string;
  facilityId?: string;
  status?: KostStatus;
  sort?: KostSort;
  page?: number;
  perPage?: number;
};

export type KostReviewSummary = {
  average: number;
  count: number;
};

export type KostCardData = KostRow & {
  thumbnail_url: string | null;
  images: KostImage[];
  facilities: KostFacility[];
  campus: KostCampus | null;
  rating: KostReviewSummary;
  is_favorited: boolean;
};

export type KostDetailReview = KostReview & {
  reviewer_name: string;
  reviewer_avatar_url: string | null;
};

export type KostDetailData = KostCardData & {
  reviews: KostDetailReview[];
  user_review: {
    id: string;
    rating: number;
    comment: string | null;
    created_at: string | null;
  } | null;
  owner_name: string | null;
  owner_avatar_url: string | null;
  owner_phone: string | null;
};

export type KostListResult = {
  data: KostCardData[];
  count: number;
  page: number;
  perPage: number;
  pageCount: number;
};

export type KostFilterOptions = {
  campuses: Pick<KostCampus, "id" | "name">[];
  districts: string[];
  facilities: Pick<KostFacility, "id" | "name">[];
};

export type LandingStats = {
  totalKosts: number;
  totalCampuses: number;
  totalRooms: number;
  availableRooms: number;
};
