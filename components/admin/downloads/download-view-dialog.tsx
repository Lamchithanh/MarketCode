'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Package, Calendar, Globe, Monitor } from 'lucide-react';

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

interface DownloadViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  download: DownloadItem | null;
}

export function DownloadViewDialog({ open, onOpenChange, download }: DownloadViewDialogProps) {
  if (!download) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Download Details</DialogTitle>
          <DialogDescription>
            Detailed information about the download
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">User</label>
              <div className="flex items-center space-x-3 mt-1">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/api/placeholder/40/40?text=${download.userName.charAt(0)}`} />
                  <AvatarFallback className="bg-stone-100 text-stone-600">
                    {download.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-foreground font-medium">{download.userName}</p>
                  <p className="text-sm text-muted-foreground">{download.userEmail}</p>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Product</label>
              <div className="flex items-center space-x-3 mt-1">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={download.productThumbnail} />
                  <AvatarFallback className="bg-stone-100 text-stone-600">
                    <Package className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <p className="text-foreground font-medium">{download.productName}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Download Date</label>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{formatDate(download.downloadDate)}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">IP Address</label>
              <div className="flex items-center space-x-2 mt-1">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm bg-muted px-2 py-1 rounded">{download.ipAddress}</code>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">{getStatusBadge(download.status)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Download Count</label>
              <div className="flex items-center space-x-2 mt-1">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{download.downloadCount}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">User Agent</label>
            <div className="flex items-center space-x-2 mt-1">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs bg-muted p-2 rounded break-all">{download.userAgent}</p>
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
