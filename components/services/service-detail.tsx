"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Clock,
  ArrowRight,
  Star,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { ServiceOrderForm } from "./service-order-form";

interface ServiceDetailProps {
  slug: string;
}

interface ServiceData {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  icon: React.ReactNode;
  category: string;
  detailedDescription: string;
  process: string[];
  deliverables: string[];
  technologies: string[];
  benefits: string[];
}

const serviceData: Record<string, ServiceData> = {
  'custom-development': {
    id: 'custom-development',
    name: 'Phát triển dự án theo yêu cầu',
    description: 'Xây dựng website/ứng dụng web hoàn chỉnh từ ý tưởng của bạn',
    price: 'Từ 10,000,000 VNĐ',
    duration: '2-8 tuần',
    category: 'Phát triển',
    icon: <Code className="h-6 w-6" />,
    detailedDescription: 'Chúng tôi sẽ biến ý tưởng của bạn thành một website/ứng dụng web hoàn chỉnh với thiết kế hiện đại và tính năng mạnh mẽ. Từ việc phân tích yêu cầu đến triển khai và bảo trì, chúng tôi đồng hành cùng bạn trong suốt quá trình phát triển.',
    features: [
      'Phân tích yêu cầu chi tiết',
      'Thiết kế UI/UX chuyên nghiệp',
      'Lập trình frontend & backend',
      'Tích hợp database',
      'Responsive design',
      'SEO optimization',
      'Testing & deployment',
      'Hỗ trợ 3 tháng miễn phí'
    ],
    process: [
      'Tư vấn và phân tích yêu cầu',
      'Thiết kế mockup và wireframe',
      'Phát triển frontend',
      'Phát triển backend và database',
      'Tích hợp và testing',
      'Triển khai và go-live'
    ],
    deliverables: [
      'Source code hoàn chỉnh',
      'Tài liệu kỹ thuật',
      'Hướng dẫn sử dụng',
      'File thiết kế (PSD/Figma)',
      'Database schema',
      'Hosting setup'
    ],
    technologies: ['React/Next.js', 'Node.js', 'PostgreSQL', 'TypeScript', 'Tailwind CSS'],
    benefits: [
      'Giải pháp tùy chỉnh 100%',
      'Thiết kế độc quyền',
      'Hiệu suất cao',
      'Bảo mật tối ưu',
      'Dễ dàng mở rộng'
    ]
  },
  'project-customization': {
    id: 'project-customization',
    name: 'Chỉnh sửa dự án có sẵn',
    description: 'Tùy chỉnh và mở rộng chức năng cho website/ứng dụng hiện tại',
    price: 'Từ 2,000,000 VNĐ',
    duration: '1-3 tuần',
    category: 'Tùy chỉnh',
    icon: <Settings className="h-6 w-6" />,
    detailedDescription: 'Nâng cấp và tùy chỉnh website/ứng dụng hiện tại của bạn với các tính năng mới, cải thiện hiệu suất và trải nghiệm người dùng. Chúng tôi làm việc với mọi loại công nghệ và framework.',
    features: [
      'Phân tích code hiện tại',
      'Thêm tính năng mới',
      'Tối ưu hiệu suất',
      'Sửa lỗi và bug',
      'Cập nhật giao diện',
      'Tích hợp API mới',
      'Backup & migration',
      'Hỗ trợ 1 tháng'
    ],
    process: [
      'Audit và phân tích code',
      'Lên kế hoạch tùy chỉnh',
      'Backup dữ liệu',
      'Phát triển tính năng mới',
      'Testing và debug',
      'Triển khai cập nhật'
    ],
    deliverables: [
      'Code đã được cập nhật',
      'Changelog chi tiết',
      'Tài liệu tính năng mới',
      'Backup files',
      'Testing report'
    ],
    technologies: ['PHP', 'WordPress', 'Laravel', 'React', 'Vue.js', 'Angular'],
    benefits: [
      'Tiết kiệm chi phí',
      'Thời gian triển khai nhanh',
      'Giữ nguyên dữ liệu',
      'Cải thiện hiệu suất',
      'Mở rộng tính năng'
    ]
  },
  'maintenance': {
    id: 'maintenance',
    name: 'Bảo trì & Hỗ trợ',
    description: 'Duy trì và cập nhật website định kỳ, hỗ trợ kỹ thuật 24/7',
    price: 'Từ 1,500,000 VNĐ/tháng',
    duration: 'Theo tháng',
    category: 'Bảo trì',
    icon: <Shield className="h-6 w-6" />,
    detailedDescription: 'Dịch vụ bảo trì toàn diện để đảm bảo website của bạn luôn hoạt động ổn định, bảo mật và được cập nhật thường xuyên. Đội ngũ kỹ thuật sẵn sàng hỗ trợ 24/7.',
    features: [
      'Backup định kỳ',
      'Cập nhật bảo mật',
      'Giám sát hiệu suất',
      'Sửa lỗi khẩn cấp',
      'Cập nhật nội dung',
      'Báo cáo tháng',
      'Hỗ trợ 24/7',
      'Tư vấn kỹ thuật'
    ],
    process: [
      'Setup monitoring',
      'Backup tự động',
      'Kiểm tra bảo mật',
      'Cập nhật thường xuyên',
      'Báo cáo định kỳ',
      'Hỗ trợ khi cần'
    ],
    deliverables: [
      'Báo cáo tháng',
      'Backup files',
      'Security report',
      'Performance report',
      'Update log'
    ],
    technologies: ['Monitoring Tools', 'Security Scanner', 'Backup Systems', 'Analytics'],
    benefits: [
      'An tâm vận hành',
      'Bảo mật tối ưu',
      'Hiệu suất ổn định',
      'Hỗ trợ tức thì',
      'Tiết kiệm thời gian'
    ]
  },
  'ui-redesign': {
    id: 'ui-redesign',
    name: 'Thiết kế lại giao diện',
    description: 'Làm mới giao diện website với thiết kế hiện đại và trải nghiệm tốt hơn',
    price: 'Từ 5,000,000 VNĐ',
    duration: '2-4 tuần',
    category: 'Thiết kế',
    icon: <Palette className="h-6 w-6" />,
    detailedDescription: 'Nâng cấp giao diện website của bạn với thiết kế hiện đại, tối ưu trải nghiệm người dùng và tăng tỷ lệ chuyển đổi. Chúng tôi tập trung vào UX/UI và hiệu suất.',
    features: [
      'Phân tích UX hiện tại',
      'Thiết kế mockup mới',
      'Responsive design',
      'Tối ưu mobile',
      'Animations & transitions',
      'Accessibility support',
      'Cross-browser testing',
      'Hướng dẫn sử dụng'
    ],
    process: [
      'UX audit và research',
      'Thiết kế wireframe',
      'Tạo mockup chi tiết',
      'Frontend development',
      'Testing đa thiết bị',
      'Launch và optimize'
    ],
    deliverables: [
      'File thiết kế (Figma/PSD)',
      'Frontend code',
      'Style guide',
      'Component library',
      'Responsive testing report'
    ],
    technologies: ['Figma', 'Adobe XD', 'React', 'CSS3', 'SCSS', 'Tailwind CSS'],
    benefits: [
      'Giao diện hiện đại',
      'UX tối ưu',
      'Tăng conversion rate',
      'Mobile-friendly',
      'Dễ sử dụng'
    ]
  },
  'performance-optimization': {
    id: 'performance-optimization',
    name: 'Tối ưu hiệu suất',
    description: 'Cải thiện tốc độ tải trang và hiệu suất tổng thể của website',
    price: 'Từ 3,000,000 VNĐ',
    duration: '1-2 tuần',
    category: 'Tối ưu',
    icon: <Zap className="h-6 w-6" />,
    detailedDescription: 'Tăng tốc độ website của bạn với các kỹ thuật tối ưu hiện đại. Chúng tôi cải thiện từ frontend đến backend, database và server để đạt hiệu suất tối đa.',
    features: [
      'Phân tích hiệu suất',
      'Tối ưu database',
      'Minify & compress',
      'CDN integration',
      'Image optimization',
      'Caching strategy',
      'Code splitting',
      'Performance monitoring'
    ],
    process: [
      'Audit hiệu suất',
      'Xác định bottleneck',
      'Tối ưu frontend',
      'Tối ưu backend',
      'Setup caching',
      'Monitor và fine-tune'
    ],
    deliverables: [
      'Performance report',
      'Optimized code',
      'Caching setup',
      'CDN configuration',
      'Monitoring dashboard'
    ],
    technologies: ['Lighthouse', 'GTmetrix', 'Redis', 'CloudFlare', 'Webpack'],
    benefits: [
      'Tốc độ tải nhanh',
      'SEO tốt hơn',
      'UX cải thiện',
      'Tiết kiệm bandwidth',
      'Tăng conversion'
    ]
  },
  'consultation': {
    id: 'consultation',
    name: 'Tư vấn kỹ thuật',
    description: 'Hỗ trợ tư vấn kiến trúc, công nghệ và giải pháp phát triển',
    price: '500,000 VNĐ/giờ',
    duration: 'Linh hoạt',
    category: 'Tư vấn',
    icon: <Users className="h-6 w-6" />,
    detailedDescription: 'Nhận tư vấn chuyên sâu từ các chuyên gia có kinh nghiệm về kiến trúc hệ thống, lựa chọn công nghệ, và chiến lược phát triển phù hợp với dự án của bạn.',
    features: [
      'Tư vấn kiến trúc hệ thống',
      'Lựa chọn công nghệ',
      'Code review',
      'Đánh giá bảo mật',
      'Tối ưu workflow',
      'Training team',
      'Best practices',
      'Roadmap phát triển'
    ],
    process: [
      'Phân tích yêu cầu',
      'Đánh giá hiện trạng',
      'Đưa ra khuyến nghị',
      'Lập roadmap',
      'Hỗ trợ triển khai',
      'Follow-up và tư vấn'
    ],
    deliverables: [
      'Báo cáo tư vấn',
      'Architecture diagram',
      'Technology roadmap',
      'Best practices guide',
      'Action plan'
    ],
    technologies: ['System Design', 'Architecture Patterns', 'DevOps', 'Security'],
    benefits: [
      'Quyết định đúng đắn',
      'Tiết kiệm chi phí',
      'Tránh rủi ro',
      'Nâng cao kỹ năng',
      'Tối ưu quy trình'
    ]
  }
};

export function ServiceDetail({ slug }: ServiceDetailProps) {
  const service = serviceData[slug];
  
  if (!service) {
    return <div>Dịch vụ không tồn tại</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4">{service.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {service.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {service.detailedDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                <span>{service.price}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>{service.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Service Info */}
            <div className="space-y-8">
              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Tính năng bao gồm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Process */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-primary" />
                    Quy trình thực hiện
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {service.process.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Technologies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Công nghệ sử dụng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Form */}
            <div className="space-y-8">
              <ServiceOrderForm service={service} />
              
              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Lợi ích khi chọn chúng tôi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Deliverables */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Sản phẩm bàn giao
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.deliverables.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 