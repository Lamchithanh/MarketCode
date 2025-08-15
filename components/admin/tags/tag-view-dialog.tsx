'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TagItem {
  id: string;
  name: string;
  slug: string;
  color: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TagViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: TagItem | null;
}

export function TagViewDialog({ open, onOpenChange, tag }: TagViewDialogProps) {
  if (!tag) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tag Details</DialogTitle>
          <DialogDescription>
            Detailed information about the tag
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <div className="flex items-center space-x-2 mt-1">
                <div 
                  className="w-4 h-4 rounded-full border border-stone-200"
                  style={{ backgroundColor: tag.color }}
                ></div>
                <p className="text-foreground font-medium">{tag.name}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Slug</label>
              <Badge variant="outline" className="font-mono text-xs mt-1">{tag.slug}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Color</label>
              <div className="flex items-center space-x-2 mt-1">
                <div 
                  className="w-6 h-6 rounded-lg border border-stone-200"
                  style={{ backgroundColor: tag.color }}
                ></div>
                <span className="font-mono text-xs text-stone-600">{tag.color}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Products</label>
              <p className="text-foreground font-medium mt-1">{tag.productCount} products</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="text-foreground mt-1">{formatDate(tag.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated</label>
              <p className="text-foreground mt-1">{formatDate(tag.updatedAt)}</p>
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
