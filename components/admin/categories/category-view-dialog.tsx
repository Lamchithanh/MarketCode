'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Folder, Package } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export function CategoryViewDialog({ open, onOpenChange, category }: CategoryViewDialogProps) {
  if (!category) return null;

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
          <DialogTitle>Category Details</DialogTitle>
          <DialogDescription>
            Detailed information about the category
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={category.icon} alt={category.name} />
              <AvatarFallback className="bg-gradient-to-br from-stone-500 to-stone-600 text-white text-lg">
                <Folder className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.slug}</p>
              <Badge 
                variant={category.isActive ? 'default' : 'destructive'}
                className={category.isActive ? 'bg-green-100 text-green-800 mt-1' : 'mt-1'}
              >
                {category.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="text-foreground mt-1">{category.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center">
                <Package className="h-4 w-4 mr-1" />
                Products
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-2xl font-bold text-foreground">{category.productCount}</span>
                <span className="text-sm text-muted-foreground">products in this category</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge 
                  variant={category.isActive ? 'default' : 'destructive'}
                  className={category.isActive ? 'bg-green-100 text-green-800' : ''}
                >
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="text-foreground mt-1">{formatDate(category.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated</label>
              <p className="text-foreground mt-1">{formatDate(category.updatedAt)}</p>
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
