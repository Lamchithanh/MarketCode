import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AboutCTA() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Sẵn sàng bắt đầu dự án tiếp theo?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Hãy để CodeMarket giúp bạn tiết kiệm thời gian và tăng hiệu quả phát triển với các source code chất lượng cao
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">
                Khám phá sản phẩm
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                Liên hệ với chúng tôi
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 