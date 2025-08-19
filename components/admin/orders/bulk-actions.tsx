'use client';

import { useState } from 'react';
import { 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  CreditCard,
  Download,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface BulkActionsProps {
  orders: Order[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onBulkUpdateStatus?: (ids: string[], status: string) => Promise<void>;
  onBulkUpdatePaymentStatus?: (ids: string[], paymentStatus: string) => Promise<void>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  loading?: boolean;
}

export function BulkActions({
  orders,
  selectedIds,
  onSelectionChange,
  onBulkUpdateStatus,
  onBulkUpdatePaymentStatus,
  onBulkDelete,
  loading = false,
}: BulkActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isAllSelected = orders.length > 0 && selectedIds.length === orders.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(orders.map(order => order.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (!onBulkUpdateStatus || selectedIds.length === 0) return;
    
    setActionLoading(`status-${status}`);
    try {
      await onBulkUpdateStatus(selectedIds, status);
      toast.success(`Đã cập nhật trạng thái cho ${selectedIds.length} đơn hàng`);
      onSelectionChange([]);
    } catch {
      toast.error('Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkPaymentStatusUpdate = async (paymentStatus: string) => {
    if (!onBulkUpdatePaymentStatus || selectedIds.length === 0) return;
    
    setActionLoading(`payment-${paymentStatus}`);
    try {
      await onBulkUpdatePaymentStatus(selectedIds, paymentStatus);
      toast.success(`Đã cập nhật trạng thái thanh toán cho ${selectedIds.length} đơn hàng`);
      onSelectionChange([]);
    } catch {
      toast.error('Không thể cập nhật trạng thái thanh toán');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedIds.length === 0) return;
    
    setActionLoading('delete');
    try {
      await onBulkDelete(selectedIds);
      toast.success(`Đã xóa ${selectedIds.length} đơn hàng`);
      onSelectionChange([]);
    } catch {
      toast.error('Không thể xóa các đơn hàng đã chọn');
    } finally {
      setActionLoading(null);
      setShowDeleteDialog(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const selectedOrders = orders.filter(order => selectedIds.includes(order.id));
  const totalValue = selectedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  if (selectedIds.length === 0) {
    return (
      <div className="flex items-center space-x-2 py-2">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={handleSelectAll}
          disabled={loading}
        />
        <span className="text-sm text-muted-foreground">
          Chọn tất cả ({orders.length})
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            disabled={loading}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-900">
              Đã chọn {selectedIds.length} đơn hàng
            </span>
            <span className="text-xs text-blue-700">
              Tổng giá trị: {formatCurrency(totalValue)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Bulk status update */}
          <Select onValueChange={handleBulkStatusUpdate}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING" disabled={actionLoading === 'status-PENDING'}>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Chờ xử lý
                </div>
              </SelectItem>
              <SelectItem value="PROCESSING" disabled={actionLoading === 'status-PROCESSING'}>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Đang xử lý
                </div>
              </SelectItem>
              <SelectItem value="COMPLETED" disabled={actionLoading === 'status-COMPLETED'}>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Hoàn thành
                </div>
              </SelectItem>
              <SelectItem value="CANCELLED" disabled={actionLoading === 'status-CANCELLED'}>
                <div className="flex items-center">
                  <XCircle className="mr-2 h-4 w-4" />
                  Hủy đơn hàng
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Bulk payment status update */}
          <Select onValueChange={handleBulkPaymentStatusUpdate}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING" disabled={actionLoading === 'payment-PENDING'}>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Chờ thanh toán
                </div>
              </SelectItem>
              <SelectItem value="PAID" disabled={actionLoading === 'payment-PAID'}>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Đã thanh toán
                </div>
              </SelectItem>
              <SelectItem value="FAILED" disabled={actionLoading === 'payment-FAILED'}>
                <div className="flex items-center">
                  <XCircle className="mr-2 h-4 w-4" />
                  Thất bại
                </div>
              </SelectItem>
              <SelectItem value="REFUNDED" disabled={actionLoading === 'payment-REFUNDED'}>
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Đã hoàn tiền
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Export selected */}
          <Button 
            variant="outline" 
            size="sm"
            disabled={loading || actionLoading !== null}
          >
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>

          {/* Send email */}
          <Button 
            variant="outline" 
            size="sm"
            disabled={loading || actionLoading !== null}
          >
            <Mail className="mr-2 h-4 w-4" />
            Gửi email
          </Button>

          {/* Delete selected */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={loading || actionLoading !== null}
            className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa ({selectedIds.length})
          </Button>

          {/* Clear selection */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onSelectionChange([])}
            disabled={loading || actionLoading !== null}
          >
            Bỏ chọn
          </Button>
        </div>
      </div>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa {selectedIds.length} đơn hàng</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Bạn có chắc chắn muốn xóa <span className="font-semibold">{selectedIds.length}</span> đơn hàng đã chọn?
              </p>
              <p className="text-sm text-muted-foreground">
                Thao tác này không thể hoàn tác. Tất cả dữ liệu liên quan đến các đơn hàng này sẽ bị xóa vĩnh viễn.
              </p>
              
              <div className="bg-muted p-4 rounded-md text-sm space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Số lượng đơn hàng:</span>
                  <span>{selectedIds.length}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Tổng giá trị:</span>
                  <span>{formatCurrency(totalValue)}</span>
                </div>
                
                {selectedIds.length <= 5 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-muted-foreground mb-2">Đơn hàng sẽ bị xóa:</p>
                    {selectedOrders.map(order => (
                      <div key={order.id} className="flex justify-between text-xs">
                        <span>{order.orderNumber}</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading === 'delete'}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete}
              disabled={actionLoading === 'delete'}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading === 'delete' ? 'Đang xóa...' : `Xóa ${selectedIds.length} đơn hàng`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
