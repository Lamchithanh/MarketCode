"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClientEmailSupport } from "@/components/ui/client-email-support";
import { 
  FileText, 
  Zap, 
  Star, 
  Headphones,
  Check,
  ThumbsUp,
  ThumbsDown,
  User,
  MessageSquare
} from "lucide-react";

interface ProductTabsProps {
  product: {
    id: string;
    title: string;
    description?: string;
    features?: {
      core?: string[];
      technical?: string[];
      ui?: string[];
    } | null; // JSONB from database
  };
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    isHelpful: boolean;
    createdAt: string;
    user?: {
      name: string;
      avatar?: string;
    };
  }>;
  userHasPurchased: boolean;
}

export function ProductTabs({ product, reviews = [], userHasPurchased }: ProductTabsProps) {
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});

  const toggleHelpful = (reviewId: string) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100 
      : 0
  }));

  // Parse features from database JSONB - Handle both object and array cases
  const featuresData = product.features ? 
    (typeof product.features === 'string' 
      ? JSON.parse(product.features) 
      : product.features
    ) : null;

  // Ensure arrays contain only strings, not objects
  const safeFeatures = featuresData ? {
    core: Array.isArray(featuresData.core) 
      ? featuresData.core.filter((item: unknown) => typeof item === 'string')
      : [],
    technical: Array.isArray(featuresData.technical) 
      ? featuresData.technical.filter((item: unknown) => typeof item === 'string')
      : [],
    ui: Array.isArray(featuresData.ui) 
      ? featuresData.ui.filter((item: unknown) => typeof item === 'string')
      : []
  } : null;

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Tổng quan
        </TabsTrigger>
        <TabsTrigger value="features" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Tính năng
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          Đánh giá ({reviews.length})
        </TabsTrigger>
        <TabsTrigger value="support" className="flex items-center gap-2">
          <Headphones className="h-4 w-4" />
          Hỗ trợ
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Giới thiệu sản phẩm</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Thông tin chi tiết:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loại sản phẩm:</span>
                    <span>Source Code</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngôn ngữ:</span>
                    <span>JavaScript, TypeScript</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Framework:</span>
                    <span>Next.js, React</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database:</span>
                    <span>Supabase, PostgreSQL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">UI Library:</span>
                    <span>Tailwind CSS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Responsive:</span>
                    <span>✅ Mobile Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="features" className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Tính năng nổi bật</h3>
            
            {safeFeatures ? (
              <div className="space-y-6">
                {/* Core Features */}
                {safeFeatures.core && safeFeatures.core.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-primary">Tính năng cốt lõi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {safeFeatures.core.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Features */}
                {safeFeatures.technical && safeFeatures.technical.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-primary">Kỹ thuật</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {safeFeatures.technical.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-blue-600 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* UI Features */}
                {safeFeatures.ui && safeFeatures.ui.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-primary">Giao diện</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {safeFeatures.ui.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-purple-600 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Responsive Design - Tương thích mọi thiết bị",
                  "Modern UI/UX - Giao diện hiện đại, thân thiện",
                  "Fast Loading - Tối ưu hiệu suất cao",
                  "SEO Friendly - Tối ưu cho công cụ tìm kiếm",
                  "Cross Browser - Hỗ trợ đa trình duyệt",
                  "Clean Code - Code sạch, dễ maintain",
                  "Documentation - Tài liệu hướng dẫn đầy đủ",
                  "Free Updates - Cập nhật miễn phí"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reviews" className="space-y-6">
        {!userHasPurchased && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">Chỉ khách hàng đã mua sản phẩm mới có thể đánh giá</span>
              </div>
            </CardContent>
          </Card>
        )}

        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Chưa có đánh giá nào</h3>
              <p className="text-muted-foreground">
                Hãy là người đầu tiên đánh giá sản phẩm này!
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Rating Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dựa trên {reviews.length} đánh giá
                    </p>
                  </div>

                  <div className="space-y-2">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm w-8">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {review.user?.name || "Khách hàng"}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Đã mua
                      </Badge>
                    </div>
                    
                    <p className="text-sm leading-relaxed mb-4">
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Đánh giá này có hữu ích?
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleHelpful(review.id)}
                        className={`h-7 px-2 ${
                          helpfulVotes[review.id] ? 'text-green-600' : ''
                        }`}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Có
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        Không
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </TabsContent>

      <TabsContent value="support" className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Hỗ trợ khách hàng</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-primary">Kênh hỗ trợ</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Live Chat</div>
                      <div className="text-xs text-muted-foreground">
                        24/7 - Phản hồi trong 5 phút
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Headphones className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Email Support</div>
                      <div className="text-xs text-muted-foreground">
                        <ClientEmailSupport />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
  <h4 className="font-semibold text-primary">Bạn nhận được</h4>
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Check className="h-4 w-4 text-green-600" />
      <span className="text-sm">Cập nhật miễn phí trong thời gian đầu</span>
    </div>
    <div className="flex items-center gap-2">
      <Check className="h-4 w-4 text-green-600" />
      <span className="text-sm">Hỗ trợ xử lý lỗi cơ bản</span>
    </div>
    <div className="flex items-center gap-2">
      <Check className="h-4 w-4 text-green-600" />
      <span className="text-sm">Hướng dẫn cài đặt chi tiết</span>
    </div>
    <div className="flex items-center gap-2">
      <Check className="h-4 w-4 text-green-600" />
      <span className="text-sm">Tài liệu và ví dụ đi kèm</span>
    </div>
  </div>
</div>

            </div>

            <Separator className="my-6" />

            <div>
              <h4 className="font-semibold text-primary mb-3">FAQ - Câu hỏi thường gặp</h4>
              <div className="space-y-3">
                <details className="p-3 border rounded-lg">
                  <summary className="font-medium cursor-pointer">
                    Tôi có được cập nhật miễn phí không?
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2">
                    Có, bạn sẽ được cập nhật miễn phí trọn đời cho sản phẩm này.
                  </p>
                </details>
                
                <details className="p-3 border rounded-lg">
                  <summary className="font-medium cursor-pointer">
                    Tôi có thể sử dụng cho dự án thương mại?
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2">
                    Có, bạn có thể sử dụng cho dự án cá nhân và thương mại.
                  </p>
                </details>
                
                <details className="p-3 border rounded-lg">
                  <summary className="font-medium cursor-pointer">
                    Nếu gặp lỗi thì được hỗ trợ như thế nào?
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2">
                    Chúng tôi hỗ trợ 24/7 qua live chat và email. Cam kết fix lỗi trong 24h.
                  </p>
                </details>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
