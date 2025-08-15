'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DownloadItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  productThumbnail: string;
  downloadDate: string;
  ipAddress: string;
  userAgent: string;
  status: "completed" | "failed" | "pending";
  downloadCount: number;
}

interface DownloadEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  download: DownloadItem | null;
  onSave: (updatedDownload: DownloadItem) => void;
}

export function DownloadEditDialog({ open, onOpenChange, download, onSave }: DownloadEditDialogProps) {
  if (!download) return null;

  const handleSave = () => {
    // In a real app, you would collect form data here
    onSave(download);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Download</DialogTitle>
          <DialogDescription>
            Update download information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select defaultValue={download.status}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="downloadCount">Download Count</Label>
            <Input 
              type="number" 
              defaultValue={download.downloadCount}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ipAddress">IP Address</Label>
            <Input 
              defaultValue={download.ipAddress}
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
