'use client';

import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

interface ProductsHeaderProps {
  onAddProduct?: () => void;
}

export function ProductsHeader({ onAddProduct }: ProductsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Product Management</h2>
        <p className="text-muted-foreground">
          Manage marketplace products and inventory
        </p>
      </div>
      <Button 
        size="sm" 
        className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white"
        onClick={onAddProduct}
      >
        <Package className="h-4 w-4 mr-2" />
        Add Product
      </Button>
    </div>
  );
}
