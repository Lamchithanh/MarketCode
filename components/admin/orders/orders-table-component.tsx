'use client';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OrderActions } from './order-actions';
import { Order } from '@/lib/services/order-service';

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onViewOrder: (order: Order) => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
  onUpdateStatus?: (orderId: string, status: string) => Promise<void>;
  onUpdatePaymentStatus?: (orderId: string, paymentStatus: string) => Promise<void>;
}

export function OrdersTable({ 
  orders, 
  loading, 
  onViewOrder, 
  onEditOrder, 
  onDeleteOrder,
  onUpdateStatus,
  onUpdatePaymentStatus
}: OrdersTableProps) {
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
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn hàng</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thanh toán</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Sản phẩm</TableHead>
            <TableHead className="w-[70px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                {order.orderNumber}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.buyerName}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.buyerEmail}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(order.status)}
              </TableCell>
              <TableCell>
                {getPaymentStatusBadge(order.paymentStatus)}
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(order.totalAmount)}
              </TableCell>
              <TableCell className="text-sm">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {order.itemCount} sản phẩm
                </Badge>
              </TableCell>
              <TableCell>
                <OrderActions
                  order={order}
                  onView={onViewOrder}
                  onEdit={onEditOrder}
                  onDelete={onDeleteOrder}
                  onUpdateStatus={onUpdateStatus}
                  onUpdatePaymentStatus={onUpdatePaymentStatus}
                  loading={loading}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
