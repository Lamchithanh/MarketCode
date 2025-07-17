import { Button } from "@/components/ui/button";
import { ArrowRight, Code, MessageCircle } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 mb-8">
            <Code className="h-8 w-8" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
            Sẵn sàng bắt đầu dự án của bạn?
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/90 mb-8">
            Hãy để chúng tôi giúp bạn tiết kiệm thời gian và tạo ra những sản
            phẩm tuyệt vời. Khám phá hàng ngàn source code chất lượng cao ngay
            hôm nay!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              asChild
            >
              <Link href="/products">
                <Code className="mr-2 h-5 w-5" />
                Khám phá source code
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="default"
              className="text-lg px-8 py-6 border-primary-foreground/30"
              asChild
            >
              <Link href="/contact">
                <MessageCircle className="mr-2 h-5 w-5" />
                Tư vấn miễn phí
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Miễn phí</div>
              <div className="text-sm text-primary-foreground/80">
                Tư vấn và hỗ trợ
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">24/7</div>
              <div className="text-sm text-primary-foreground/80">
                Hỗ trợ kỹ thuật
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">100%</div>
              <div className="text-sm text-primary-foreground/80">
                Đảm bảo chất lượng
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
