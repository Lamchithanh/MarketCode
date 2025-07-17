"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, ShoppingCart } from "lucide-react";
import { Project } from "@/types";

interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
}

// Mock data - trong thực tế sẽ fetch từ API
const allProducts: Project[] = [
  {
    id: "1",
    title: "E-commerce Website Complete",
    description: "Website bán hàng hoàn chỉnh với React, NextJS, Prisma, Stripe payment integration",
    image: "/products/ecommerce.jpg",
    technologies: ["React", "NextJS", "Prisma", "Stripe", "Tailwind"],
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
  {
    id: "4",
    title: "Task Management App",
    description: "Ứng dụng quản lý công việc kiểu Trello với drag & drop, team collaboration",
    image: "/products/task.jpg",
    technologies: ["React", "NextJS", "DnD Kit", "Prisma", "WebSocket"],
    category: "Productivity",
    price: "599,000đ",
    rating: 4.6,
    reviews: 124,
  },
  {
    id: "5",
    title: "Blog CMS Platform",
    description: "Hệ thống quản lý blog với rich text editor, SEO optimization, multi-author",
    image: "/products/blog.jpg",
    technologies: ["React", "NextJS", "MDX", "Prisma", "Vercel"],
    category: "CMS",
    price: "399,000đ",
    rating: 4.5,
    reviews: 203,
  },
];

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < Math.floor(rating)
          ? "fill-yellow-400 text-yellow-400"
          : "text-gray-300"
      }`}
    />
  ));
};

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  // Filter products liên quan
  const relatedProducts = allProducts
    .filter(product => product.id !== currentProductId)
    .filter(product => category ? product.category === category : true)
    .slice(0, 3);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Sản phẩm liên quan</h2>
        <p className="text-muted-foreground">
          Khám phá thêm những source code tương tự
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-4xl font-bold text-primary/20">
                  {product.title.split(" ")[0]}
                </div>
              </div>
              <Badge
                variant="secondary"
                className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm"
              >
                {product.category}
              </Badge>
              <div className="absolute top-3 right-3 flex items-center space-x-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
                <Eye className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {product.reviews}
                </span>
              </div>
            </div>

            <CardHeader>
              <div className="flex items-start justify-between">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                {product.description}
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1 mb-4">
                {product.technologies.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {product.technologies.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.technologies.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({product.reviews} đánh giá)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-primary">
                  {product.price}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/products/${product.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/products/${product.id}`}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Mua ngay
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button variant="outline" asChild>
          <Link href="/products">
            Xem tất cả sản phẩm
          </Link>
        </Button>
      </div>
    </div>
  );
} 