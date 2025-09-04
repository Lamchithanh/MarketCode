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
  Clock,
  ArrowRight,
  Star,
  CheckCircle,
  Loader2,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { ServiceOrderForm } from "./service-order-form";
import { useServiceDetail } from "@/hooks/use-service-detail";

interface ServiceDetailProps {
  slug: string;
}

// Icon mapping for services
const iconMap: Record<string, React.ReactNode> = {
  'code': <Code className="h-8 w-8" />,
  'settings': <Settings className="h-8 w-8" />,
  'palette': <Palette className="h-8 w-8" />,
  'database': <Database className="h-8 w-8" />,
  'shield': <Shield className="h-8 w-8" />,
  'zap': <Zap className="h-8 w-8" />,
  'users': <Users className="h-8 w-8" />,
  'default': <Code className="h-8 w-8" />
};

// Default process steps and deliverables for different service types
const getDefaultProcessSteps = (serviceType: string): string[] => {
  const processes: Record<string, string[]> = {
    'development': [
      'Tư vấn và phân tích yêu cầu chi tiết',
      'Thiết kế mockup và wireframe',
      'Phát triển frontend với React/Next.js',
      'Phát triển backend và database',
      'Tích hợp và testing toàn diện',
      'Triển khai và go-live'
    ],
    'customization': [
      'Phân tích code và hệ thống hiện tại',
      'Lập kế hoạch tùy chỉnh',
      'Backup và preparation',
      'Thực hiện các thay đổi',
      'Testing và quality assurance',
      'Deployment và handover'
    ],
    'maintenance': [
      'Setup monitoring system',
      'Thực hiện backup định kỳ',
      'Cập nhật bảo mật và patches',
      'Performance monitoring',
      'Bug fixes và improvements',
      'Monthly reporting'
    ],
    'default': [
      'Phân tích yêu cầu',
      'Lập kế hoạch thực hiện',
      'Triển khai giải pháp',
      'Testing và đánh giá',
      'Hoàn thiện và bàn giao'
    ]
  };

  return processes[serviceType] || processes.default;
};

const getDefaultDeliverables = (serviceType: string): string[] => {
  const deliverables: Record<string, string[]> = {
    'development': [
      'Source code hoàn chỉnh với documentation',
      'Tài liệu kỹ thuật chi tiết',
      'Hướng dẫn sử dụng và admin guide',
      'File thiết kế (Figma/PSD)',
      'Database schema và ERD',
      'Hosting setup và SSL certificate'
    ],
    'customization': [
      'Code đã được tùy chỉnh',
      'Backup files trước khi thay đổi',
      'Documentation các thay đổi',
      'Testing report',
      'User manual cập nhật'
    ],
    'maintenance': [
      'Báo cáo tình trạng hệ thống hàng tháng',
      'Backup files định kỳ',
      'Security audit report',
      'Performance optimization report',
      '24/7 support hotline'
    ],
    'default': [
      'Sản phẩm hoàn thiện',
      'Tài liệu hướng dẫn',
      'Source code (nếu có)',
      'Báo cáo kết quả',
      'Hỗ trợ sau bàn giao'
    ]
  };

  return deliverables[serviceType] || deliverables.default;
};

const getDefaultTechnologies = (serviceType: string): string[] => {
  const technologies: Record<string, string[]> = {
    'development': ['React/Next.js', 'Node.js', 'PostgreSQL', 'TypeScript', 'Tailwind CSS', 'Vercel/AWS'],
    'customization': ['Existing Stack', 'Modern Tools', 'Security Updates', 'Performance Tools'],
    'maintenance': ['Monitoring Tools', 'Backup Solutions', 'Security Scanners', 'Performance Analytics'],
    'default': ['Modern Technologies', 'Best Practices', 'Industry Standards']
  };

  return technologies[serviceType] || technologies.default;
};

const getDefaultBenefits = (category: string): string[] => {
  const benefits: Record<string, string[]> = {
    'Phát triển': [
      'Giải pháp tùy chỉnh 100%',
      'Thiết kế độc quyền',
      'Hiệu suất cao',
      'Bảo mật tối ưu',
      'Dễ dàng mở rộng'
    ],
    'Tùy chỉnh': [
      'Tiết kiệm chi phí',
      'Thời gian triển khai nhanh',
      'Tích hợp với hệ thống hiện tại',
      'Minimal downtime',
      'ROI cao'
    ],
    'Bảo trì': [
      'Uptime 99.9%',
      'Bảo mật 24/7',
      'Performance tối ưu',
      'Peace of mind',
      'Focus on business'
    ],
    'default': [
      'Chất lượng đảm bảo',
      'Hỗ trợ chuyên nghiệp',
      'Giá cả hợp lý',
      'Đúng tiến độ',
      'Satisfaction guarantee'
    ]
  };

  return benefits[category] || benefits.default;
};

export function ServiceDetail({ slug }: ServiceDetailProps) {
  const { service, loading, error, refetch } = useServiceDetail(slug);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải thông tin dịch vụ...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Có lỗi xảy ra</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="space-y-2">
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
            <Button asChild>
              <Link href="/services">
                Quay lại danh sách dịch vụ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Service not found
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Dịch vụ không tồn tại</h1>
          <p className="text-muted-foreground mb-6">
            Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button asChild>
            <Link href="/services">
              Quay lại danh sách dịch vụ
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Generate dynamic content based on service data
  const processSteps = getDefaultProcessSteps(service.service_type || 'default');
  const deliverables = getDefaultDeliverables(service.service_type || 'default');
  const technologies = getDefaultTechnologies(service.service_type || 'default');
  const benefits = getDefaultBenefits(service.category);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4">{service.category}</Badge>
            {service.popular && (
              <Badge variant="default" className="ml-2 mb-4 bg-yellow-500 text-white">
                Phổ biến
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {service.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {service.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <div className="text-primary">
                    {iconMap[service.icon_name] || iconMap.default}
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-primary">{service.price_text}</div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href={`#order-form`}>
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Đặt dịch vụ ngay
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact?subject=consultation">
                  Tư vấn miễn phí
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Tính năng bao gồm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-primary" />
                  Quy trình thực hiện
                </CardTitle>
                <CardDescription>
                  Chúng tôi tuân thủ quy trình chuyên nghiệp để đảm bảo chất lượng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">Bước {index + 1}</h4>
                        <p className="text-muted-foreground">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deliverables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Sản phẩm bàn giao
                </CardTitle>
                <CardDescription>
                  Những gì bạn sẽ nhận được khi hoàn thành dự án
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deliverables.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
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
                  {technologies.map((tech, index) => (
                    <Badge key={index} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Lợi ích của dịch vụ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Cần tư vấn?</CardTitle>
                <CardDescription>
                  Liên hệ với chúng tôi để được tư vấn chi tiết
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" asChild>
                  <Link href="/contact?subject=consultation">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Tư vấn miễn phí
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="tel:+84123456789">
                    Gọi ngay: 0123 456 789
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Form */}
        <div id="order-form" className="mt-16">
          <ServiceOrderForm 
            serviceName={service.name}
            serviceType={service.service_type}
            serviceId={service.id}
            servicePrice={service.price_text}
            serviceDuration={service.duration}
          />
        </div>
      </div>
    </div>
  );
}