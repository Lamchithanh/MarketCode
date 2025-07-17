import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Star, Users, Download } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container relative py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-8">
            <Star className="mr-2 h-4 w-4" />
            Đánh giá 5 sao từ 1000+ khách hàng
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
            <span className="block">Source Code</span>
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              React & NextJS
            </span>
            <span className="block">Chất lượng cao</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
            Khám phá hàng ngàn source code React, NextJS và các công nghệ web
            hiện đại. Hỗ trợ đồ án, luận văn với giải pháp chuyên nghiệp và tư
            vấn 24/7.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/products">
                <Code className="mr-2 h-5 w-5" />
                Khám phá ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/contact">
                <Users className="mr-2 h-5 w-5" />
                Tư vấn miễn phí
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">
                Source code chất lượng
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">
                Khách hàng hài lòng
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">
                Hỗ trợ kỹ thuật
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-4 animate-bounce">
          <div className="rounded-lg bg-primary/20 p-3">
            <Code className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="absolute top-1/3 right-4 animate-bounce delay-150">
          <div className="rounded-lg bg-accent/20 p-3">
            <Download className="h-6 w-6 text-accent-foreground" />
          </div>
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-bounce delay-300">
          <div className="rounded-lg bg-secondary/20 p-3">
            <Star className="h-6 w-6 text-secondary-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
}
