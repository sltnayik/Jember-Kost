import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, ChevronRight, HeartOff } from "lucide-react";

import { getCurrentUserFavorites } from "@/data/favorites";
import { getKosts } from "@/data/kosts";
import { UserShell } from "@/components/user/user-shell";
import EmptyState from "@/components/shared/empty-state";
import KostCard from "@/components/cards/kost-card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/auth";

interface UserFavoritesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function UserFavoritesPage({ searchParams }: UserFavoritesPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const favorites = await getCurrentUserFavorites();
  const favoriteKostIds = favorites.map((favorite) => favorite.kost_id);
  const result = favoriteKostIds.length > 0 ? await getKosts({ perPage: 1000 }) : { data: [], count: 0, page: 1, perPage: 1000, pageCount: 1 };
  const favoriteKosts = result.data.filter((kost) => favoriteKostIds.includes(kost.id));
  const perPage = 6;
  const pageCount = Math.max(1, Math.ceil(favoriteKosts.length / perPage));
  const currentPage = Number.isFinite(page) && page > 0 ? Math.min(page, pageCount) : 1;
  const pagedKosts = favoriteKosts.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <UserShell title="Kos favorit Anda" description="Daftar kos yang sudah Anda simpan untuk dipertimbangkan nanti.">
      {favoriteKosts.length === 0 ? (
        <EmptyState title="Belum ada favorit" description="Simpan kos yang Anda suka untuk melihatnya kembali di sini." icon={HeartOff} />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pagedKosts.map((kost) => (
              <KostCard key={kost.id} kost={kost} />
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between rounded-[1.6rem] border border-border/70 bg-background p-4">
            <Button asChild variant="outline" disabled={currentPage <= 1} className="rounded-2xl">
              <Link href={`/user/favorites?page=${Math.max(1, currentPage - 1)}`}>
                <ChevronLeft className="mr-2 size-4" />
                Sebelumnya
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Halaman {currentPage} dari {pageCount}
            </p>
            <Button asChild variant="outline" disabled={currentPage >= pageCount} className="rounded-2xl">
              <Link href={`/user/favorites?page=${Math.min(pageCount, currentPage + 1)}`}>
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
