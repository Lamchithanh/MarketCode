'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName?: string;
  buyerEmail?: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onOrderDeleted: () => void;
}

export function OrderDeleteDialog({ open, onOpenChange, order, onOrderDeleted }: OrderDeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!order) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/orders?id=${order.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      
      toast.success('Đơn hàng đã được xóa thành công');
      onOrderDeleted();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Có lỗi xảy ra khi xóa đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <DialogTitle>Xác nhận xóa đơn hàng</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            Bạn có chắc chắn muốn xóa đơn hàng <strong>#{order?.orderNumber}</strong>?
            <br />
            <br />
            <span className="text-red-600 font-medium">
              ⚠️ Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn:
            </span>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
              <li>Thông tin đơn hàng</li>
              <li>Lịch sử thanh toán</li>
              <li>Dữ liệu liên quan</li>
            </ul>
          </DialogDescription>
        </DialogHeader>

        {order && (
          <div className="py-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mã đơn hàng:</span>
                <span className="font-mono">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Khách hàng:</span>
                <span>{order.buyerName || 'Không có thông tin'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tổng tiền:</span>
                <span className="font-medium">
                  {order.totalAmount.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Trạng thái:</span>
                <span>{order.status}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Đang xóa...' : 'Xóa đơn hàng'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
