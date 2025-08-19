"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  Download, 
  Users, 
  Shield, 
  RefreshCw, 
  MessageSquare, 
  ShoppingCart,
  Eye,
  Calendar,
  Zap
} from "lucide-react";

interface ProductInfoProps {
  product: {
    id: string;
    title: string;
    description?: string;
    price: number;
    originalPrice?: number;
    rating: number;
    totalRatings: number;
    downloads: number;
    category?: { name: string };
    tags?: string[];
    views?: number;
    updatedAt: string;
    sellerId?: string;
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    // TODO: Implement add to cart logic
    console.log("Add to cart:", product.id);
  };

  const handleBuyNow = () => {
    // TODO: Implement buy now logic
    console.log("Buy now:", product.id);
  };

  const handlePreview = () => {
    // TODO: Implement preview logic
    console.log("Preview:", product.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {product.category && (
            <Badge variant="secondary" className="text-xs">
              {product.category.name}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs text-green-600">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        </div>
        
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
          {product.title}
        </h1>
        
        <p className="text-muted-foreground leading-relaxed">
          {product.description || "Không có mô tả chi tiết."}
        </p>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Price & Rating */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    -{discountPercentage}%
                  </Badge>
                </>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm font-medium ml-2">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.totalRatings.toLocaleString()} đánh giá)
              </span>
            </div>

            <Separator />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <Download className="h-5 w-5 text-primary mx-auto" />
                <div className="text-sm font-medium">
                  {product.downloads.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Downloads
                </div>
              </div>
              <div className="space-y-1">
                <Eye className="h-5 w-5 text-primary mx-auto" />
                <div className="text-sm font-medium">
                  {(product.views || 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Views
                </div>
              </div>
              <div className="space-y-1">
                <Calendar className="h-5 w-5 text-primary mx-auto" />
                <div className="text-sm font-medium">
                  {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                </div>
                <div className="text-xs text-muted-foreground">
                  Updated
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button 
          size="lg" 
          className="w-full text-lg font-semibold bg-primary hover:bg-primary/90"
          onClick={handleBuyNow}
        >
          <Zap className="h-5 w-5 mr-2" />
          Mua Ngay - ${product.price.toLocaleString()}
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Thêm Giỏ Hàng
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={handlePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            Xem Trước
          </Button>
        </div>
      </div>

      {/* Features */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 text-primary mr-2" />
            Đảm Bảo Chất Lượng
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-green-600" />
              <span>Cập nhật miễn phí</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span>Hỗ trợ 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <span>Bảo hành code</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-600" />
              <span>Cộng đồng hỗ trợ</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
