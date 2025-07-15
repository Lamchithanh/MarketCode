import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { Testimonial } from "@/types";

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    role: "Sinh viên CNTT",
    company: "ĐH Bách Khoa",
    content:
      "Source code từ CodeMarket giúp tôi hoàn thành đồ án tốt nghiệp xuất sắc. Code clean, documentation chi tiết và hỗ trợ tận tình.",
    avatar: "",
    rating: 5,
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    role: "Frontend Developer",
    company: "FPT Software",
    content:
      "Chất lượng code rất tốt, tuân thủ best practices. Đội ngũ support phản hồi nhanh và chuyên nghiệp. Tôi sẽ tiếp tục sử dụng dịch vụ.",
    avatar: "",
    rating: 5,
  },
  {
    id: "3",
    name: "Lê Minh Cường",
    role: "Tech Lead",
    company: "Viettel Digital",
    content:
      "Dịch vụ tuyệt vời! Source code NextJS họ cung cấp giúp team tôi tiết kiệm được rất nhiều thời gian phát triển. Highly recommended!",
    avatar: "",
    rating: 5,
  },
  {
    id: "4",
    name: "Phạm Thu Hà",
    role: "Full-stack Developer",
    company: "Shopee",
    content:
      "Tôi đã mua nhiều source code từ CodeMarket. Mỗi lần đều hài lòng về chất lượng và dịch vụ hỗ trợ. Giá cả hợp lý, chất lượng cao.",
    avatar: "",
    rating: 5,
  },
  {
    id: "5",
    name: "Hoàng Đức Minh",
    role: "Startup Founder",
    company: "TechViet",
    content:
      "CodeMarket đã giúp startup của tôi launch sản phẩm nhanh chóng. Source code chất lượng, documentation đầy đủ, support tốt.",
    avatar: "",
    rating: 5,
  },
  {
    id: "6",
    name: "Vũ Thị Lan",
    role: "Software Engineer",
    company: "Zalo",
    content:
      "Rất ấn tượng với chất lượng code và cách tổ chức project. Đây là nơi tôi tin tưởng để tìm kiếm source code cho các dự án cá nhân.",
    avatar: "",
    rating: 5,
  },
];

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
      }`}
    />
  ));
};

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Khách hàng nói gì
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Được tin tưởng bởi hàng ngàn developer
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Hơn 10,000 khách hàng đã tin tưởng và sử dụng dịch vụ của chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="relative group hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>

                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                  <p className="text-sm leading-relaxed text-muted-foreground pl-6">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">5.0</div>
              <div className="flex justify-center mb-2">{renderStars(5)}</div>
              <div className="text-sm text-muted-foreground">
                Đánh giá trung bình
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">10,000+</div>
              <div className="text-sm text-muted-foreground">
                Khách hàng hài lòng
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">99%</div>
              <div className="text-sm text-muted-foreground">
                Tỷ lệ hài lòng
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">
                Hỗ trợ khách hàng
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
