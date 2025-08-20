"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { 
  Star, 
  ShoppingCart, 
  Download, 
  Eye, 
  Heart, 
  Share2,
  Check,
  Code,
  Database,
  Shield,
  HelpCircle,
  Monitor,
  Smartphone,
  Clock,
  Users,
  Award,
  PlayCircle,
  FileText,
  Github
} from "lucide-react";
import { Project } from "@/types";
import { cn } from "@/lib/utils";
import { RelatedProducts } from "./related-products";

interface ProductDetailProps {
  product: Project;
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

// Mock data for detailed product info
const getProductDetails = (id: string) => {
  const baseDetails = {
    features: [
      "Source code đầy đủ và có thể chỉnh sửa",
      "Documentation chi tiết bằng tiếng Việt",
      "Database schema và API endpoints",
      "Responsive design cho mobile",
      "Modern UI/UX với Tailwind CSS",
      "TypeScript support",
      "Hỗ trợ kỹ thuật 6 tháng",
      "Cập nhật miễn phí trong 3 tháng"
    ],
    includes: [
      "Frontend source code (React/NextJS)",
      "Backend API (Node.js/Express hoặc NextJS API)",
      "Database schema files",
      "UI Components library",
      "Documentation và hướng dẫn setup",
      "Sample data và configurations",
      "Deployment guides"
    ],
    requirements: [
      "Node.js 18+ và npm/yarn",
      "Basic knowledge về React/NextJS",
      "Hiểu biết cơ bản về JavaScript/TypeScript",
      "Git cho version control"
    ],
    demoLinks: [
      { label: "Live Demo", url: "#", icon: Monitor },
      { label: "Mobile Demo", url: "#", icon: Smartphone },
      { label: "Admin Panel", url: "#", icon: Shield }
    ]
  };

  return baseDetails;
};

// Mock reviews data
const mockReviews = [
  {
    id: "1",
    user: "Nguyễn Văn An",
    role: "Sinh viên CNTT",
    rating: 5,
    comment: "Source code rất chi tiết, documentation đầy đủ. Giúp tôi hiểu được cách xây dựng một ứng dụng hoàn chỉnh.",
    date: "2 ngày trước"
  },
  {
    id: "2", 
    user: "Trần Thị Bình",
    role: "Frontend Developer",
    rating: 5,
    comment: "Code clean, structure tốt. Đáng tiền bỏ ra. Team support rất nhiệt tình.",
    date: "1 tuần trước"
  },
  {
    id: "3",
    user: "Lê Minh Cường", 
    role: "Full-stack Developer",
    rating: 4,
    comment: "Chất lượng tốt, phù hợp để học hỏi và phát triển thêm. Recommend!",
    date: "2 tuần trước"
  }
];

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);
  const details = getProductDetails(product.id);

  // Generate gallery images
  const galleryImages = product.images && product.images.length > 0 
    ? product.images.slice(0, 4) 
    : [
        `https://picsum.photos/800/600?random=${product.id.slice(0, 8)}1`,
        `https://picsum.photos/800/600?random=${product.id.slice(0, 8)}2`, 
        `https://picsum.photos/800/600?random=${product.id.slice(0, 8)}3`,
        `https://picsum.photos/800/600?random=${product.id.slice(0, 8)}4`
      ];

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">Sản phẩm</Link>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Product Images */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Main Preview */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                <Image
                  src={product.thumbnailUrl || product.image || "/Images/do.jpg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                {product.demoUrl && (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm text-white hover:bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    onClick={() => product.demoUrl && (window.location.href = product.demoUrl)}
                  >
                    <PlayCircle className="h-8 w-8 mr-2" />
                    Xem Demo
                  </Button>
                )}
              </div>
            </Card>

            {/* Demo Links */}
            <div className="grid grid-cols-3 gap-4">
              {details.demoLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <Button key={index} variant="outline" className="h-auto p-4 flex-col">
                    <IconComponent className="h-6 w-6 text-amber-600 mb-2" />
                    <span className="text-xs text-muted-foreground">
                      {link.label}
                    </span>
                  </Button>
                );
              })}
            </div>

            {/* Screenshots Gallery */}
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((imageUrl, i) => (
                <Card 
                  key={i} 
                  className="aspect-video overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative group"
                  onClick={() => setLightboxImage(i)}
                >
                  <Image
                    src={imageUrl}
                    alt={`${product.title} screenshot ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge variant="secondary">{product.category}</Badge>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={cn(
                      "h-4 w-4",
                      isWishlisted ? "fill-red-500 text-red-500" : ""
                    )} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardTitle className="text-2xl">{product.title}</CardTitle>
              <p className="text-muted-foreground">{product.description}</p>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews} đánh giá)
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-primary">
                {product.price}
              </div>
            </CardHeader>

            <CardContent>
              {/* Tech Stack */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Công nghệ sử dụng:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.technologies.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button size="lg" className="w-full" asChild>
                  <Link href="/checkout">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Mua ngay
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Xem trước
                </Button>
              </div>

              <Separator className="my-6" />

              {/* Features */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Bảo hành và hỗ trợ
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Hỗ trợ kỹ thuật 6 tháng</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Cập nhật miễn phí 3 tháng</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Đảm bảo code chạy được</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{product.reviews}</div>
                  <div className="text-sm text-muted-foreground">Đánh giá</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">Tính năng</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="features">Tính năng</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            <TabsTrigger value="support">Hỗ trợ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Mô tả chi tiết
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description} Đây là một source code được xây dựng bằng những công nghệ hiện đại nhất, 
                    đảm bảo tính bảo mật cao và hiệu suất tối ưu. Phù hợp cho các developer muốn học hỏi 
                    hoặc sử dụng cho dự án thực tế.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Yêu cầu hệ thống
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {details.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Tính năng nổi bật</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(product.features && product.features.length > 0 
                      ? product.features 
                      : details.features.map(f => ({ title: f, description: "" }))
                    ).map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{typeof feature === 'string' ? feature : feature.title}</div>
                          {typeof feature === 'object' && feature.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {feature.description}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bao gồm trong gói</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {details.includes.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <FileText className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <div className="space-y-6">
              {mockReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback>{review.user.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold">{review.user}</span>
                          <Badge variant="outline" className="text-xs">{review.role}</Badge>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="support" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Hỗ trợ kỹ thuật
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">Hỗ trợ 24/7 qua email</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm">Cộng đồng Discord</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Github className="h-4 w-4 text-primary" />
                      <span className="text-sm">Github repository</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Bảo hành
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Bảo hành code 6 tháng</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Hoàn tiền 100% trong 7 ngày</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Cập nhật miễn phí</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <RelatedProducts currentProductId={product.id} category={product.category} />

      {/* Image Lightbox */}
      <ImageLightbox 
        images={galleryImages}
        currentIndex={lightboxImage || 0}
        isOpen={lightboxImage !== null}
        onClose={() => setLightboxImage(null)}
        productTitle={product.title}
      />
    </div>
  );
} 