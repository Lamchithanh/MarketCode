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
  Loader2,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useServices } from "@/hooks/use-services";

// Icon mapping for services
const iconMap: Record<string, React.ReactNode> = {
  'code': <Code className="h-6 w-6" />,
  'settings': <Settings className="h-6 w-6" />,
  'palette': <Palette className="h-6 w-6" />,
  'database': <Database className="h-6 w-6" />,
  'shield': <Shield className="h-6 w-6" />,
  'zap': <Zap className="h-6 w-6" />,
  'users': <Users className="h-6 w-6" />,
  'default': <Code className="h-6 w-6" />
};

export function ServicePackages() {
  const { services, loading, error, refetch } = useServices();

  // Filter only active services and sort by display_order
  const activeServices = services
    .filter(service => service.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  // Loading state
  if (loading) {
    return (
      <section id="service-packages" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Các gói dịch vụ chuyên nghiệp
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Đang tải dịch vụ...
            </p>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Đang tải dịch vụ...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="service-packages" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Các gói dịch vụ chuyên nghiệp
            </h2>
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Có lỗi khi tải dịch vụ: {error}</p>
              <Button onClick={refetch} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No services state
  if (!activeServices || activeServices.length === 0) {
    return (
      <section id="service-packages" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Các gói dịch vụ chuyên nghiệp
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hiện tại chưa có dịch vụ nào được công bố
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="service-packages" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Các gói dịch vụ chuyên nghiệp
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Chúng tôi cung cấp {activeServices.length} gói dịch vụ chuyên nghiệp phù hợp với mọi nhu cầu và ngân sách
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service) => (
            <Card key={service.id} className={`relative h-full transition-all duration-300 hover:shadow-lg ${
              service.popular ? 'ring-2 ring-primary' : ''
            }`}>
              {service.popular && (
                <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground">
                  Phổ biến
                </Badge>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <div className="text-primary">
                      {iconMap[service.icon_name] || iconMap.default}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {service.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">{service.price_text}</div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration}
                  </div>
                </div>

                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 space-y-2">
                  <Button className="w-full" asChild>
                    <Link href={`/services/${service.slug}`}>
                      Xem chi tiết
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/contact?subject=service&type=consultation&package=${service.slug}`}>
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