'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName?: string;
  buyerEmail?: string;
  totalAmount: number;
  discountAmount?: number;
  taxAmount?: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export function OrderViewDialog({ open, onOpenChange, order }: OrderViewDialogProps) {
  // Status badge component
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'secondary' as const, label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800' },
      PROCESSING: { variant: 'default' as const, label: 'Đang xử lý', className: 'bg-blue-100 text-blue-800' },
      COMPLETED: { variant: 'default' as const, label: 'Hoàn thành', className: 'bg-green-100 text-green-800' },
      CANCELLED: { variant: 'destructive' as const, label: 'Đã hủy', className: '' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // Payment status badge component  
  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'secondary' as const, label: 'Chờ thanh toán', className: 'bg-yellow-100 text-yellow-800' },
      PAID: { variant: 'default' as const, label: 'Đã thanh toán', className: 'bg-green-100 text-green-800' },
      FAILED: { variant: 'destructive' as const, label: 'Thanh toán thất bại', className: '' },
      REFUNDED: { variant: 'outline' as const, label: 'Đã hoàn tiền', className: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Chi tiết đơn hàng</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về đơn hàng #{order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        {order && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Thông tin đơn hàng</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã đơn hàng:</span>
                    <span className="font-medium">#{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày tạo:</span>
                    <span className="font-medium">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cập nhật:</span>
                    <span className="font-medium">{formatDate(order.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Thông tin khách hàng</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-medium">{order.buyerId}</span>
                  </div>
                  {order.buyerName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tên:</span>
                      <span className="font-medium">{order.buyerName}</span>
                    </div>
                  )}
                  {order.buyerEmail && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{order.buyerEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Thông tin thanh toán</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phương thức:</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                  {order.paymentId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mã GD:</span>
                      <span className="font-medium font-mono text-xs">{order.paymentId}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tổng tiền:</span>
                    <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  {order.discountAmount && order.discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giảm giá:</span>
                      <span className="font-medium text-green-600">-{formatCurrency(order.discountAmount)}</span>
                    </div>
                  )}
                  {order.taxAmount && order.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Thuế:</span>
                      <span className="font-medium">{formatCurrency(order.taxAmount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thành tiền:</span>
                    <span className="font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ghi chú</h3>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
