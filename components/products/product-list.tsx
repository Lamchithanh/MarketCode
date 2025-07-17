"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
  ChevronRight
} from "lucide-react";
import { Project } from "@/types";
import { cn } from "@/lib/utils";

// Mock data - trong thực tế sẽ fetch từ API
const products: Project[] = [
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
  {
    id: "6",
    title: "Real Estate Platform",
    description: "Nền tảng bất động sản với tìm kiếm, bộ lọc, map integration, virtual tours",
    image: "/products/realestate.jpg",
    technologies: ["React", "NextJS", "Google Maps", "Prisma", "Cloudinary"],
    category: "Real Estate",
    price: "999,000đ",
    rating: 4.8,
    reviews: 45,
  },
];

const categories = ["Tất cả", "E-commerce", "Social Media", "Education", "Productivity", "CMS", "Real Estate"];
const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá: Thấp đến cao" },
  { value: "price-desc", label: "Giá: Cao đến thấp" },
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const itemsPerPage = 6;

  // Filter và sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Category filter
    if (selectedCategory !== "Tất cả") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
        case "price-desc":
          return parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, ''));
        case "rating":
          return b.rating - a.rating;
        case "popular":
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Danh sách sản phẩm
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Khám phá bộ sưu tập source code React/NextJS được xây dựng chuyên nghiệp
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
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

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Tổng số {filteredProducts.length} sản phẩm
        </p>
      </div>

      {/* Products Grid/List */}
      <div className={cn(
        "mb-8",
        viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-6"
      )}>
        {paginatedProducts.map((product) => (
          <Card
            key={product.id}
            className={cn(
              "group hover:shadow-lg transition-all duration-300 overflow-hidden",
              viewMode === "list" && "flex flex-row"
            )}
          >
            <div className={cn(
              "relative",
              viewMode === "list" ? "w-48 flex-shrink-0" : ""
            )}>
              <div className={cn(
                "bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center",
                viewMode === "list" ? "aspect-square" : "aspect-video"
              )}>
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
            </div>

            <div className="flex-1">
              <CardHeader className={cn(viewMode === "list" && "pb-2")}>
                <div className="flex items-start justify-between">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{product.reviews}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </CardHeader>

              <CardContent className={cn("pt-0", viewMode === "list" && "pb-4")}>
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
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl text-muted-foreground mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy sản phẩm nào</h3>
          <p className="text-muted-foreground mb-4">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc khác
          </p>
          <Button onClick={() => {
            setSearchTerm("");
            setSelectedCategory("Tất cả");
            setSortBy("newest");
          }}>
            Xóa bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
} 