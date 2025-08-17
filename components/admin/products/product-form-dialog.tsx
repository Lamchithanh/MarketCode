'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';

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

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductItem | null;
  onSave: (productData: ProductFormData) => void;
}

interface ProductFormData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  categoryId: string;
  tags: string[];
  technologies: string[];
  isActive?: boolean;
}

export function ProductFormDialog({ open, onOpenChange, product, onSave }: ProductFormDialogProps) {
  const isEditMode = !!product;
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: 0,
    thumbnailUrl: '',
    isActive: true,
    categoryId: '',
    tags: '',
    technologies: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (open) {
      if (isEditMode && product) {
        setFormData({
          title: product.title,
          slug: product.slug,
          description: product.description,
          price: product.price,
          thumbnailUrl: product.thumbnailUrl || '',
          isActive: product.isActive,
          categoryId: product.category, // We'll need to map category name to ID
          tags: product.tags.join(', '),
          technologies: product.technologies.join(', '),
        });
      } else {
        setFormData({
          title: '',
          slug: '',
          description: '',
          price: 0,
          thumbnailUrl: '',
          isActive: true,
          categoryId: '',
          tags: '',
          technologies: '',
        });
      }
      setErrors({});
    }
  }, [open, product, isEditMode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.categoryId.trim()) {
      newErrors.categoryId = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const productData: ProductFormData = {
        ...formData,
        ...(isEditMode && product ? { id: product.id } : {}),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        price: Number(formData.price),
      };
      onSave(productData);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    handleInputChange('title', title);
    if (!isEditMode) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      handleInputChange('slug', slug);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update product information' : 'Create a new product'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input 
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Product title"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input 
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className={`mt-1 ${errors.slug ? 'border-red-500' : ''}`}
              placeholder="product-slug"
            />
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`mt-1 ${errors.description ? 'border-red-500' : ''}`}
              rows={3}
              placeholder="Product description"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input 
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                className={`mt-1 ${errors.price ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input 
                id="category"
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                className={`mt-1 ${errors.categoryId ? 'border-red-500' : ''}`}
                placeholder="Web Development"
              />
              {errors.categoryId && (
                <p className="text-sm text-red-600 mt-1">{errors.categoryId}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
            <Input 
              id="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
              className="mt-1"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input 
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              className="mt-1"
              placeholder="React, TypeScript, Next.js"
            />
          </div>

          <div>
            <Label htmlFor="technologies">Technologies (comma separated)</Label>
            <Input 
              id="technologies"
              value={formData.technologies}
              onChange={(e) => handleInputChange('technologies', e.target.value)}
              className="mt-1"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.isActive ? 'active' : 'inactive'} 
              onValueChange={(value) => handleInputChange('isActive', value === 'active')}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800"
          >
            {isEditMode ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
