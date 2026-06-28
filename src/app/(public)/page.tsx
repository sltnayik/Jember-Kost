import HeroSection from "@/components/layouts/hero-section";
import SearchSection from "@/components/layouts/search-section";
import FeatureSection from "@/components/layouts/feature-section";
import CampusSection from "@/components/layouts/campus-section";
// import StatsSection from "@/components/layouts/stats-section";
import CTASection from "@/components/layouts/cta-section";

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <FeatureSection />
      <CampusSection />
      {/* <StatsSection stats={stats} /> */}
      <CTASection />
    </>
  );
}
