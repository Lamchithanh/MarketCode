'use client';

import React, { useState, useEffect } from 'react';
import { Order, CreateOrderData, UpdateOrderData } from '@/lib/services/order-service';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface OrderFormDialogProps {
  order?: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateOrderData | UpdateOrderData) => Promise<void>;
  loading?: boolean;
}

interface OrderItem {
  productId: string;
  productTitle: string;
  productPrice: number;
  snapshotUrl?: string;
}

export function OrderFormDialog({ 
  order, 
  open, 
  onOpenChange, 
  onSubmit, 
  loading = false 
}: OrderFormDialogProps) {
  const [formData, setFormData] = useState({
    buyerId: '',
    totalAmount: 0,
    discountAmount: 0,
    taxAmount: 0,
    paymentMethod: 'credit_card',
    paymentStatus: 'PENDING' as 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED',
    status: 'PENDING' as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED',
    notes: '',
  });

  const [items, setItems] = useState<OrderItem[]>([]);

  // Reset form when dialog opens/closes or order changes
  useEffect(() => {
    if (open) {
      if (order) {
        // Edit mode
        setFormData({
          buyerId: order.buyerId,
          totalAmount: order.totalAmount,
          discountAmount: order.discountAmount || 0,
          taxAmount: order.taxAmount || 0,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          notes: order.notes || '',
        });
        setItems([]);
      } else {
        // Create mode
        setFormData({
          buyerId: '',
          totalAmount: 0,
          discountAmount: 0,
          taxAmount: 0,
          paymentMethod: 'credit_card',
          paymentStatus: 'PENDING',
          status: 'PENDING',
          notes: '',
        });
        setItems([{
          productId: '',
          productTitle: '',
          productPrice: 0,
        }]);
      }
    }
  }, [open, order]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems(prev => [...prev, {
      productId: '',
      productTitle: '',
      productPrice: 0,
    }]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const itemsTotal = items.reduce((sum, item) => sum + item.productPrice, 0);
    const finalTotal = itemsTotal - formData.discountAmount + formData.taxAmount;
    setFormData(prev => ({
      ...prev,
      totalAmount: Math.max(0, finalTotal),
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.buyerId.trim()) {
        toast.error('Vui lòng nhập ID khách hàng');
        return;
      }

      if (!order && items.length === 0) {
        toast.error('Vui lòng thêm ít nhất một sản phẩm');
        return;
      }

      if (!order && items.some(item => !item.productTitle.trim() || item.productPrice <= 0)) {
        toast.error('Vui lòng điền đầy đủ thông tin sản phẩm');
        return;
      }

      if (order) {
        // Update mode - only send changed fields
        const updateData: UpdateOrderData = {};
        
        if (formData.status !== order.status) updateData.status = formData.status;
        if (formData.paymentStatus !== order.paymentStatus) updateData.paymentStatus = formData.paymentStatus;
        if (formData.paymentMethod !== order.paymentMethod) updateData.paymentMethod = formData.paymentMethod;
        if (formData.notes !== (order.notes || '')) updateData.notes = formData.notes;

        await onSubmit(updateData);
      } else {
        // Create mode
        const createData: CreateOrderData = {
          buyerId: formData.buyerId,
          totalAmount: formData.totalAmount,
          discountAmount: formData.discountAmount || 0,
          taxAmount: formData.taxAmount || 0,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes || undefined,
          items: items.map(item => ({
            productId: item.productId || `temp-${Date.now()}-${Math.random()}`,
            productTitle: item.productTitle,
            productPrice: item.productPrice,
            snapshotUrl: item.snapshotUrl,
          })),
        };

        await onSubmit(createData);
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const isEditMode = !!order;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng mới'}
            {isEditMode && (
              <Badge variant="outline" className="ml-2">
                {order.orderNumber}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="buyerId">ID Khách hàng *</Label>
              <Input
                id="buyerId"
                value={formData.buyerId}
                onChange={(e) => handleInputChange('buyerId', e.target.value)}
                placeholder="Nhập ID khách hàng (UUID)"
                disabled={isEditMode}
              />
            </div>
          </div>

          <Separator />

          {/* Order Items (only for create mode) */}
          {!isEditMode && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-semibold">Sản phẩm</Label>
                <Button type="button" onClick={addItem} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm sản phẩm
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 relative">
                    {items.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeItem(index)}
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <Label>Tên sản phẩm *</Label>
                        <Input
                          value={item.productTitle}
                          onChange={(e) => handleItemChange(index, 'productTitle', e.target.value)}
                          placeholder="Tên sản phẩm"
                        />
                      </div>
                      <div>
                        <Label>Giá (VND) *</Label>
                        <Input
                          type="number"
                          value={item.productPrice}
                          onChange={(e) => handleItemChange(index, 'productPrice', Number(e.target.value))}
                          placeholder="0"
                          min="0"
                          onBlur={calculateTotal}
                        />
                      </div>
                      <div>
                        <Label>URL Demo</Label>
                        <Input
                          value={item.snapshotUrl || ''}
                          onChange={(e) => handleItemChange(index, 'snapshotUrl', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Payment & Status Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => handleInputChange('paymentMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                  <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="cash">Tiền mặt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paymentStatus">Trạng thái thanh toán</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => handleInputChange('paymentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                  <SelectItem value="PAID">Đã thanh toán</SelectItem>
                  <SelectItem value="FAILED">Thất bại</SelectItem>
                  <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Trạng thái đơn hàng</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                  <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!isEditMode && (
              <>
                <div>
                  <Label htmlFor="discountAmount">Giảm giá (VND)</Label>
                  <Input
                    id="discountAmount"
                    type="number"
                    value={formData.discountAmount}
                    onChange={(e) => handleInputChange('discountAmount', Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    onBlur={calculateTotal}
                  />
                </div>

                <div>
                  <Label htmlFor="taxAmount">Thuế (VND)</Label>
                  <Input
                    id="taxAmount"
                    type="number"
                    value={formData.taxAmount}
                    onChange={(e) => handleInputChange('taxAmount', Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    onBlur={calculateTotal}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="totalAmount" className="text-base font-semibold">
                    Tổng tiền (VND): {formData.totalAmount.toLocaleString('vi-VN')}
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Tự động tính từ giá sản phẩm + thuế - giảm giá
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Ghi chú về đơn hàng..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Tạo đơn hàng')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
