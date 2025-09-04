"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, Loader2, RefreshCw } from "lucide-react";
import { useTestimonials } from "@/hooks/use-testimonials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ServiceTestimonials() {
  const { testimonials, stats, loading, error, refresh } = useTestimonials({
    limit: 6,
    featured: false // Get all published testimonials, not just featured ones
  });

  // Loading state
  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Khách hàng nói gì về chúng tôi?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Đang tải testimonials...
            </p>
          </div>
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Đang tải...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Khách hàng nói gì về chúng tôi?
            </h2>
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Có lỗi khi tải testimonials: {error}</p>
              <Button onClick={refresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No testimonials state
  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Khách hàng nói gì về chúng tôi?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Chưa có testimonials nào được công bố
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Khách hàng nói gì về chúng tôi?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {stats.total}+ khách hàng đã tin tưởng và hài lòng với chất lượng dịch vụ của chúng tôi
          </p>
          
          {/* Stats Display */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
              {stats.average_rating}/5.0 điểm trung bình
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              {stats.five_star_count} đánh giá 5 sao
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              {stats.total} khách hàng đã đánh giá
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full hover:shadow-lg transition-shadow duration-300 relative">
              {testimonial.is_featured && (
                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white">
                  Nổi bật
                </Badge>
              )}
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-6 w-6 text-primary mr-2" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage 
                      src={testimonial.avatar || "/api/placeholder/40/40"} 
                      alt={testimonial.name} 
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} tại {testimonial.company}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(testimonial.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-primary/5 rounded-lg p-8 max-w-4xl mx-auto border">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Bạn cũng muốn có trải nghiệm tương tự?
            </h3>
            <p className="text-muted-foreground mb-6">
              Hãy để chúng tôi giúp bạn biến ý tưởng thành hiện thực với chất lượng dịch vụ tốt nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors">
                Bắt đầu dự án ngay
              </button>
              <button className="border border-primary text-primary hover:bg-primary/10 px-8 py-3 rounded-lg font-medium transition-colors">
                Xem thêm case studies
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 