import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ProductDetail } from "@/components/products/product-detail";
import { Project } from "@/types";
import { CardLoader } from "@/components/ui/loader";

// Mock data - trong thực tế sẽ fetch từ database
const products: Project[] = [
  {
    id: "1",
    title: "E-commerce Website Complete",
    description: "Website bán hàng hoàn chỉnh với React, NextJS, Prisma, Stripe payment integration và dashboard quản trị mạnh mẽ",
    image: "/products/ecommerce.jpg",
    technologies: ["React", "NextJS", "Prisma", "Stripe", "Tailwind", "TypeScript"],
    category: "E-commerce",
    price: "499,000đ",
    rating: 4.8,
    reviews: 156,
  },
  {
    id: "2", 
    title: "Social Media App",
    description: "Ứng dụng mạng xã hội với real-time chat, posts, comments, likes và user profiles",
    image: "/products/social.jpg",
    technologies: ["React", "NextJS", "Socket.io", "MongoDB", "Cloudinary"],
    category: "Social Media",
    price: "799,000đ",
    rating: 4.9,
    reviews: 89,
  },
  {
    id: "3",
    title: "Learning Management System",
    description: "Hệ thống quản lý học tập với video streaming, assignments, grading và certificates",
    image: "/products/lms.jpg",
    technologies: ["React", "NextJS", "Prisma", "AWS S3", "Stripe"],
    category: "Education", 
    price: "1,299,000đ",
    rating: 4.7,
    reviews: 67,
  },
];

async function getProduct(id: string): Promise<Project | null> {
  // Simulate API call
  return products.find(p => p.id === id) || null;
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
  return products.map((product) => ({
    id: product.id,
  }));
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