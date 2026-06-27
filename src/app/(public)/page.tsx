import { getCampusKostSummaries, getLandingStats } from "@/data/kosts";
import HeroSection from "@/components/layouts/hero-section";
import SearchSection from "@/components/layouts/search-section";
import FeatureSection from "@/components/layouts/feature-section";
import CampusSection from "@/components/layouts/campus-section";
// import StatsSection from "@/components/layouts/stats-section";
import CTASection from "@/components/layouts/cta-section";

export default async function HomePage() {
  const [stats, campusSummaries] = await Promise.all([getLandingStats(), getCampusKostSummaries()]);

  return (
    <>
      <HeroSection />
      <SearchSection />
      <FeatureSection />
      <CampusSection campuses={campusSummaries} />
      {/* <StatsSection stats={stats} /> */}
      <CTASection />
    </>
  );
}
