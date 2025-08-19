'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, Eye } from 'lucide-react';
import { Tag } from '@/lib/services/product-service';
import Image from 'next/image';

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  images?: string[];
  githubUrl?: string;
  demoUrl?: string;
  downloadCount: number;
  viewCount: number;
  isActive: boolean;
  category: string;
  categoryIcon?: string;
  tags: Tag[];
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

  console.log('ProductViewDialog - product data:', {
    title: product.title,
    images: product.images,
    githubUrl: product.githubUrl,
    demoUrl: product.demoUrl
  });

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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto scrollbar-hide hover:scrollbar-show">
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            width: 8px;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .scrollbar-hide::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-hide::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
          }
          .scrollbar-hide {
            scrollbar-width: none;
          }
          .scrollbar-show:hover::-webkit-scrollbar {
            opacity: 1;
          }
          .scrollbar-show {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
          }
        `}</style>
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Detailed information about the product
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
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

            <div>
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <div className="mt-1">
                <Badge variant="outline" className="flex items-center gap-1 w-fit">
                  {product.category}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Tags</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.tags?.length > 0 ? (
                  product.tags.map((tag) => (
                    <Badge 
                      key={tag.id} 
                      variant="secondary" 
                      className={`text-xs text-white`}
                      style={{ 
                        backgroundColor: tag.color || '#6B7280'
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No tags assigned</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
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

            {product.images && product.images.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Product Images</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {product.images.map((imageUrl, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden border">
                      <Image
                        src={imageUrl}
                        alt={`Product image ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.svg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(product.githubUrl || product.demoUrl) && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Links</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.githubUrl && (
                    <a 
                      href={product.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border bg-background hover:bg-accent"
                    >
                      🔗 GitHub Source
                    </a>
                  )}
                  {product.demoUrl && (
                    <a 
                      href={product.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border bg-background hover:bg-accent"
                    >
                      🚀 Live Demo
                    </a>
                  )}
                </div>
              </div>
            )}

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