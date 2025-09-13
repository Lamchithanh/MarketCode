"use client";

import React, { useState, useEffect, Fragment } from "react";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Star, 
  Search, 
  Filter, 
  Eye, 
  ShoppingCart,
  Grid3X3,
  List,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductsList } from "@/hooks/use-products-list";

interface Category {
  id: string;
  name: string;
}

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
  const [categories, setCategories] = useState<Category[]>([]);
  
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

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.categories) {
          setCategories(result.categories);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      setCategories([
        { id: 'all', name: 'Tất cả' },
        { id: 'nextjs-templates', name: 'Next.js Templates' },
        { id: 'ui-components', name: 'UI Components' },
        { id: 'ecommerce', name: 'E-commerce' },
        { id: 'admin-dashboards', name: 'Admin Dashboards' },
        { id: 'react-projects', name: 'React Projects' }
      ]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
              <SelectItem key={category.id} value={category.name}>
                {category.name}
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
            "gap-6 mb-8",
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col space-y-4"
          )}>
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className={cn(
                  "group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer",
                  viewMode === "grid" ? "h-full flex flex-col" : "flex flex-row h-auto"
                )}>
                  {/* Image Section */}
                  <div className={cn(
                    "relative",
                    viewMode === "grid" ? "w-full" : "w-80 flex-shrink-0"
                  )}>
                    <div className={cn(
                      "bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden",
                      viewMode === "grid" ? "aspect-[3/2]" : "aspect-[4/3]"
                    )}>
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

                  {/* Content Section */}
                  <div className={cn(
                    "flex flex-col",
                    viewMode === "grid" ? "flex-1" : "flex-1 justify-between"
                  )}>
                    <CardHeader className={cn(
                      viewMode === "grid" ? "pb-1 flex-shrink-0" : "pb-2"
                    )}>
                      <div className="flex items-start justify-between">
                        <h3 className={cn(
                          "font-semibold leading-tight line-clamp-2",
                          viewMode === "grid" ? "text-lg min-h-[2.5rem]" : "text-xl min-h-0"
                        )}>
                          {product.title}
                        </h3>
                      </div>
                      <p className={cn(
                        "text-muted-foreground mt-0",
                        viewMode === "grid" ? "text-sm line-clamp-2 min-h-[2rem]" : "text-base line-clamp-3"
                      )}>
                        {product.description}
                      </p>
                    </CardHeader>

                    <CardContent className={cn(
                      "flex-grow flex flex-col justify-between",
                      viewMode === "grid" ? "pt-0 pb-2" : "pt-0 pb-4"
                    )}>
                      {/* Technologies */}
                      <div className={cn(
                        "flex flex-wrap gap-1 mb-3",
                        viewMode === "grid" ? "min-h-[1.5rem]" : "min-h-0"
                      )}>
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

                      {/* Rating and Actions */}
                      <div className={cn(
                        "space-y-3",
                        viewMode === "list" && "flex flex-row items-center justify-between space-y-0"
                      )}>
                        {/* Rating */}
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

                        {/* Price and Actions */}
                        <div className={cn(
                          "flex items-center justify-between",
                          viewMode === "list" && "flex-col items-end space-y-2"
                        )}>
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
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                      }
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(pageNum => {
                    // Show first page, last page, current page and adjacent pages
                    return pageNum === 1 || 
                           pageNum === totalPages || 
                           Math.abs(pageNum - currentPage) <= 1;
                  })
                  .map((pageNum, index, array) => (
                    <Fragment key={pageNum}>
                      {/* Add ellipsis if there's a gap */}
                      {index > 0 && array[index - 1] !== pageNum - 1 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive={pageNum === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                          }}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    </Fragment>
                  ))
                }

                {/* Next Button */}
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
