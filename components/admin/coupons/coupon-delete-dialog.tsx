'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  usedCount: number;
}

interface CouponDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: Coupon | null;
  onConfirm: (coupon: Coupon) => void;
}

export function CouponDeleteDialog({ open, onOpenChange, coupon, onConfirm }: CouponDeleteDialogProps) {
  if (!coupon) return null;

  const handleConfirm = () => {
    onConfirm(coupon);
    onOpenChange(false);
  };

  const formatDiscount = (type: string, value: number) => {
    if (type === 'PERCENTAGE') {
      return `${value}%`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this coupon? This action cannot be undone and will permanently remove the coupon from the system.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            <strong>Code:</strong> {coupon.code}<br />
            <strong>Description:</strong> {coupon.description}<br />
            <strong>Discount:</strong> {formatDiscount(coupon.type, coupon.value)}<br />
            <strong>Times used:</strong> {coupon.usedCount}
          </p>
          {coupon.usedCount > 0 && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This coupon has been used {coupon.usedCount} time(s). 
                Deleting it may affect order history and reporting.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
