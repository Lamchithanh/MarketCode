'use client';

import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';

interface CouponsHeaderProps {
  onAddCoupon?: () => void;
}

export function CouponsHeader({ onAddCoupon }: CouponsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Coupon Management</h2>
        <p className="text-muted-foreground">
          Manage discount coupons and promotional codes
        </p>
      </div>
      <Button 
        size="sm" 
        className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white"
        onClick={onAddCoupon}
      >
        <Ticket className="h-4 w-4 mr-2" />
        Add Coupon
      </Button>
    </div>
  );
}
