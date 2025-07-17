import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { 
  ContactHero,
  ContactMain,
  ContactFAQ,
  ContactCTA
} from "@/components/contact";

export const metadata: Metadata = {
  title: "Liên hệ | CodeMarket",
  description: "Liên hệ với CodeMarket để được tư vấn về source code React/NextJS và các dịch vụ phát triển web",
  keywords: "liên hệ, codemarket, tư vấn, source code, react, nextjs, hỗ trợ"
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ContactHero />
        <ContactMain />
        <ContactFAQ />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
} 