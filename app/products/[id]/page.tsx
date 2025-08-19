import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ProductDetail } from "@/components/products/product-detail";
import { Project } from "@/types";
import { CardLoader } from "@/components/ui/loader";

async function getProduct(id: string): Promise<Project | null> {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
      
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    
    if (result.success && result.product) {
      return result.product;
    }

    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Suspense fallback={<CardLoader />}>
          <ProductDetail product={product} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
      
    const response = await fetch(`${baseUrl}/api/products`);
    
    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    
    if (result.success && result.products) {
      return result.products.map((product: Project) => ({
        id: product.id,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProduct(params.id);
  
  if (!product) {
    return {
      title: "Sản phẩm không tồn tại",
    };
  }

  return {
    title: `${product.title} - CodeMarket`,
    description: product.description,
  };
} 