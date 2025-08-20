"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Download,
  ExternalLink 
} from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { toast } from 'sonner';

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  discountAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  items: {
    id: string;
    productTitle: string;
    productPrice: number;
    productId: string;
  }[];
  buyer: {
    name: string;
    email: string;
  };
}

const paymentMethodLabels: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  paypal: 'PayPal',
  stripe: 'Credit/Debit Card',
  momo: 'MoMo Wallet',
  zalopay: 'ZaloPay',
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.orderId as string;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !orderId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error('Order not found');
        }

        const data = await response.json();
        
        // Check if user is authorized to view this order
        if (data.buyerId !== user.id) {
          throw new Error('Unauthorized to view this order');
        }

        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && !userLoading) {
      fetchOrder();
    }
  }, [user, userLoading, orderId]);

  const handlePaymentSimulation = async () => {
    if (!order) return;

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: 'PAID',
          status: 'COMPLETED',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      toast.success('Payment successful! Order completed.');
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment failed. Please try again.');
    }
  };

  if (userLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/orders')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Button onClick={() => router.push('/orders')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (order.paymentStatus) {
      case 'PAID':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'FAILED':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    switch (order.paymentStatus) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Button 
                variant="outline" 
                onClick={() => router.push('/profile?tab=orders')}
                className="mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại đơn hàng
              </Button>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán đơn hàng</h1>
                <p className="text-gray-600">
                  Đơn hàng #{order.orderNumber}
                </p>
              </div>
            </div>

        {/* Order Status */}
        <Card className="mb-8 shadow-lg border-0 bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                {getStatusIcon()}
                Trạng thái thanh toán
              </CardTitle>
              <Badge className={getStatusColor() + " px-3 py-1 text-sm font-medium"}>
                {order.paymentStatus === 'PENDING' ? 'Chờ thanh toán' : 
                 order.paymentStatus === 'PAID' ? 'Đã thanh toán' : order.paymentStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {order.paymentStatus === 'PENDING' && (
              <Alert className="border-amber-200 bg-amber-50">
                <Clock className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Đơn hàng của bạn đang chờ thanh toán. Hoàn tất thanh toán để truy cập sản phẩm số của bạn.
                </AlertDescription>
              </Alert>
            )}
            {order.paymentStatus === 'PAID' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Thanh toán thành công! Bạn có thể tải xuống sản phẩm của mình ngay bây giờ.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-8 shadow-lg border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Chi tiết sản phẩm</CardTitle>
            <CardDescription className="text-gray-600">
              Đặt hàng ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{item.productTitle}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Tải xuống số
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">
                      {item.productPrice.toLocaleString('vi-VN')}đ
                    </p>
                    {order.paymentStatus === 'PAID' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 bg-primary text-white hover:bg-primary/90"
                        onClick={() => router.push(`/products/${item.productId}`)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Tải xuống
                      </Button>
                    )}
                  </div>
                </div>
              ))}

            <Separator className="my-6" />

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tạm tính:</span>
                <span>{(order.totalAmount + order.discountAmount).toLocaleString('vi-VN')}đ</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{order.discountAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-xl text-gray-900">
                <span>Tổng cộng:</span>
                <span className="text-primary">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mb-8 shadow-lg border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
              <CreditCard className="w-5 h-5 text-primary" />
              Phương thức thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">
                {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
              </span>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                {order.paymentMethod.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Payment Action */}
        {order.paymentStatus === 'PENDING' && (
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">Hoàn tất thanh toán</CardTitle>
              <CardDescription className="text-gray-600">
                Nhấp vào nút bên dưới để tiến hành thanh toán
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={handlePaymentSimulation}
                className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg"
                size="lg"
              >
                <CreditCard className="w-5 h-5 mr-3" />
                Thanh toán {order.totalAmount.toLocaleString('vi-VN')}đ với {paymentMethodLabels[order.paymentMethod]}
              </Button>
              <p className="text-sm text-gray-500 mt-3 text-center">
                Đây là thanh toán demo. Trong thực tế, bạn sẽ được chuyển hướng đến cổng thanh toán.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Success Actions */}
        {order.paymentStatus === 'PAID' && (
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Thanh toán thành công!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Cảm ơn bạn đã mua hàng. Bạn có thể truy cập sản phẩm của mình ngay bây giờ.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => router.push('/profile?tab=downloads')}
                    className="bg-primary hover:bg-primary/90 shadow-lg"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Xem tải xuống
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/products')}
                    size="lg"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Khám phá thêm sản phẩm
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
