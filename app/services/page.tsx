import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ServiceHero } from "@/components/services/service-hero";
import { ServicePackages } from "@/components/services/service-packages";
import { ServiceProcess } from "@/components/services/service-process";
import { ServiceFAQ } from "@/components/services/service-faq";
import { ServiceContact } from "@/components/services/service-contact";
import { ServiceTestimonials } from "@/components/services/service-testimonials";

export const metadata: Metadata = {
  title: "Dịch vụ phát triển web chuyên nghiệp | CodeMarket",
  description: "Dịch vụ phát triển web, bảo trì website, customization dự án và tư vấn kỹ thuật chuyên nghiệp",
  keywords: "dịch vụ web, phát triển web, bảo trì website, customization, tư vấn kỹ thuật"
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ServiceHero />
        <ServicePackages />
        <ServiceProcess />
        <ServiceTestimonials />
        <ServiceFAQ />
        <ServiceContact />
      </main>
      <Footer />
    </div>
  );
} 