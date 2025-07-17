import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ProductList } from "@/components/products/product-list";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProductList />
      </main>
      <Footer />
    </div>
  );
}

export const metadata = {
  title: "Sản phẩm - CodeMarket",
  description: "Khám phá bộ sưu tập source code React/NextJS chất lượng cao",
}; 