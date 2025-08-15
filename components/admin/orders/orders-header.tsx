'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface OrdersHeaderProps {
  onAddOrder?: () => void;
}

export function OrdersHeader({ onAddOrder }: OrdersHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Order Management</h2>
        <p className="text-muted-foreground">
          Manage customer orders and transactions
        </p>
      </div>
      <Button 
        size="sm" 
        className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white"
        onClick={onAddOrder}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        New Order
      </Button>
    </div>
  );
}
