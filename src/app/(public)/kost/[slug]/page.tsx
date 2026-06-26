import { notFound } from "next/navigation";

import { getKostBySlug } from "@/data/kosts";
import { KostDetailShell } from "@/components/user/kost-detail-shell";
import { ReviewForm } from "@/components/user/review-form";

interface KostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function KostDetailPage({ params }: KostDetailPageProps) {
  const { slug } = await params;
  const kost = await getKostBySlug(slug);

  if (!kost) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <KostDetailShell kost={kost} />
      <div className="mt-8">
        <ReviewForm kostId={kost.id} existingReview={kost.user_review} />
      </div>
    </main>
  );
}
