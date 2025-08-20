'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DownloadDialog } from './download-dialog';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { useDownloadStatus } from '@/hooks/use-download-status';

interface DownloadButtonProps {
  productId: string;
  productTitle: string;
  productThumbnail?: string;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
}

export function DownloadButton({ 
  productId,
  productTitle,
  productThumbnail,
  disabled = false,
  size = 'sm',
  variant = 'outline'
}: DownloadButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productData, setProductData] = useState<{
    githubUrl: string;
    technologies: string[];
  } | null>(null);
  const { user } = useUser();
  const { status, loading, trackDownload } = useDownloadStatus(user?.id || null, productId);

  const handleDownloadClick = async () => {
    if (!user?.id) {
      toast.error('Bạn cần đăng nhập để tải xuống');
      return;
    }

    if (!status?.canDownload) {
      toast.error('Bạn đã tải xuống tối đa 2 lần cho sản phẩm này');
      return;
    }

    try {
      // Fetch product data including githubUrl
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const result = await response.json();
      if (!result.success || !result.product) {
        throw new Error('Product not found');
      }

      const product = result.product;
      
      if (!product || !product.githubUrl || product.githubUrl === '#') {
        toast.error('Sản phẩm này chưa có GitHub repository');
        return;
      }

      setProductData({
        githubUrl: product.githubUrl,
        technologies: product.technologies || []
      });

      setDialogOpen(true);
    } catch (err) {
      console.error('Error fetching product:', err);
      toast.error('Không thể tải thông tin sản phẩm');
    }
  };

  const handleDownloadConfirm = async () => {
    if (!user?.id) return;

    try {
      await trackDownload();
      toast.success('Download đã được ghi nhận!');
    } catch (err) {
      console.error('Error tracking download:', err);
      toast.error('Có lỗi xảy ra khi ghi nhận download');
    }
  };

  // Determine button state
  const isDownloaded = status?.downloaded || false;
  const canDownload = status?.canDownload || false;
  const downloadCount = status?.downloadCount || 0;
  const maxDownloads = status?.maxDownloads || 2;

  return (
    <div className="flex items-center gap-2">
      <Button 
        size={size}
        variant={variant}
        className="gap-1"
        onClick={handleDownloadClick}
        disabled={disabled || !canDownload}
      >
        {!canDownload ? (
          <>
            <Lock className="h-3 w-3" />
            Đã khóa
          </>
        ) : isDownloaded ? (
          <>
            <Check className="h-3 w-3" />
            Tải lại
          </>
        ) : (
          <>
            <Download className="h-3 w-3" />
            Tải xuống
          </>
        )}
      </Button>

      {/* Download status badge */}
      {isDownloaded && (
        <Badge variant={canDownload ? "secondary" : "destructive"} className="text-xs">
          {downloadCount}/{maxDownloads}
        </Badge>
      )}

      {productData && (
        <DownloadDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          product={{
            id: productId,
            title: productTitle,
            githubUrl: productData.githubUrl,
            thumbnailUrl: productThumbnail,
            technologies: productData.technologies
          }}
          onDownloadConfirm={handleDownloadConfirm}
        />
      )}
    </div>
  );
}
