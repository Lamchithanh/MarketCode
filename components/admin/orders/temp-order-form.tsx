'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface OrderFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  product_title: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
}

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: OrderFormData) => void;
  initialData?: Partial<OrderFormData>;
  title?: string;
  submitLabel?: string;
  loading?: boolean;
}

export function OrderFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData = {},
  title = 'Tạo đơn hàng mới',
  submitLabel = 'Tạo đơn hàng',
  loading = false
}: OrderFormDialogProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: initialData.customer_name || '',
    customer_email: initialData.customer_email || '',
    customer_phone: initialData.customer_phone || '',
    product_title: initialData.product_title || '',
    amount: initialData.amount || 0,
    status: initialData.status || 'pending',
    notes: initialData.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof OrderFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {title.includes('Tạo') ? 'Điền thông tin để tạo đơn hàng mới' : 'Cập nhật thông tin đơn hàng'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Tên khách hàng *</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => handleChange('customer_name', e.target.value)}
                placeholder="Nhập tên khách hàng"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer_email">Email *</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => handleChange('customer_email', e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_phone">Số điện thoại</Label>
            <Input
              id="customer_phone"
              value={formData.customer_phone}
              onChange={(e) => handleChange('customer_phone', e.target.value)}
              placeholder="Số điện thoại"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_title">Tên sản phẩm *</Label>
            <Input
              id="product_title"
              value={formData.product_title}
              onChange={(e) => handleChange('product_title', e.target.value)}
              placeholder="Tên sản phẩm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Số tiền *</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value as OrderFormData['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Ghi chú thêm..."
              rows={3}
            />
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
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
