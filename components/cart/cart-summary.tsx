import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, CreditCard, Shield, Download } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  onCheckout: () => void;
}

export function CartSummary({ subtotal, tax, total, itemCount, onCheckout }: CartSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <Card className="border-0 shadow-lg sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Tóm tắt đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Tạm tính ({itemCount} source code)</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Thuế VAT (10%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Tổng cộng</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
        
        <Button 
          onClick={onCheckout} 
          className="w-full gap-2" 
          size="lg"
          disabled={itemCount === 0}
        >
          <CreditCard className="h-4 w-4" />
          Thanh toán ngay
        </Button>
        
        {/* Source Code Benefits */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Bảo hành & hỗ trợ 6 tháng</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Download className="h-4 w-4 text-blue-600" />
            <span>Tải xuống ngay sau thanh toán</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4 text-purple-600" />
            <span>Thanh toán an toàn & bảo mật</span>
          </div>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          <p>Mua 1 lần • Sử dụng vĩnh viễn</p>
          <p>Hỗ trợ 24/7 • Cập nhật miễn phí</p>
        </div>
      </CardContent>
    </Card>
  );
} 