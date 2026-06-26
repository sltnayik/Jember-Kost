import { getFeaturedKosts, getLatestKosts, getLandingStats, getNearbyKosts } from "@/data/kosts";
import HeroSection from "@/components/layouts/hero-section";
import SearchSection from "@/components/layouts/search-section";
import FeatureSection from "@/components/layouts/feature-section";
import CampusSection from "@/components/layouts/campus-section";
import StatsSection from "@/components/layouts/stats-section";
import CTASection from "@/components/layouts/cta-section";
import { HomeKostSection } from "@/components/user/home-kost-section";

export default async function HomePage() {
  const [featured, latest, nearby, stats] = await Promise.all([getFeaturedKosts(6), getLatestKosts(6), getNearbyKosts(6), getLandingStats()]);

  return (
    <>
      <HeroSection />
      <SearchSection />
      <HomeKostSection title="Kos Terbaru" description="Pilihan terbaru yang baru masuk ke platform." kosts={latest} />
      <HomeKostSection title="Kos Rekomendasi" description="Rekomendasi yang cocok untuk mahasiswa dan pekerja." kosts={featured} />
      <HomeKostSection title="Kos Dekat Kampus" description="Opsi yang paling dekat dengan kampus pilihan Anda." kosts={nearby} />
      <FeatureSection />
      <CampusSection />
      <StatsSection stats={stats} />
      <CTASection />
    </>
  );
}
