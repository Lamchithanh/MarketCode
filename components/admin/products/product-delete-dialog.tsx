'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tag } from '@/lib/services/product-service';

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  downloadCount: number;
  viewCount: number;
  isActive: boolean;
  category: string;
  tags: Tag[];
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductItem | null;
  onConfirm: (product: ProductItem) => void;
}

export function ProductDeleteDialog({ open, onOpenChange, product, onConfirm }: ProductDeleteDialogProps) {
  if (!product) return null;

  const handleConfirm = () => {
    onConfirm(product);
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
            Are you sure you want to delete this product? This action cannot be undone and will remove all associated data including reviews and download history.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            <strong>Product:</strong> {product.title}<br />
            <strong>Category:</strong> {product.category}<br />
            <strong>Price:</strong> {formatPrice(product.price)}<br />
            <strong>Downloads:</strong> {product.downloadCount.toLocaleString()}
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
