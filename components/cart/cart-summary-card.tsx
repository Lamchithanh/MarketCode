"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Shield, 
  CreditCard, 
  Mail,
  Phone,
  CheckCircle
} from "lucide-react";
import { useCartSettings } from "@/hooks/use-cart-settings";

interface CartSummaryCardProps {
  subtotal: number;
  itemCount: number;
  onCheckout: () => void;
}

export function CartSummaryCard({ 
  subtotal, 
  itemCount, 
  onCheckout
}: CartSummaryCardProps) {
  const { settings, loading } = useCartSettings();
  
  // Calculate tax and total based on database VAT rate
  const tax = (subtotal * settings.vatRate) / 100;
  const total = subtotal + tax;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Tóm tắt đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Item Count */}
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              Số lượng sản phẩm:
            </span>
            <Badge variant="secondary">
              {itemCount} items
            </Badge>
          </div>
          
          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>VAT ({settings.vatRate}%):</span>
              <span>{formatPrice(tax)}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Tổng cộng:</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full mt-6"
            onClick={onCheckout}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Tiến hành thanh toán
          </Button>
        </CardContent>
      </Card>

      {/* Security & Support Info */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              Cam kết bảo mật
            </h4>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span>Thanh toán an toàn với mã hóa SSL 256-bit</span>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span>Đảm bảo hoàn tiền 100% nếu không hài lòng</span>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span>Hỗ trợ cập nhật thời gian đầu</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Cần hỗ trợ?</h5>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span>{settings.supportEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>{settings.supportPhone} ({settings.supportHours})</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
