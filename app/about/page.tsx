import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { 
  AboutHero,
  AboutMission,
  AboutValues,
  AboutTeam,
  AboutStats,
  AboutCTA
} from "@/components/about";

export const metadata: Metadata = {
  title: "Về chúng tôi | CodeMarket",
  description: "Tìm hiểu về CodeMarket - Marketplace source code React/NextJS chuyên nghiệp với đội ngũ phát triển kinh nghiệm",
  keywords: "về chúng tôi, codemarket, source code, react, nextjs, đội ngũ phát triển"
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <AboutHero />
        <AboutMission />
        <AboutValues />
        <AboutTeam />
        <AboutStats />
        <AboutCTA />
      </main>
      <Footer />
    </div>
  );
} 