import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Package, Download, Star } from "lucide-react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  technologies: string[];
  category: string;
  description?: string;
  rating?: number;
  features?: string[];
}

interface CartItemsProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
}

export function CartItems({ items, onRemoveItem }: CartItemsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Product Image */}
              <div className="w-24 h-24 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="h-12 w-12 text-primary" />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.description || "Source code chất lượng cao, được xây dựng chuyên nghiệp"}
                    </p>
                  </div>
                  
                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-destructive hover:text-destructive ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Category and Technologies */}
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  {item.technologies.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Rating */}
                {item.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{item.rating}</span>
                    <span className="text-sm text-muted-foreground">(156 đánh giá)</span>
                  </div>
                )}

                {/* Key Features */}
                {item.features && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Tính năng nổi bật:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {item.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Price and Purchase Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary mb-1">
                      {formatCurrency(item.price)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Mua 1 lần • Sử dụng vĩnh viễn
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>Tải ngay sau khi thanh toán</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 