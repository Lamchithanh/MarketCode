'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, Eye } from 'lucide-react';

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
  tags: string[];
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductItem | null;
}

export function ProductViewDialog({ open, onOpenChange, product }: ProductViewDialogProps) {
  if (!product) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Detailed information about the product
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={product.thumbnailUrl} alt={product.title} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xl">
                {product.title.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{product.title}</h3>
              <p className="text-sm text-muted-foreground">{product.slug}</p>
              <p className="text-xl font-bold text-foreground mt-2">{formatPrice(product.price)}</p>
            </div>
            <Badge 
              variant={product.isActive ? 'default' : 'destructive'}
              className={product.isActive ? 'bg-green-100 text-green-800' : ''}
            >
              {product.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="text-foreground mt-1">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <Badge variant="outline" className="mt-1">{product.category}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Statistics</label>
              <div className="space-y-1 mt-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Download className="w-3 h-3 mr-1" />
                  {product.downloadCount.toLocaleString()} downloads
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Eye className="w-3 h-3 mr-1" />
                  {product.viewCount.toLocaleString()} views
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Tags</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Technologies</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {product.technologies.map((tech, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="text-foreground mt-1">{formatDate(product.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated</label>
              <p className="text-foreground mt-1">{formatDate(product.updatedAt)}</p>
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
