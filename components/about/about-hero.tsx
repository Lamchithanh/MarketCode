import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code } from "lucide-react";
import Link from "next/link";

export function AboutHero() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6">
            <Code className="h-4 w-4 mr-2" />
            Về chúng tôi
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Chúng tôi là{" "}
            <span className="text-primary">CodeMarket</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Marketplace source code React/NextJS chuyên nghiệp, giúp các nhà phát triển tiết kiệm thời gian và tăng hiệu quả làm việc
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">
                Khám phá sản phẩm
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