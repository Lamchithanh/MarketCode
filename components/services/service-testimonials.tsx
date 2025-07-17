"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  service: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    role: "CEO",
    company: "TechStart Vietnam",
    content: "Đội ngũ CodeMarket đã giúp chúng tôi xây dựng hệ thống e-commerce hoàn chỉnh trong vòng 6 tuần. Code chất lượng cao, giao diện đẹp và hỗ trợ nhiệt tình. Rất hài lòng với kết quả!",
    rating: 5,
    avatar: "/api/placeholder/40/40",
    service: "Phát triển dự án theo yêu cầu"
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    role: "Product Manager",
    company: "Digital Solutions",
    content: "Dịch vụ bảo trì website của CodeMarket rất chuyên nghiệp. Họ luôn phản hồi nhanh chóng khi có vấn đề và thường xuyên cập nhật bảo mật. Giá cả hợp lý, chất lượng tốt.",
    rating: 5,
    avatar: "/api/placeholder/40/40",
    service: "Bảo trì & Hỗ trợ"
  },
  {
    id: "3",
    name: "Lê Minh Cường",
    role: "Founder",
    company: "EduTech Pro",
    content: "Tôi đã thuê CodeMarket thiết kế lại giao diện cho platform học online. Thiết kế rất hiện đại, UX/UI tuyệt vời và tăng conversion rate lên 40%. Definitely recommended!",
    rating: 5,
    avatar: "/api/placeholder/40/40",
    service: "Thiết kế lại giao diện"
  },
  {
    id: "4",
    name: "Phạm Thanh Hà",
    role: "CTO",
    company: "InnovateLab",
    content: "Dịch vụ tư vấn kỹ thuật của CodeMarket giúp team mình cải thiện architecture và performance đáng kể. Kiến thức sâu rộng, tư vấn chính xác và practical.",
    rating: 5,
    avatar: "/api/placeholder/40/40",
    service: "Tư vấn kỹ thuật"
  },
  {
    id: "5",
    name: "Hoàng Đức Minh",
    role: "Business Owner",
    company: "SmartRetail",
    content: "CodeMarket đã customize lại hệ thống POS cho chuỗi cửa hàng của tôi. Công việc được thực hiện nhanh chóng, chính xác và phù hợp với nhu cầu kinh doanh. Tuyệt vời!",
    rating: 5,
    avatar: "/api/placeholder/40/40",
    service: "Chỉnh sửa dự án có sẵn"
  },
  {
    id: "6",
    name: "Vũ Thị Lan",
    role: "Marketing Director",
    company: "GrowthHub",
    content: "Website của chúng tôi được tối ưu hiệu suất bởi CodeMarket. Tốc độ tải trang cải thiện 60%, SEO ranking tăng rõ rệt. Đầu tư xứng đáng cho long-term growth!",
    rating: 5,
    avatar: "/api/placeholder/40/40",
    service: "Tối ưu hiệu suất"
  }
];

export function ServiceTestimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Khách hàng nói gì về chúng tôi?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hơn 100+ khách hàng đã tin tưởng và hài lòng với chất lượng dịch vụ của chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full hover:shadow-lg transition-shadow duration-300">
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
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} tại {testimonial.company}
                    </div>
                    <div className="text-xs text-primary mt-1 font-medium">
                      Dịch vụ: {testimonial.service}
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