'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TagItem {
  id: string;
  name: string;
  slug: string;
  color: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TagDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: TagItem | null;
  onConfirm: (tag: TagItem) => void;
}

export function TagDeleteDialog({ open, onOpenChange, tag, onConfirm }: TagDeleteDialogProps) {
  if (!tag) return null;

  const handleConfirm = () => {
    onConfirm(tag);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this tag? This action cannot be undone and will remove the tag from all associated products.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            <strong>Tag:</strong> {tag.name}<br />
            <strong>Slug:</strong> {tag.slug}<br />
            <strong>Products using this tag:</strong> {tag.productCount}
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
