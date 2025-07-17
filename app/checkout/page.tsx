"use client";

import { useState } from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CreditCard, 
  Package, 
  Shield, 
  Download, 
  Clock,
  CheckCircle,
  ArrowLeft,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock data - trong thực tế sẽ lấy từ cart state
const mockItems = [
  {
    id: "1",
    title: "E-commerce Website Complete",
    price: 499000,
    technologies: ["React", "NextJS", "Prisma", "Stripe"],
    category: "E-commerce"
  },
  {
    id: "2", 
    title: "Social Media App",
    price: 799000,
    technologies: ["React", "NextJS", "Socket.io", "MongoDB"],
    category: "Social Media"
  }
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  const subtotal = mockItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handlePayment = async () => {
    if (!agreedToTerms) {
      alert("Vui lòng đồng ý với điều khoản sử dụng");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      router.push('/checkout/success');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Link href="/cart">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại giỏ hàng
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border" />
                <div>
                  <h1 className="text-3xl font-bold">Thanh toán</h1>
                  <p className="text-muted-foreground">
                    Hoàn tất đơn hàng để tải xuống source code
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Payment Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin khách hàng</CardTitle>
                    <CardDescription>
                      Thông tin này sẽ được sử dụng để gửi hóa đơn và hỗ trợ
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Họ</Label>
                        <Input id="firstName" placeholder="Nguyễn" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Tên</Label>
                        <Input id="lastName" placeholder="Văn A" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="example@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input id="phone" placeholder="0123456789" />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Phương thức thanh toán</CardTitle>
                    <CardDescription>
                      Chọn phương thức thanh toán phù hợp
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                          <CreditCard className="h-4 w-4" />
                          Thẻ tín dụng / Thẻ ghi nợ
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="banking" id="banking" />
                        <Label htmlFor="banking" className="flex items-center gap-2 cursor-pointer">
                          <Wallet className="h-4 w-4" />
                          Chuyển khoản ngân hàng
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "card" && (
                      <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Số thẻ</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Ngày hết hạn</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "banking" && (
                      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Thông tin chuyển khoản</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Ngân hàng:</strong> Vietcombank</p>
                          <p><strong>Số tài khoản:</strong> 1234567890</p>
                          <p><strong>Chủ tài khoản:</strong> CONG TY TNHH ABC</p>
                          <p><strong>Nội dung:</strong> Thanh toan don hang [Mã đơn hàng]</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Terms */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Đồng ý với điều khoản sử dụng
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Bằng cách thanh toán, bạn đồng ý với{" "}
                          <Link href="/terms" className="underline">
                            điều khoản sử dụng
                          </Link>{" "}
                          và{" "}
                          <Link href="/privacy" className="underline">
                            chính sách bảo mật
                          </Link>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Tóm tắt đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="space-y-4">
                      {mockItems.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            </div>
                            <p className="font-bold text-primary mt-1">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tạm tính ({mockItems.length} source code)</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Thuế VAT (10%)</span>
                        <span>{formatCurrency(tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Tổng cộng</span>
                        <span className="text-primary">{formatCurrency(total)}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handlePayment} 
                      className="w-full" 
                      size="lg"
                      disabled={isProcessing || !agreedToTerms}
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Thanh toán {formatCurrency(total)}
                        </>
                      )}
                    </Button>

                    {/* Benefits */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>Bảo hành 6 tháng</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Download className="h-4 w-4 text-blue-600" />
                        <span>Tải xuống ngay lập tức</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-purple-600" />
                        <span>Cập nhật miễn phí</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 