import type { Tables } from "@/types/database";

export type Favorite = Tables<"favorites">;

export type FavoriteActionInput = {
  kostId: string;
  path: string;
};

export type FavoriteActionResult = {
  success: boolean;
  isFavorited?: boolean;
  error?: string;
};
