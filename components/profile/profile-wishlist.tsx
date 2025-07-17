import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Package } from "lucide-react";

interface ProfileWishlistProps {
  items: Array<{
    id: string;
    title: string;
    price: number;
    image: string;
  }>;
}

export function ProfileWishlist({ items }: ProfileWishlistProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Danh sách yêu thích</CardTitle>
        <CardDescription>
          Các sản phẩm bạn quan tâm
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-lg font-bold text-primary">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm">Mua ngay</Button>
                <Button size="sm" variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 