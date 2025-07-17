import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Trophy } from "lucide-react";
import Link from "next/link";

interface ProfileOverviewProps {
  recentOrders: Array<{
    id: string;
    title: string;
    date: string;
    price: number;
    status: string;
  }>;
  stats: {
    totalOrders: number;
    totalSpent: number;
    downloads: number;
    wishlist: number;
    reviews: number;
    averageRating: number;
    memberSince: string;
  };
}

export function ProfileOverview({ recentOrders, stats }: ProfileOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "processing":
        return "Đang xử lý";
      case "pending":
        return "Chờ xử lý";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Recent Orders */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Đơn hàng gần đây
          </CardTitle>
          <CardDescription>
            Các đơn hàng mới nhất của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{order.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(order.price)}</p>
                  <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link href="/orders">Xem tất cả đơn hàng</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Account Progress */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Tiến độ tài khoản
          </CardTitle>
          <CardDescription>
            Hoàn thành hồ sơ để nhận ưu đãi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Hoàn thành hồ sơ</span>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Thông tin cơ bản</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Xác thực email</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>Thêm ảnh đại diện</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>Xác thực số điện thoại</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 