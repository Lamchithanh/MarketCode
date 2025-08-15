'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  isActive: boolean;
  expiresAt?: string;
}

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: Coupon | null; // undefined = Add mode, Coupon = Edit mode
  onSave: (couponData: {
    id?: string;
    code: string;
    description: string;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT';
    value: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    usageLimit?: number;
    isActive: boolean;
    expiresAt?: string;
  }) => void;
}

export function CouponFormDialog({ open, onOpenChange, coupon, onSave }: CouponFormDialogProps) {
  const isEditMode = !!coupon;
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT',
    value: 0,
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    isActive: true,
    expiresAt: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or coupon changes
  useEffect(() => {
    if (open) {
      if (isEditMode && coupon) {
        setFormData({
          code: coupon.code,
          description: coupon.description,
          type: coupon.type,
          value: coupon.value,
          minOrderAmount: coupon.minOrderAmount?.toString() || '',
          maxDiscount: coupon.maxDiscount?.toString() || '',
          usageLimit: coupon.usageLimit?.toString() || '',
          isActive: coupon.isActive,
          expiresAt: coupon.expiresAt ? formatDateForInput(coupon.expiresAt) : '',
        });
      } else {
        setFormData({
          code: '',
          description: '',
          type: 'PERCENTAGE',
          value: 0,
          minOrderAmount: '',
          maxDiscount: '',
          usageLimit: '',
          isActive: true,
          expiresAt: '',
        });
      }
      setErrors({});
    }
  }, [open, coupon, isEditMode]);

  const formatDateForInput = (dateString: string) => {
    return new Date(dateString).toISOString().slice(0, 16);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required';
    } else if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
      newErrors.code = 'Code can only contain uppercase letters, numbers, underscore, and hyphen';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.value <= 0) {
      newErrors.value = 'Discount value must be greater than 0';
    } else if (formData.type === 'PERCENTAGE' && formData.value > 100) {
      newErrors.value = 'Percentage discount cannot exceed 100%';
    }

    if (formData.minOrderAmount && parseFloat(formData.minOrderAmount) < 0) {
      newErrors.minOrderAmount = 'Minimum order amount cannot be negative';
    }

    if (formData.maxDiscount && parseFloat(formData.maxDiscount) < 0) {
      newErrors.maxDiscount = 'Maximum discount cannot be negative';
    }

    if (formData.usageLimit && parseInt(formData.usageLimit) < 1) {
      newErrors.usageLimit = 'Usage limit must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const couponData = {
        ...formData,
        ...(isEditMode && coupon ? { id: coupon.id } : {}),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        expiresAt: formData.expiresAt || undefined,
      };
      
      onSave(couponData);
      onOpenChange(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Generate random coupon code
  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleInputChange('code', result);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update coupon information' : 'Create a new discount coupon'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Coupon Code *</Label>
              <div className="flex space-x-2 mt-1">
                <Input 
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  className={`font-mono ${errors.code ? 'border-red-500' : ''}`}
                  placeholder="SAVE20"
                />
                {!isEditMode && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateCouponCode}
                    className="shrink-0"
                  >
                    Generate
                  </Button>
                )}
              </div>
              {errors.code && (
                <p className="text-sm text-red-600 mt-1">{errors.code}</p>
              )}
            </div>
            <div>
              <Label htmlFor="type">Discount Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'PERCENTAGE' | 'FIXED_AMOUNT') => handleInputChange('type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                  <SelectItem value="FIXED_AMOUNT">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`mt-1 ${errors.description ? 'border-red-500' : ''}`}
              rows={2}
              placeholder="Describe what this coupon is for..."
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="value">
                Discount Value * {formData.type === 'PERCENTAGE' ? '(%)' : '($)'}
              </Label>
              <Input 
                id="value"
                type="number"
                step={formData.type === 'PERCENTAGE' ? '1' : '0.01'}
                min="0"
                max={formData.type === 'PERCENTAGE' ? '100' : undefined}
                value={formData.value}
                onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                className={`mt-1 ${errors.value ? 'border-red-500' : ''}`}
                placeholder={formData.type === 'PERCENTAGE' ? '20' : '10.00'}
              />
              {errors.value && (
                <p className="text-sm text-red-600 mt-1">{errors.value}</p>
              )}
            </div>
            <div>
              <Label htmlFor="minOrderAmount">Min Order Amount ($)</Label>
              <Input 
                id="minOrderAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.minOrderAmount}
                onChange={(e) => handleInputChange('minOrderAmount', e.target.value)}
                className={`mt-1 ${errors.minOrderAmount ? 'border-red-500' : ''}`}
                placeholder="50.00 (optional)"
              />
              {errors.minOrderAmount && (
                <p className="text-sm text-red-600 mt-1">{errors.minOrderAmount}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {formData.type === 'PERCENTAGE' && (
              <div>
                <Label htmlFor="maxDiscount">Max Discount ($)</Label>
                <Input 
                  id="maxDiscount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.maxDiscount}
                  onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                  className={`mt-1 ${errors.maxDiscount ? 'border-red-500' : ''}`}
                  placeholder="100.00 (optional)"
                />
                {errors.maxDiscount && (
                  <p className="text-sm text-red-600 mt-1">{errors.maxDiscount}</p>
                )}
              </div>
            )}
            <div>
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input 
                id="usageLimit"
                type="number"
                min="1"
                value={formData.usageLimit}
                onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                className={`mt-1 ${errors.usageLimit ? 'border-red-500' : ''}`}
                placeholder="100 (optional)"
              />
              {errors.usageLimit && (
                <p className="text-sm text-red-600 mt-1">{errors.usageLimit}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiresAt">Expires At</Label>
              <Input 
                id="expiresAt"
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                className="mt-1"
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

          {/* Preview */}
          {formData.code && (
            <div>
              <Label>Preview</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-lg">{formData.code}</span>
                    <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-600">
                      {formData.type === 'PERCENTAGE' ? `${formData.value}%` : `$${formData.value}`}
                    </span>
                    <p className="text-xs text-gray-500">OFF</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800"
          >
            {isEditMode ? 'Update Coupon' : 'Create Coupon'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
