"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Star, 
  Search, 
  Filter, 
  Eye, 
  ShoppingCart,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Project } from "@/types";
import { cn } from "@/lib/utils";
import { useProductsList } from "@/hooks/use-products-list";

const categories = [
  "Tất cả",
  "Next.js Templates",
  "UI Components", 
  "E-commerce",
  "Admin Dashboards",
  "React Projects"
];

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "price-low", label: "Giá thấp đến cao" },
  { value: "price-high", label: "Giá cao đến thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "popular", label: "Phổ biến nhất" }
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

export function ProductList() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const {
    products,
    loading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    totalProducts
  } = useProductsList();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">Có lỗi xảy ra khi tải sản phẩm: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">
          Tất cả sản phẩm chất lượng cao
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Danh sách sản phẩm
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Khám phá bộ sưu tập source code React/NextJS được xây dựng chuyên nghiệp
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View Mode */}
        <div className="flex rounded-lg border">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-r-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          Hiển thị {products.length} của {totalProducts} sản phẩm
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className={cn(
            "grid gap-6 mb-8",
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}>
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
                  <div className="relative">
                    <div className="aspect-[3/2] bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                      <Image
                        src={product.thumbnailUrl || "/Images/do.jpg"}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized
                      />
                      
                      {/* Demo Overlay */}
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
                            className="bg-white/90 hover:bg-white text-black"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem Demo
                          </Button>
                        </div>
                      )}
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
                        {product.viewCount || 0}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pb-1 flex-shrink-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg leading-tight line-clamp-2 min-h-[2.5rem]">
                        {product.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0 min-h-[2rem]">
                      {product.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0 pb-2 flex-grow flex flex-col justify-between">
                    <div className="flex flex-wrap gap-1 mb-1 min-h-[1.5rem]">
                      {product.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs py-0 px-2">
                          {tech}
                        </Badge>
                      ))}
                      {product.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs py-0 px-2">
                          +{product.technologies.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(product.averageRating || 0)}
                        </div>
                        <span className="text-sm font-medium">
                          {product.averageRating ? Number(product.averageRating).toFixed(1) : "0.0"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({product.totalReviews || 0} đánh giá)
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
                              // Handle direct purchase or navigate to product page
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Trước
              </Button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(pageNum => {
                  return pageNum === 1 || 
                         pageNum === totalPages || 
                         Math.abs(pageNum - currentPage) <= 1;
                })
                .map((pageNum, index, array) => (
                  <div key={pageNum} className="flex items-center">
                    {index > 0 && array[index - 1] !== pageNum - 1 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={pageNum === currentPage ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  </div>
                ))
              }

              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Sau
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
