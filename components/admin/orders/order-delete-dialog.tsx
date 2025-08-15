'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  productTitle: string;
  amount: number;
  status: string;
}

interface OrderDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onConfirm: (order: Order) => void;
}

export function OrderDeleteDialog({ open, onOpenChange, order, onConfirm }: OrderDeleteDialogProps) {
  if (!order) return null;

  const handleConfirm = () => {
    onConfirm(order);
    onOpenChange(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this order? This action cannot be undone and will permanently remove all order data.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            <strong>Order:</strong> #{order.orderNumber}<br />
            <strong>Customer:</strong> {order.customerName}<br />
            <strong>Product:</strong> {order.productTitle}<br />
            <strong>Amount:</strong> {formatPrice(order.amount)}<br />
            <strong>Status:</strong> {order.status}
          </p>
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
