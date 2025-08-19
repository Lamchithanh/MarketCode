"use client";

import { useCart, useSystemSettings } from "@/hooks";
import { CartHeader } from "./cart-header";
import { CartEmpty } from "./cart-empty";
import { CartItemsList } from "./cart-items-list";
import { CartSummaryCard } from "./cart-summary-card";
import { useRouter } from "next/navigation";

export function CartContainer() {
  const router = useRouter();
  const { 
    items, 
    loading, 
    error,
    subtotal, 
    itemCount, 
    removeItem 
  } = useCart();
  
  const { settings } = useSystemSettings();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleRemoveItem = async (cartId: string) => {
    const result = await removeItem(cartId);
    if (!result.success && result.error) {
      // TODO: Show toast notification
      console.error('Failed to remove item:', result.error);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <CartLoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <CartError error={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="max-w-6xl mx-auto">
        <CartHeader itemCount={itemCount} />
        
        {items.length === 0 ? (
          <CartEmpty supportEmail={settings.support_email} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CartItemsList 
                items={items}
                onRemoveItem={handleRemoveItem}
              />
            </div>
            <div className="lg:col-span-1">
              <CartSummaryCard 
                subtotal={subtotal}
                itemCount={itemCount}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CartLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-muted rounded-md animate-pulse" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="h-64 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function CartError({ error }: { error: string }) {
  return (
    <div className="text-center py-12">
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Lỗi tải giỏ hàng
        </h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
