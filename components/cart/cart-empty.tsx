import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

interface CartEmptyProps {
  supportEmail?: string;
}

export function CartEmpty({ supportEmail }: CartEmptyProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-12 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các source code chất lượng cao của chúng tôi.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/products">
              Khám phá sản phẩm
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          
          {supportEmail && (
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <a href={`mailto:${supportEmail}`}>
                <Mail className="h-4 w-4" />
                Liên hệ hỗ trợ
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 