"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Code, 
  Settings, 
  Palette, 
  Database, 
  Shield, 
  Zap,
  Users,
  MessageSquare,
  Clock
} from "lucide-react";
import Link from "next/link";

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  category: string;
}

const servicePackages: ServicePackage[] = [
  {
    id: "custom-development",
    name: "Phát triển dự án theo yêu cầu",
    description: "Xây dựng website/ứng dụng web hoàn chỉnh từ ý tưởng của bạn",
    price: "Từ 10,000,000 VNĐ",
    duration: "2-8 tuần",
    category: "Phát triển",
    icon: <Code className="h-6 w-6" />,
    popular: true,
    features: [
      "Phân tích yêu cầu chi tiết",
      "Thiết kế UI/UX chuyên nghiệp",
      "Lập trình frontend & backend",
      "Tích hợp database",
      "Responsive design",
      "SEO optimization",
      "Testing & deployment",
      "Hỗ trợ 3 tháng miễn phí"
    ]
  },
  {
    id: "project-customization",
    name: "Chỉnh sửa dự án có sẵn",
    description: "Tùy chỉnh và mở rộng chức năng cho website/ứng dụng hiện tại",
    price: "Từ 2,000,000 VNĐ",
    duration: "1-3 tuần",
    category: "Tùy chỉnh",
    icon: <Settings className="h-6 w-6" />,
    features: [
      "Phân tích code hiện tại",
      "Thêm tính năng mới",
      "Tối ưu hiệu suất",
      "Sửa lỗi và bug",
      "Cập nhật giao diện",
      "Tích hợp API mới",
      "Backup & migration",
      "Hỗ trợ 1 tháng"
    ]
  },
  {
    id: "maintenance",
    name: "Bảo trì & Hỗ trợ",
    description: "Duy trì và cập nhật website định kỳ, hỗ trợ kỹ thuật 24/7",
    price: "Từ 1,500,000 VNĐ/tháng",
    duration: "Theo tháng",
    category: "Bảo trì",
    icon: <Shield className="h-6 w-6" />,
    features: [
      "Backup định kỳ",
      "Cập nhật bảo mật",
      "Giám sát hiệu suất",
      "Sửa lỗi khẩn cấp",
      "Cập nhật nội dung",
      "Báo cáo tháng",
      "Hỗ trợ 24/7",
      "Tư vấn kỹ thuật"
    ]
  },
  {
    id: "ui-redesign",
    name: "Thiết kế lại giao diện",
    description: "Làm mới giao diện website với thiết kế hiện đại và trải nghiệm tốt hơn",
    price: "Từ 5,000,000 VNĐ",
    duration: "2-4 tuần",
    category: "Thiết kế",
    icon: <Palette className="h-6 w-6" />,
    features: [
      "Phân tích UX hiện tại",
      "Thiết kế mockup mới",
      "Responsive design",
      "Tối ưu mobile",
      "Animations & transitions",
      "Accessibility support",
      "Cross-browser testing",
      "Hướng dẫn sử dụng"
    ]
  },
  {
    id: "performance-optimization",
    name: "Tối ưu hiệu suất",
    description: "Cải thiện tốc độ tải trang và hiệu suất tổng thể của website",
    price: "Từ 3,000,000 VNĐ",
    duration: "1-2 tuần",
    category: "Tối ưu",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "Phân tích hiệu suất",
      "Tối ưu database",
      "Minify & compress",
      "CDN integration",
      "Image optimization",
      "Caching strategy",
      "Code splitting",
      "Performance monitoring"
    ]
  },
  {
    id: "consultation",
    name: "Tư vấn kỹ thuật",
    description: "Hỗ trợ tư vấn kiến trúc, công nghệ và giải pháp phát triển",
    price: "500,000 VNĐ/giờ",
    duration: "Linh hoạt",
    category: "Tư vấn",
    icon: <Users className="h-6 w-6" />,
    features: [
      "Tư vấn kiến trúc hệ thống",
      "Lựa chọn công nghệ",
      "Code review",
      "Đánh giá bảo mật",
      "Tối ưu workflow",
      "Training team",
      "Best practices",
      "Roadmap phát triển"
    ]
  }
];

export function ServicePackages() {
  return (
    <section id="service-packages" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Các gói dịch vụ chuyên nghiệp
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Chúng tôi cung cấp đa dạng các gói dịch vụ phù hợp với mọi nhu cầu và ngân sách
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {servicePackages.map((pkg) => (
                <Card key={pkg.id} className={`relative h-full transition-all duration-300 hover:shadow-lg ${
                  pkg.popular ? 'ring-2 ring-primary' : ''
                }`}>
                  {pkg.popular && (
                    <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground">
                      Phổ biến
                    </Badge>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <div className="text-primary">{pkg.icon}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {pkg.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-semibold">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">{pkg.price}</div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {pkg.duration}
                      </div>
                    </div>

                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                                  <div className="pt-4 space-y-2">
                    <Button className="w-full" asChild>
                      <Link href={`/services/${pkg.id}`}>
                        Xem chi tiết
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/contact?subject=service&type=consultation&package=${pkg.id}`}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Tư vấn ngay
                      </Link>
                    </Button>
                  </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-primary/5 rounded-lg p-8 max-w-4xl mx-auto border">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Không tìm thấy gói phù hợp?
            </h3>
            <p className="text-muted-foreground mb-6">
              Chúng tôi có thể tạo gói dịch vụ tùy chỉnh phù hợp với nhu cầu cụ thể của bạn
            </p>
            <Button size="lg" asChild>
              <Link href="/contact?subject=service&type=custom">
                Liên hệ tư vấn miễn phí
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 