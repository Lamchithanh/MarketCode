'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  userName: string;
  productTitle: string;
  rating: number;
}

interface ReviewDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
  onConfirm: (review: Review) => void;
}

export function ReviewDeleteDialog({ open, onOpenChange, review, onConfirm }: ReviewDeleteDialogProps) {
  if (!review) return null;

  const handleConfirm = () => {
    onConfirm(review);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this review? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            <strong>Reviewer:</strong> {review.userName}<br />
            <strong>Product:</strong> {review.productTitle}<br />
            <strong>Rating:</strong> {review.rating} stars
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
