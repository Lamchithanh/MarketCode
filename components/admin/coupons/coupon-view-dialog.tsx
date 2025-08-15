'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Percent, Calendar, Users, ShoppingCart } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface CouponViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: Coupon | null;
}

export function CouponViewDialog({ open, onOpenChange, coupon }: CouponViewDialogProps) {
  if (!coupon) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDiscount = (type: string, value: number) => {
    if (type === 'PERCENTAGE') {
      return `${value}%`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
  const isLimitReached = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Coupon Details</DialogTitle>
          <DialogDescription>
            Detailed information about the coupon
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-500 to-stone-600 rounded-lg flex items-center justify-center">
                <Percent className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground font-mono">{coupon.code}</h3>
                <p className="text-sm text-muted-foreground">{coupon.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">
                {formatDiscount(coupon.type, coupon.value)}
              </div>
              <Badge 
                variant={coupon.isActive && !isExpired && !isLimitReached ? 'default' : 'destructive'}
                className={coupon.isActive && !isExpired && !isLimitReached ? 'bg-green-100 text-green-800' : ''}
              >
                {!coupon.isActive ? 'Inactive' : isExpired ? 'Expired' : isLimitReached ? 'Limit Reached' : 'Active'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Discount Type</label>
              <p className="font-medium text-foreground mt-1">
                {coupon.type === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Discount Value</label>
              <p className="font-medium text-foreground mt-1">
                {formatDiscount(coupon.type, coupon.value)}
              </p>
            </div>
            {coupon.minOrderAmount && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Min Order Amount
                </label>
                <p className="font-medium text-foreground mt-1">
                  {formatCurrency(coupon.minOrderAmount)}
                </p>
              </div>
            )}
            {coupon.maxDiscount && coupon.type === 'PERCENTAGE' && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Max Discount</label>
                <p className="font-medium text-foreground mt-1">
                  {formatCurrency(coupon.maxDiscount)}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Usage
              </label>
              <div className="mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Used:</span>
                  <span className="font-medium">{coupon.usedCount}</span>
                </div>
                {coupon.usageLimit && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Limit:</span>
                    <span className="font-medium">{coupon.usageLimit}</span>
                  </div>
                )}
                {coupon.usageLimit && (
                  <div className="w-full bg-stone-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-stone-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Expiry
              </label>
              <p className="font-medium text-foreground mt-1">
                {coupon.expiresAt ? formatDate(coupon.expiresAt) : 'No expiry'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="text-foreground mt-1">{formatDate(coupon.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated</label>
              <p className="text-foreground mt-1">{formatDate(coupon.updatedAt)}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
