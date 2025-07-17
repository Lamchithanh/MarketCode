"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Wrench, Users } from "lucide-react";

export function ServiceHero() {
  const scrollToPackages = () => {
    const element = document.getElementById("service-packages");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Dịch vụ phát triển web
            <span className="block text-primary">chuyên nghiệp</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Từ ý tưởng đến sản phẩm hoàn thiện. Chúng tôi cung cấp giải pháp web toàn diện 
            với chất lượng cao và hiệu suất tối ưu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={scrollToPackages}
              className="px-8 py-3"
            >
              Xem gói dịch vụ
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-3"
            >
              Tư vấn miễn phí
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-card rounded-lg shadow-lg border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Phát triển từ đầu
            </h3>
            <p className="text-muted-foreground">
              Xây dựng website/ứng dụng web hoàn chỉnh từ ý tưởng ban đầu
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg shadow-lg border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Bảo trì & Nâng cấp
            </h3>
            <p className="text-muted-foreground">
              Duy trì và cải thiện hiệu suất website hiện có
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg shadow-lg border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Tư vấn chuyên nghiệp
            </h3>
            <p className="text-muted-foreground">
              Hỗ trợ kỹ thuật và tư vấn giải pháp tối ưu
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 