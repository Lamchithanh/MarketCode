import { Suspense } from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ProductDetailContainer } from "@/components/products/product-detail-container";
import { CardLoader } from "@/components/ui/loader";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Suspense fallback={<CardLoader />}>
          <ProductDetailContainer />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  
  // TODO: Fetch product data using MCP tools for metadata
  return {
    title: `Sản phẩm ${id} - MarketCode`,
    description: "Chi tiết sản phẩm trên MarketCode",
  };
} 