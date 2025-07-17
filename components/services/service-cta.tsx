"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

export function ServiceCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Sẵn sàng bắt đầu dự án của bạn?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Hãy liên hệ với chúng tôi ngay hôm nay để nhận tư vấn miễn phí và báo giá chi tiết cho dự án của bạn.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="px-8 py-3" asChild>
            <Link href="/contact?subject=service&type=consultation">
              <MessageCircle className="mr-2 h-5 w-5" />
              Tư vấn miễn phí ngay
            </Link>
          </Button>
          
          <Button size="lg" variant="outline" className="px-8 py-3" asChild>
            <Link href="/contact?subject=service&type=quote">
              Yêu cầu báo giá
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-2xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Hỗ trợ khách hàng</div>
          </div>
          <div className="p-6">
            <div className="text-2xl font-bold text-primary mb-2">2 giờ</div>
            <div className="text-sm text-muted-foreground">Thời gian phản hồi</div>
          </div>
          <div className="p-6">
            <div className="text-2xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Cam kết chất lượng</div>
          </div>
        </div>
      </div>
    </section>
  );
} 