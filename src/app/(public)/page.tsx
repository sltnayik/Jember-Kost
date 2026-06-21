import HeroSection from "@/components/layouts/hero-section";
import SearchSection from "@/components/layouts/search-section";
import FeaturedKostSection from "@/components/layouts/featured-kost-section";
import CampusSection from "@/components/layouts/campus-section";
import WhyUsSection from "@/components/layouts/why-us-section";
import StatsSection from "@/components/layouts/stats-section";
import CTASection from "@/components/layouts/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <FeaturedKostSection />
      <CampusSection />
      <WhyUsSection />
      <StatsSection />
      <CTASection />
    </>
  );
}