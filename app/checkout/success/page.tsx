import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Package, 
  ArrowRight,
  Clock,
  Shield
} from "lucide-react";
import Link from "next/link";

// Mock data - trong thực tế sẽ lấy từ order
const orderData = {
  id: "ORD-2024-001",
  date: "2024-01-20",
  total: 1428000,
  items: [
    {
      id: "1",
      title: "E-commerce Website Complete",
      price: 499000,
      category: "E-commerce",
      downloadUrl: "/downloads/ecommerce-complete.zip"
    },
    {
      id: "2",
      title: "Social Media App",
      price: 799000,
      category: "Social Media",
      downloadUrl: "/downloads/social-media-app.zip"
    }
  ]
};

export default function CheckoutSuccessPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Thanh toán thành công!</h1>
              <p className="text-lg text-muted-foreground mb-4">
                Cảm ơn bạn đã mua source code từ chúng tôi
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>Mã đơn hàng: <strong>{orderData.id}</strong></span>
                <span>•</span>
                <span>Ngày: {new Date(orderData.date).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            {/* Order Details */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Chi tiết đơn hàng</h2>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Hoàn thành
                  </Badge>
                </div>

                <div className="space-y-4">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Tải xuống
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tổng cộng:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(orderData.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Download className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Tải xuống source code</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Bạn có thể tải xuống source code ngay bây giờ hoặc bất cứ lúc nào từ trang đơn hàng
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/profile?tab=orders">
                          Xem đơn hàng
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Email xác nhận</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Chúng tôi đã gửi email xác nhận đơn hàng và hướng dẫn sử dụng đến email của bạn
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/contact">
                          Liên hệ hỗ trợ
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Support Info */}
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <Shield className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold mb-1">Bảo hành 6 tháng</h4>
                    <p className="text-sm text-muted-foreground">
                      Hỗ trợ kỹ thuật và sửa lỗi miễn phí
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Clock className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold mb-1">Hỗ trợ 24/7</h4>
                    <p className="text-sm text-muted-foreground">
                      Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Download className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold mb-1">Cập nhật miễn phí</h4>
                    <p className="text-sm text-muted-foreground">
                      Nhận cập nhật và tính năng mới miễn phí
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" asChild>
                <Link href="/profile?tab=orders" className="gap-2">
                  Xem đơn hàng của tôi
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/products">
                  Tiếp tục mua sắm
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 