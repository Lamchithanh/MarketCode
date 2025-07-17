import { ShoppingCart } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
}

export function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
          <ShoppingCart className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Giỏ hàng</h1>
          <p className="text-muted-foreground">
            {itemCount > 0 ? `${itemCount} sản phẩm trong giỏ hàng` : "Giỏ hàng trống"}
          </p>
        </div>
      </div>
    </div>
  );
} 