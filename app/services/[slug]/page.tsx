import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ServiceDetail } from "@/components/services/service-detail";
import { supabaseServiceRole } from "@/lib/supabase-server";

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Fetch service data for metadata generation
async function getServiceBySlug(slug: string) {
  try {
    const { data: service, error } = await supabaseServiceRole
      .from('Service')
      .select('id, name, slug, description, meta_title, meta_description, is_active')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error && error.code === 'PGRST116') {
      return null;
    }

    if (error) {
      console.error('Error fetching service for metadata:', error);
      return null;
    }

    return service;
  } catch (error) {
    console.error('Error in getServiceBySlug:', error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const { data: services, error } = await supabaseServiceRole
      .from('Service')
      .select('slug')
      .eq('is_active', true);

    if (error) {
      console.error('Error generating static params:', error);
      return [];
    }

    return services.map((service) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const service = await getServiceBySlug(slug);
  
  if (!service) {
    return {
      title: 'Dịch vụ không tồn tại | CodeMarket',
      description: 'Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.'
    };
  }

  const title = service.meta_title || service.name;
  const description = service.meta_description || service.description;
  
  return {
    title: `${title} | CodeMarket`,
    description,
    keywords: `${service.name.toLowerCase()}, dịch vụ web, phát triển web, codemarket`
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  
  // Verify service exists
  const service = await getServiceBySlug(slug);
  
  if (!service) {
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