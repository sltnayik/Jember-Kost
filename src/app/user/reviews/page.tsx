import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, ChevronRight, MessageSquareQuote, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserShell } from "@/components/user/user-shell";
import EmptyState from "@/components/shared/empty-state";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/auth";

interface UserReviewsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function UserReviewsPage({ searchParams }: UserReviewsPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const supabase = await createClient();
  const { data: reviews } = await supabase.from("reviews").select("*, kosts(name, slug)").eq("user_id", user.id).eq("is_hidden", false).order("created_at", { ascending: false });
  const perPage = 6;
  const pageCount = Math.max(1, Math.ceil((reviews?.length ?? 0) / perPage));
  const currentPage = Number.isFinite(page) && page > 0 ? Math.min(page, pageCount) : 1;
  const pagedReviews = (reviews ?? []).slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <UserShell title="Review yang pernah Anda kirim" description="Pantau ulasan yang telah Anda beri untuk membantu pengguna lain.">
      {(reviews?.length ?? 0) === 0 ? (
        <EmptyState title="Belum ada review" description="Berikan ulasan untuk kos yang pernah Anda tinggali agar membantu calon penghuni lain." icon={MessageSquareQuote} />
      ) : (
        <>
          <div className="grid gap-6">
            {pagedReviews.map((review) => (
              <Card key={review.id} className="rounded-[1.6rem] border border-border/70 bg-background shadow-sm shadow-black/5">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <Link href={`/kost/${review.kosts?.slug ?? ""}`} className="text-lg font-semibold text-foreground hover:text-primary">
                        {review.kosts?.name ?? "Kos"}
                      </Link>
                      <p className="mt-2 text-sm text-muted-foreground">{review.comment ?? "Tidak ada komentar."}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-sm font-medium text-amber-600">
                      <Star className="size-4 fill-current" />
                      {review.rating}
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{new Date(review.created_at ?? Date.now()).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between rounded-[1.6rem] border border-border/70 bg-background p-4">
            <Button asChild variant="outline" disabled={currentPage <= 1} className="rounded-2xl">
              <Link href={`/user/reviews?page=${Math.max(1, currentPage - 1)}`}>
                <ChevronLeft className="mr-2 size-4" />
                Sebelumnya
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Halaman {currentPage} dari {pageCount}
            </p>
            <Button asChild variant="outline" disabled={currentPage >= pageCount} className="rounded-2xl">
              <Link href={`/user/reviews?page=${Math.min(pageCount, currentPage + 1)}`}>
                Selanjutnya
                <ChevronRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </>
      )}
    </UserShell>
  );
}
