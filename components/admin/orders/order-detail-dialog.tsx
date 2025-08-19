'use client';

import { Order } from '@/lib/services/order-service';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailDialog({ order, open, onOpenChange }: OrderDetailDialogProps) {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'COMPLETED': { class: 'bg-green-100 text-green-800', label: 'Hoàn thành' },
      'PROCESSING': { class: 'bg-blue-100 text-blue-800', label: 'Đang xử lý' },
      'PENDING': { class: 'bg-yellow-100 text-yellow-800', label: 'Chờ xử lý' },
      'CANCELLED': { class: 'bg-red-100 text-red-800', label: 'Đã hủy' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return config ? (
      <Badge className={`${config.class} hover:${config.class}`}>
        {config.label}
      </Badge>
    ) : <Badge variant="secondary">{status}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      'PAID': { class: 'bg-green-100 text-green-800', label: 'Đã thanh toán' },
      'PENDING': { class: 'bg-yellow-100 text-yellow-800', label: 'Chờ thanh toán' },
      'FAILED': { class: 'bg-red-100 text-red-800', label: 'Thất bại' },
      'REFUNDED': { class: 'bg-gray-100 text-gray-800', label: 'Đã hoàn tiền' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return config ? (
      <Badge className={`${config.class} hover:${config.class}`}>
        {config.label}
      </Badge>
    ) : <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Chi tiết đơn hàng
            <div className="flex space-x-2">
              {getStatusBadge(order.status)}
              {getPaymentStatusBadge(order.paymentStatus)}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mã đơn hàng</p>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-mono text-xs">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                  <p className="font-medium">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tên khách hàng</p>
                  <p className="font-medium">{order.buyerName || 'Không có thông tin'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{order.buyerEmail || 'Không có thông tin'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">ID khách hàng</p>
                  <p className="font-mono text-xs">{order.buyerId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                  <p className="font-medium capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>
                {order.paymentId && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">ID thanh toán</p>
                    <p className="font-mono text-xs">{order.paymentId}</p>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Tổng tiền hàng:</span>
                  <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                </div>
                {order.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Giảm giá:</span>
                    <span className="font-medium text-green-600">-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                {order.taxAmount && order.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Thuế:</span>
                    <span className="font-medium">{formatCurrency(order.taxAmount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(order.totalAmount + (order.taxAmount || 0) - (order.discountAmount || 0))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Status History would go here if we had it */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
