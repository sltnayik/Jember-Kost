import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getOwnerReviews } from "@/services/owner.service";

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function OwnerReviewsPage() {
  const reviews = await getOwnerReviews();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-[#0F172A]">Review Kos</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Pantau ulasan dari penyewa pada properti kos Anda.
      </p>

      <div className="mt-6 grid gap-4">
        {reviews.map((review) => {
          const reviewerName = review.reviewer?.full_name ?? "Pengguna";

          return (
            <Card key={review.id} className="rounded-2xl bg-white shadow-sm shadow-slate-950/5">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                <Avatar className="size-12">
                  <AvatarImage src={review.reviewer?.avatar_url ?? undefined} alt={reviewerName} />
                  <AvatarFallback className="bg-green-50 font-semibold text-[#16A34A]">{getInitials(reviewerName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#0F172A]">{reviewerName}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{review.kost.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                      <Star className="size-4 fill-current" />
                      {review.rating}/5
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">{review.comment || "Tidak ada komentar."}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {reviews.length === 0 ? (
          <Card className="rounded-2xl bg-white p-10 text-center text-sm text-muted-foreground shadow-sm shadow-slate-950/5">
            Belum ada review untuk kos Anda.
          </Card>
        ) : null}
      </div>
    </main>
  );
}
