import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
  comment: z.string().trim().min(3, "Komentar minimal 3 karakter").max(500, "Komentar maksimal 500 karakter"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
