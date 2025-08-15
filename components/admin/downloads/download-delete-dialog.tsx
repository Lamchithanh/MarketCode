'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DownloadItem {
  id: string;
  userName: string;
  productName: string;
}

interface DownloadDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  download: DownloadItem | null;
  onConfirm: (download: DownloadItem) => void;
}

export function DownloadDeleteDialog({ open, onOpenChange, download, onConfirm }: DownloadDeleteDialogProps) {
  if (!download) return null;

  const handleConfirm = () => {
    onConfirm(download);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this download record? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            <strong>User:</strong> {download.userName}<br />
            <strong>Product:</strong> {download.productName}
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
