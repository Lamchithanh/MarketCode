"use client";

import { CartItem } from "@/hooks/use-cart";
import { CartItemCard } from "./cart-item-card";

interface CartItemsListProps {
  items: CartItem[];
  onRemoveItem: (cartId: string) => void;
}

export function CartItemsList({ items, onRemoveItem }: CartItemsListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Sản phẩm trong giỏ hàng</h2>
      
      {items.map((item) => (
        <CartItemCard 
          key={item.cartId}
          item={item}
          onRemove={() => onRemoveItem(item.cartId)}
        />
      ))}
    </div>
  );
}
