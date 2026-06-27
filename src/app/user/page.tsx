import Link from "next/link";
import { Heart, MessageSquareQuote, Search, Sparkles, UserRound } from "lucide-react";

import { ProfileCompletenessBanner } from "@/components/auth/profile-completeness-banner";
import KostCard from "@/components/cards/kost-card";
import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLatestKosts } from "@/data/kosts";
import { getCurrentUserFavorites } from "@/data/favorites";
import { getCurrentProfile } from "@/services/auth";
import { createClient } from "@/lib/supabase/server";

export default async function UserDashboardPage() {
  const profile = await getCurrentProfile();
  const [favorites, latestKosts, supabase] = await Promise.all([getCurrentUserFavorites(), getLatestKosts(3), createClient()]);
  const { count: reviewCount } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile?.id ?? "");

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6">
      <ProfileCompletenessBanner profile={profile} />

      <div className="rounded-[2rem] border border-border/70 bg-background p-6 shadow-sm shadow-black/5 sm:p-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          <BrandMark className="text-sm" imageClassName="size-8 rounded-xl" showText={false} />
          Dashboard user
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Halo, {profile?.full_name ?? "pengguna"}</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Pantau favorit, ulasan, dan temukan kos terbaru yang sesuai kebutuhan Anda.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-[1.6rem] border border-border/70 bg-background shadow-sm shadow-black/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <Heart className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Favorite Saya</p>
                <p className="text-2xl font-semibold text-foreground">{favorites.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[1.6rem] border border-border/70 bg-background shadow-sm shadow-black/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <MessageSquareQuote className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Review Saya</p>
                <p className="text-2xl font-semibold text-foreground">{reviewCount ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Button asChild className="h-12 rounded-2xl bg-primary text-primary-foreground">
          <Link href="/kost">
            <Search className="mr-2 size-4" />
            Cari Kos
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-12 rounded-2xl border-border/70 bg-background">
          <Link href="/user/favorites">
            <Heart className="mr-2 size-4" />
            Favorite
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-12 rounded-2xl border-border/70 bg-background">
          <Link href="/user/reviews">
            <MessageSquareQuote className="mr-2 size-4" />
            Review
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-12 rounded-2xl border-border/70 bg-background">
          <Link href="/user/profile">
            <UserRound className="mr-2 size-4" />
            Profil
          </Link>
        </Button>
      </div>

      <div className="rounded-[2rem] border border-border/70 bg-background p-6 shadow-sm shadow-black/5">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Rekomendasi</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Kos terbaru</h2>
          </div>
          <Link href="/kost" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="size-4" />
            Lihat semua
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latestKosts.map((kost) => (
            <KostCard key={kost.id} kost={kost} />
          ))}
        </div>
      </div>
    </main>
  );
}
