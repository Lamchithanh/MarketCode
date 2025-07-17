import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ServiceDetail } from "@/components/services/service-detail";

interface ServiceDetailPageProps {
  params: {
    slug: string;
  };
}

// Danh sách các service slugs hợp lệ
const validSlugs = [
  'custom-development',
  'project-customization', 
  'maintenance',
  'ui-redesign',
  'performance-optimization',
  'consultation'
];

export async function generateStaticParams() {
  return validSlugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = params;
  
  if (!validSlugs.includes(slug)) {
    return {
      title: 'Dịch vụ không tồn tại | CodeMarket'
    };
  }

  const serviceTitles: Record<string, string> = {
    'custom-development': 'Phát triển dự án theo yêu cầu',
    'project-customization': 'Chỉnh sửa dự án có sẵn',
    'maintenance': 'Bảo trì & Hỗ trợ',
    'ui-redesign': 'Thiết kế lại giao diện',
    'performance-optimization': 'Tối ưu hiệu suất',
    'consultation': 'Tư vấn kỹ thuật'
  };

  const title = serviceTitles[slug];
  
  return {
    title: `${title} | CodeMarket`,
    description: `Chi tiết dịch vụ ${title.toLowerCase()} - Giải pháp phát triển web chuyên nghiệp`,
    keywords: `${title.toLowerCase()}, dịch vụ web, phát triển web, codemarket`
  };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = params;
  
  if (!validSlugs.includes(slug)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ServiceDetail slug={slug} />
      </main>
      <Footer />
    </div>
  );
} 