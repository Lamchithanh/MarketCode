import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";

export function ContactHero() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6">
            <Mail className="h-4 w-4 mr-2" />
            Liên hệ
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Hãy kết nối với{" "}
            <span className="text-primary">chúng tôi</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Có câu hỏi về sản phẩm? Cần tư vấn dự án? Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
          </p>
        </div>
      </div>
    </section>
  );
} 