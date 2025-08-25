'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Order } from '@/lib/services/order-service';

const orderEditSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  totalAmount: z.number().positive('Total amount must be positive'),
  discountAmount: z.number().min(0, 'Discount cannot be negative').optional(),
  taxAmount: z.number().min(0, 'Tax cannot be negative').optional(),
  notes: z.string().optional(),
});

type OrderEditFormData = z.infer<typeof orderEditSchema>;

interface OrderEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onOrderUpdated: () => void;
}

export function OrderEditDialog({ open, onOpenChange, order, onOrderUpdated }: OrderEditDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<OrderEditFormData>({
    resolver: zodResolver(orderEditSchema),
    defaultValues: {
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod: '',
      totalAmount: 0,
      discountAmount: 0,
      taxAmount: 0,
      notes: '',
    },
  });

  // Reset form when order changes
  useEffect(() => {
    if (order) {
      form.reset({
        status: order.status as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED',
        paymentStatus: order.paymentStatus as 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED',
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        discountAmount: order.discountAmount || 0,
        taxAmount: order.taxAmount || 0,
        notes: order.notes || '',
      });
    }
  }, [order, form]);

  const onSubmit = async (data: OrderEditFormData) => {
    if (!order) return;

    setLoading(true);
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: order.id,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      toast.success('Đơn hàng đã được cập nhật thành công');
      onOrderUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Có lỗi xảy ra khi cập nhật đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa đơn hàng</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin đơn hàng #{order?.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Order Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái đơn hàng</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                        <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                        <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                        <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Status */}
              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái thanh toán</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái thanh toán" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                        <SelectItem value="PAID">Đã thanh toán</SelectItem>
                        <SelectItem value="FAILED">Thất bại</SelectItem>
                        <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phương thức thanh toán</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phương thức" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="momo">MoMo</SelectItem>
                        <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                        <SelectItem value="cash">Tiền mặt</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Total Amount */}
              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tổng tiền (₫)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Discount Amount */}
              <FormField
                control={form.control}
                name="discountAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giảm giá (₫)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tax Amount */}
              <FormField
                control={form.control}
                name="taxAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thuế (₫)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập ghi chú cho đơn hàng..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
