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

  // Payment status badge
  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'secondary' as const, label: 'Chờ thanh toán', className: 'bg-yellow-100 text-yellow-800' },
      PAID: { variant: 'default' as const, label: 'Đã thanh toán', className: 'bg-green-100 text-green-800' },
      FAILED: { variant: 'destructive' as const, label: 'Thất bại', className: '' },
      REFUNDED: { variant: 'secondary' as const, label: 'Đã hoàn tiền', className: '' },
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
      currency: 'VND',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Chi tiết đơn hàng
            {order && getStatusBadge(order.status)}
          </DialogTitle>
          <DialogDescription>
            {order ? `Thông tin chi tiết của đơn hàng #${order.orderNumber}` : 'Đang tải thông tin...'}
          </DialogDescription>
        </DialogHeader>

        {order && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Mã đơn hàng</label>
                <p className="font-mono font-medium">{order.orderNumber}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Ngày tạo</label>
                <p>{formatDate(order.createdAt)}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Khách hàng</label>
                <div>
                  <p className="font-medium">{order.buyerName || 'N/A'}</p>
                  {order.buyerEmail && (
                    <p className="text-sm text-muted-foreground">{order.buyerEmail}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Trạng thái đơn hàng</label>
                <div>{getStatusBadge(order.status)}</div>
              </div>
            </div>

            <Separator />

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Thông tin thanh toán</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Trạng thái thanh toán</label>
                  <div>{getPaymentStatusBadge(order.paymentStatus)}</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Phương thức thanh toán</label>
                  <p className="capitalize">{order.paymentMethod || 'N/A'}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Financial Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Chi tiết tài chính</h3>
              <div className="space-y-3 bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tổng tiền hàng:</span>
                  <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
                </div>

                {order.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="text-sm font-medium">Giảm giá:</span>
                    <span className="font-semibold">-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}

                {order.taxAmount && order.taxAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Thuế:</span>
                    <span className="font-semibold">+{formatCurrency(order.taxAmount)}</span>
                  </div>
                )}

                <Separator />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Tổng cộng:</span>
                  <span className="font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
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
