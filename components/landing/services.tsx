import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import { Service } from "@/types";

const services: Service[] = [
  {
    id: "1",
    title: "E-commerce Website",
    description: "Source code website bán hàng hoàn chỉnh với React & NextJS",
    icon: "basic",
    price: "499,000đ",
    features: [
      "Frontend React/NextJS responsive",
      "Admin dashboard quản lý",
      "Tích hợp thanh toán",
      "Quản lý sản phẩm, đơn hàng",
      "Authentication & Authorization",
      "Database schema & API",
      "Documentation đầy đủ",
    ],
  },
  {
    id: "2",
    title: "Social Media App",
    description: "Mạng xã hội mini với tính năng đầy đủ",
    icon: "pro",
    price: "799,000đ",
    popular: true,
    features: [
      "Real-time chat & notifications",
      "Post, comment, like system",
      "User profiles & following",
      "Image/video upload",
      "Responsive design",
      "Modern UI/UX",
      "Clean code structure",
    ],
  },
  {
    id: "3",
    title: "Learning Management System",
    description: "Hệ thống quản lý học tập trực tuyến",
    icon: "thesis",
    price: "1,299,000đ",
    features: [
      "Student & Teacher portals",
      "Course management",
      "Assignment & grading",
      "Video streaming",
      "Progress tracking",
      "Certificate generation",
      "Phù hợp làm đồ án tốt nghiệp",
    ],
  },
];

export function Services() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Source Code chất lượng cao
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Khám phá các source code React/NextJS được xây dựng chuyên nghiệp,
            phù hợp cho mọi dự án từ cơ bản đến nâng cao
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card
              key={service.id}
              className={`relative group hover:shadow-xl transition-all duration-300 ${
                service.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Phổ biến nhất
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-base mb-4">
                  {service.description}
                </CardDescription>
                <div className="text-4xl font-bold text-primary mb-2">
                  {service.price}
                </div>
                <div className="text-sm text-muted-foreground">
                  Mua 1 lần, sử dụng mãi mãi
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full group-hover:bg-primary/90 transition-colors"
                  size="lg"
                >
                  Mua ngay
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Hỗ trợ cài đặt</h3>
                <p className="text-muted-foreground">
                  Hướng dẫn setup và deploy miễn phí
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Chúng tôi cung cấp hướng dẫn chi tiết và hỗ trợ cài đặt source
              code, giúp bạn chạy thành công dự án một cách nhanh chóng.
            </p>
            <Button variant="outline" className="w-full">
              Nhận hỗ trợ
            </Button>
          </Card>

          <Card className="p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  Source code theo yêu cầu
                </h3>
                <p className="text-muted-foreground">
                  Phát triển theo đặc tả riêng
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Bạn có ý tưởng riêng? Chúng tôi có thể phát triển source code theo
              yêu cầu cụ thể của bạn với chất lượng chuyên nghiệp và thời gian
              giao hàng nhanh chóng.
            </p>
            <Button variant="outline" className="w-full">
              Liên hệ báo giá
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}
