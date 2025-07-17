import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ContactCTA() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Sẵn sàng bắt đầu dự án?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Đừng chần chừ nữa! Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về dự án của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">
                Xem sản phẩm
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">
                Dịch vụ của chúng tôi
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 