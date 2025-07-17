import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, ShoppingCart, Download, Heart } from "lucide-react";

interface ProfileSettingsProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  stats: {
    totalOrders: number;
    downloads: number;
    wishlist: number;
  };
}

export function ProfileSettings({ user, stats }: ProfileSettingsProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Cài đặt tài khoản</CardTitle>
        <CardDescription>
          Quản lý thông tin và tùy chỉnh tài khoản
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Thông tin cá nhân</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Họ tên: {user.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Email: {user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Vai trò: {user.role}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Thống kê</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Đơn hàng: {stats.totalOrders}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Tải xuống: {stats.downloads}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Yêu thích: {stats.wishlist}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex gap-4">
            <Button variant="outline">Đổi mật khẩu</Button>
            <Button variant="outline">Cập nhật thông tin</Button>
            <Button variant="outline">Cài đặt thông báo</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 