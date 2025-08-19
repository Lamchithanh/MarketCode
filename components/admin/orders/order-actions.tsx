'use client';

import { useState } from 'react';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Order } from '@/lib/services/order-service';

interface OrderActionsProps {
  order: Order;
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDelete?: (order: Order) => void;
  onUpdateStatus?: (orderId: string, status: string) => Promise<void>;
  onUpdatePaymentStatus?: (orderId: string, paymentStatus: string) => Promise<void>;
  loading?: boolean;
}

export function OrderActions({
  order,
  onView,
  onEdit,
  onDelete,
  onUpdateStatus,
  onUpdatePaymentStatus,
  loading = false,
}: OrderActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleCopyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      toast.success('Đã sao chép mã đơn hàng');
    } catch {
      toast.error('Không thể sao chép mã đơn hàng');
    }
  };

  const handleDownloadInvoice = () => {
    // TODO: Implement invoice download
    toast.info('Tính năng tải hóa đơn đang được phát triển');
  };

  const handleUpdateStatus = async (status: string) => {
    if (!onUpdateStatus) return;
    
    setActionLoading(`status-${status}`);
    try {
      await onUpdateStatus(order.id, status);
      toast.success('Đã cập nhật trạng thái đơn hàng');
    } catch {
      toast.error('Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdatePaymentStatus = async (paymentStatus: string) => {
    if (!onUpdatePaymentStatus) return;
    
    setActionLoading(`payment-${paymentStatus}`);
    try {
      await onUpdatePaymentStatus(order.id, paymentStatus);
      toast.success('Đã cập nhật trạng thái thanh toán');
    } catch {
      toast.error('Không thể cập nhật trạng thái thanh toán');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(order);
    }
    setShowDeleteDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            disabled={loading || actionLoading !== null}
          >
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{order.orderNumber}</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* View & Edit Actions */}
          <DropdownMenuItem onClick={() => onView?.(order)}>
            <Eye className="mr-2 h-4 w-4" />
            Xem chi tiết
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onEdit?.(order)}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Status Update Actions */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Cập nhật trạng thái</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem 
                onClick={() => handleUpdateStatus('PENDING')}
                disabled={order.status === 'PENDING' || actionLoading === 'status-PENDING'}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Chờ xử lý
                </div>
                {order.status === 'PENDING' && (
                  <Badge className={getStatusColor('PENDING')} variant="secondary">
                    Hiện tại
                  </Badge>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleUpdateStatus('PROCESSING')}
                disabled={order.status === 'PROCESSING' || actionLoading === 'status-PROCESSING'}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Đang xử lý
                </div>
                {order.status === 'PROCESSING' && (
                  <Badge className={getStatusColor('PROCESSING')} variant="secondary">
                    Hiện tại
                  </Badge>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleUpdateStatus('COMPLETED')}
                disabled={order.status === 'COMPLETED' || actionLoading === 'status-COMPLETED'}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Hoàn thành
                </div>
                {order.status === 'COMPLETED' && (
                  <Badge className={getStatusColor('COMPLETED')} variant="secondary">
                    Hiện tại
                  </Badge>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleUpdateStatus('CANCELLED')}
                disabled={order.status === 'CANCELLED' || actionLoading === 'status-CANCELLED'}
                className="flex items-center justify-between text-red-600"
              >
                <div className="flex items-center">
                  <XCircle className="mr-2 h-4 w-4" />
                  Hủy đơn hàng
                </div>
                {order.status === 'CANCELLED' && (
                  <Badge className={getStatusColor('CANCELLED')} variant="secondary">
                    Hiện tại
                  </Badge>
                )}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Payment Status Update Actions */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Cập nhật thanh toán</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem 
                onClick={() => handleUpdatePaymentStatus('PENDING')}
                disabled={order.paymentStatus === 'PENDING' || actionLoading === 'payment-PENDING'}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Chờ thanh toán
                </div>
                {order.paymentStatus === 'PENDING' && (
                  <Badge className={getPaymentStatusColor('PENDING')} variant="secondary">
                    Hiện tại
                  </Badge>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleUpdatePaymentStatus('PAID')}
                disabled={order.paymentStatus === 'PAID' || actionLoading === 'payment-PAID'}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Đã thanh toán
                </div>
                {order.paymentStatus === 'PAID' && (
                  <Badge className={getPaymentStatusColor('PAID')} variant="secondary">
                    Hiện tại
                  </Badge>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleUpdatePaymentStatus('FAILED')}
                disabled={order.paymentStatus === 'FAILED' || actionLoading === 'payment-FAILED'}
                className="flex items-center justify-between text-red-600"
              >
                <div className="flex items-center">
                  <XCircle className="mr-2 h-4 w-4" />
                  Thất bại
                </div>
                {order.paymentStatus === 'FAILED' && (
                  <Badge className={getPaymentStatusColor('FAILED')} variant="secondary">
                    Hiện tại
                  </Badge>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleUpdatePaymentStatus('REFUNDED')}
                disabled={order.paymentStatus === 'REFUNDED' || actionLoading === 'payment-REFUNDED'}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Đã hoàn tiền
                </div>
                {order.paymentStatus === 'REFUNDED' && (
                  <Badge className={getPaymentStatusColor('REFUNDED')} variant="secondary">
                    Hiện tại
                  </Badge>
                )}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* Utility Actions */}
          <DropdownMenuItem onClick={handleCopyOrderNumber}>
            <Copy className="mr-2 h-4 w-4" />
            Sao chép mã đơn hàng
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDownloadInvoice}>
            <Download className="mr-2 h-4 w-4" />
            Tải hóa đơn PDF
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete Action */}
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa đơn hàng
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa đơn hàng</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Bạn có chắc chắn muốn xóa đơn hàng{' '}
                <span className="font-semibold">{order.orderNumber}</span>?
              </p>
              <p className="text-sm text-muted-foreground">
                Thao tác này không thể hoàn tác. Tất cả dữ liệu liên quan đến đơn hàng sẽ bị xóa vĩnh viễn.
              </p>
              <div className="bg-muted p-3 rounded-md text-sm">
                <div className="flex justify-between">
                  <span>Mã đơn hàng:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Khách hàng:</span>
                  <span className="font-medium">{order.buyerName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tổng tiền:</span>
                  <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa đơn hàng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
