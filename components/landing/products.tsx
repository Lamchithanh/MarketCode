"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Eye, ShoppingCart, Loader2 } from "lucide-react";
import { Project } from "@/types";
import Link from "next/link";
import { useProductsLanding } from "@/hooks/use-products-landing";

interface Category {
  id: string;
  name: string;
}



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

export function Products() {
  const { products, loading, error } = useProductsLanding();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return (
      <section className="py-24">
        <div className="container">
          <div className="text-center">
            <p className="text-red-500">Có lỗi xảy ra khi tải sản phẩm</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Source Code chất lượng cao
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Danh sách sản phẩm
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Khám phá bộ sưu tập source code React/NextJS được xây dựng chuyên
            nghiệp, sẵn sàng sử dụng cho dự án của bạn
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: Project) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
                  <div className="relative">
                    <div className="aspect-[3/2] overflow-hidden bg-muted relative">
                      <Image 
                        src={product.thumbnailUrl || product.image || "/Images/images.png"} 
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
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
                    
                    {/* Demo overlay */}
                    {product.demoUrl && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            if (product.demoUrl) {
                              window.location.href = product.demoUrl;
                            }
                          }}
                          className="bg-white text-black hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem Demo
                        </Button>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg leading-tight line-clamp-2 min-h-[3rem]">
                        {product.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2 min-h-[2.5rem]">
                      {product.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0 flex-grow flex flex-col justify-between">
                    <div className="flex flex-wrap gap-1 mb-4 min-h-[2rem]">
                      {product.technologies.slice(0, 3).map((tech: string) => (
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

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews} đánh giá)
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary">
                          {product.price}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/products/${product.id}`;
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/products/${product.id}`;
                            }}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Mua ngay
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/products">
              <Download className="mr-2 h-4 w-4" />
              Xem thêm sản phẩm
            </Link>
          </Button>
        </div>

        {/* Categories Filter */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-6">Danh mục sản phẩm</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
