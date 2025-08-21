"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { BuyNowButton } from "@/components/products/buy-now-button";
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
  Check,
  Share2
} from "lucide-react";
import { SimpleShareMenu } from "@/components/ui/simple-share-menu";

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
  const { addItem, items } = useCart();
  const [isInCart, setIsInCart] = useState(false);
  
  // Check if product is already in cart
  useEffect(() => {
    const productInCart = items.some(item => item.id === product.id);
    setIsInCart(productInCart);
  }, [items, product.id]);
  
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    try {
      const result = await addItem(product.id);
      if (result.success) {
        toast.success("Đã thêm sản phẩm vào giỏ hàng!");
        setIsInCart(true);
      } else {
        if (result.error === "Item already in cart") {
          toast.warning("Sản phẩm đã có trong giỏ hàng rồi!");
          setIsInCart(true);
        } else {
          toast.error(result.error || "Không thể thêm sản phẩm vào giỏ hàng");
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  const handlePreview = () => {
    // TODO: Implement preview logic
    toast.info("Chức năng xem trước đang được phát triển");
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
        <BuyNowButton 
          product={{
            id: product.id,
            title: product.title,
            price: product.price,
          }}
          className="w-full text-lg font-semibold"
          size="lg"
        />
        
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant={isInCart ? "default" : "outline"}
            size="lg"
            onClick={handleAddToCart}
            disabled={isInCart}
            className="col-span-2"
          >
            {isInCart ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Đã Thêm Vào Giỏ
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Thêm Giỏ Hàng
              </>
            )}
          </Button>
          
          <SimpleShareMenu 
            productId={product.id} 
            productTitle={product.title}
          >
            <Button 
              variant="outline" 
              size="lg"
              className="w-full"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </SimpleShareMenu>
        </div>
        
        <Button 
          variant="outline" 
          size="lg"
          onClick={handlePreview}
          className="w-full"
        >
          <Eye className="h-4 w-4 mr-2" />
          Xem Trước
        </Button>
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
