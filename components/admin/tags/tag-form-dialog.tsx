'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

interface TagItem {
  id: string;
  name: string;
  slug: string;
  color: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: TagItem | null; // undefined = Add mode, TagItem = Edit mode
  onSave: (tagData: {
    id?: string;
    name: string;
    slug: string;
    color: string;
  }) => void;
}

// Predefined color options for tags
const colorOptions = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export function TagFormDialog({ open, onOpenChange, tag, onSave }: TagFormDialogProps) {
  const isEditMode = !!tag;
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: colorOptions[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or tag changes
  useEffect(() => {
    if (open) {
      if (isEditMode && tag) {
        setFormData({
          name: tag.name,
          slug: tag.slug,
          color: tag.color,
        });
      } else {
        setFormData({
          name: '',
          slug: '',
          color: colorOptions[0],
        });
      }
      setErrors({});
    }
  }, [open, tag, isEditMode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tag name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.color || !/^#[0-9A-Fa-f]{6}$/.test(formData.color)) {
      newErrors.color = 'Valid color is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const tagData = {
        ...formData,
        ...(isEditMode && tag ? { id: tag.id } : {}),
      };
      
      onSave(tagData);
      onOpenChange(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    handleInputChange('name', name);
    if (!isEditMode) {
      const slug = name
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Tag' : 'Add New Tag'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update tag information' : 'Create a new tag'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Tag Name *</Label>
            <Input 
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
              placeholder="React"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input 
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className={`mt-1 ${errors.slug ? 'border-red-500' : ''}`}
              placeholder="react"
            />
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
            )}
          </div>

          <div>
            <Label htmlFor="color">Color *</Label>
            <div className="space-y-3 mt-1">
              {/* Color picker input */}
              <div className="flex items-center space-x-2">
                <Input 
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-12 h-10 p-1 rounded"
                />
                <Input 
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className={`flex-1 font-mono ${errors.color ? 'border-red-500' : ''}`}
                  placeholder="#000000"
                />
              </div>
              
              {/* Predefined color options */}
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleInputChange('color', color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color ? 'border-stone-600' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            {errors.color && (
              <p className="text-sm text-red-600 mt-1">{errors.color}</p>
            )}
          </div>

          {/* Preview */}
          <div>
            <Label>Preview</Label>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: formData.color }}
              >
                {formData.name || 'Tag Name'}
              </span>
            </div>
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
            {isEditMode ? 'Update Tag' : 'Add Tag'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
