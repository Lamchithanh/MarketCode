import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Trophy, CheckCircle2, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface ProfileOverviewProps {
  recentOrders: Array<{
    id: string;
    orderNumber?: string;
    totalAmount: number;  // Changed from price
    createdAt: string;    // Changed from date  
    status: string;
    items?: Array<{
      productTitle: string;
    }>;
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "processing":
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completion = 25; // Base for having an account
    
    if (stats.totalOrders > 0) completion += 25;
    if (stats.reviews > 0) completion += 25;
    if (stats.wishlist > 0) completion += 25;
    
    return Math.min(completion, 100);
  };

  const profileCompletion = calculateProfileCompletion();

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
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có đơn hàng nào</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {order.items?.[0]?.productTitle || `Đơn hàng #${order.orderNumber?.slice(-6)}`}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(order.totalAmount || 0)}</p>
                    <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link href="/profile?tab=orders">Xem tất cả đơn hàng</Link>
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
                <span className="text-sm text-muted-foreground">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Tài khoản đã tạo</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${stats.totalOrders > 0 ? '' : 'text-muted-foreground'}`}>
                <div className={`w-2 h-2 rounded-full ${stats.totalOrders > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Có đơn hàng ({stats.totalOrders})</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${stats.reviews > 0 ? '' : 'text-muted-foreground'}`}>
                <div className={`w-2 h-2 rounded-full ${stats.reviews > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Có đánh giá ({stats.reviews})</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${stats.wishlist > 0 ? '' : 'text-muted-foreground'}`}>
                <div className={`w-2 h-2 rounded-full ${stats.wishlist > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Có sản phẩm yêu thích ({stats.wishlist})</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 