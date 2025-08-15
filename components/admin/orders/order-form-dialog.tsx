'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productTitle: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
}

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order | null; // undefined = Add mode, Order = Edit mode
  onSave: (orderData: {
    id?: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    productTitle: string;
    amount: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
    paymentMethod: string;
  }) => void;
}

export function OrderFormDialog({ open, onOpenChange, order, onSave }: OrderFormDialogProps) {
  const isEditMode = !!order;
  
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    customerEmail: '',
    productTitle: '',
    amount: 0,
    status: 'PENDING' as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED',
    paymentStatus: 'PENDING' as 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED',
    paymentMethod: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or order changes
  useEffect(() => {
    if (open) {
      if (isEditMode && order) {
        setFormData({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          productTitle: order.productTitle,
          amount: order.amount,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
        });
      } else {
        // Generate order number for new orders
        const orderNumber = `ORD-${Date.now()}`;
        setFormData({
          orderNumber,
          customerName: '',
          customerEmail: '',
          productTitle: '',
          amount: 0,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentMethod: '',
        });
      }
      setErrors({});
    }
  }, [open, order, isEditMode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Customer email is required';
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }

    if (!formData.productTitle.trim()) {
      newErrors.productTitle = 'Product title is required';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.paymentMethod.trim()) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const orderData = {
        ...formData,
        ...(isEditMode && order ? { id: order.id } : {}),
      };
      
      onSave(orderData);
      onOpenChange(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Order' : 'Create New Order'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update order information for #${order?.orderNumber}` : 'Create a new order'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input 
                id="orderNumber"
                value={formData.orderNumber}
                onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                className="mt-1"
                disabled={isEditMode} // Can't change order number in edit mode
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input 
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                className={`mt-1 ${errors.amount ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input 
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className={`mt-1 ${errors.customerName ? 'border-red-500' : ''}`}
                placeholder="John Doe"
                disabled={isEditMode} // Usually can't change customer in edit mode
              />
              {errors.customerName && (
                <p className="text-sm text-red-600 mt-1">{errors.customerName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="customerEmail">Customer Email *</Label>
              <Input 
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                className={`mt-1 ${errors.customerEmail ? 'border-red-500' : ''}`}
                placeholder="john@example.com"
                disabled={isEditMode} // Usually can't change customer in edit mode
              />
              {errors.customerEmail && (
                <p className="text-sm text-red-600 mt-1">{errors.customerEmail}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="productTitle">Product *</Label>
            <Input 
              id="productTitle"
              value={formData.productTitle}
              onChange={(e) => handleInputChange('productTitle', e.target.value)}
              className={`mt-1 ${errors.productTitle ? 'border-red-500' : ''}`}
              placeholder="Product name"
              disabled={isEditMode} // Usually can't change product in edit mode
            />
            {errors.productTitle && (
              <p className="text-sm text-red-600 mt-1">{errors.productTitle}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Order Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED') => 
                  handleInputChange('status', value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select 
                value={formData.paymentStatus} 
                onValueChange={(value: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED') => 
                  handleInputChange('paymentStatus', value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Input 
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className={`mt-1 ${errors.paymentMethod ? 'border-red-500' : ''}`}
              placeholder="Credit Card, PayPal, etc."
            />
            {errors.paymentMethod && (
              <p className="text-sm text-red-600 mt-1">{errors.paymentMethod}</p>
            )}
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
            {isEditMode ? 'Update Order' : 'Create Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
