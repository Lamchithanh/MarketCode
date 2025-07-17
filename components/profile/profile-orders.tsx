import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Download, CheckCircle } from "lucide-react";

interface ProfileOrdersProps {
  orders: Array<{
    id: string;
    title: string;
    date: string;
    price: number;
    status: string;
    downloaded?: boolean;
  }>;
}

export function ProfileOrders({ orders }: ProfileOrdersProps) {
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
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Lịch sử đơn hàng</CardTitle>
        <CardDescription>
          Quản lý và theo dõi tất cả đơn hàng của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-6 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{order.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Mã đơn: {order.id} • {new Date(order.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <p className="font-bold text-lg">{formatCurrency(order.price)}</p>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </Badge>
                  {order.status === "completed" && (
                    <Badge 
                      variant={order.downloaded ? "default" : "secondary"}
                      className="text-xs flex items-center gap-1"
                    >
                      {order.downloaded ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Đã tải
                        </>
                      ) : (
                        <>
                          <Download className="h-3 w-3" />
                          Chưa tải
                        </>
                      )}
                    </Badge>
                  )}
                </div>
                {order.status === "completed" && !order.downloaded && (
                  <Button size="sm" variant="outline" className="gap-1">
                    <Download className="h-3 w-3" />
                    Tải xuống
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 