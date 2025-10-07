import BentoFeaturesSection from "@/components/landing/bento-features-section";
import FeaturesSection from "@/components/landing/features-section";
import FooterSection from "@/components/landing/footer";
import { HeroHeader } from "@/components/landing/header";
import HeroSection from "@/components/landing/hero-section";

export default function Home() {
  return (
    <main>
      <HeroHeader />
      <HeroSection />
      <FeaturesSection />
      <BentoFeaturesSection />
      <FooterSection />
    </main>
  );
}
