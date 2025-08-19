'use client';

import { useState } from 'react';
import { RefreshCw, MoreHorizontal, Edit, Eye, Trash2, Database, Plus } from 'lucide-react';
import { OrdersHeader } from './orders-header';
import { OrdersStats } from './orders-stats';
import { OrdersFilters } from './orders-filters';
import { BulkActions } from './bulk-actions';
import { OrderActions } from './order-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { OrderViewDialog } from './order-view-dialog';
import { OrderFormDialog } from './order-form-dialog';
import { OrderDeleteDialog } from './order-delete-dialog';
import { useOrders } from '@/hooks/use-orders';
import { toast } from 'sonner';
import { Order } from '@/lib/services/order-service';

export function OrdersManagement() {
  const {
    orders,
    selectedOrder,
    stats,
    pagination,
    filters,
    loading,
    statsLoading,
    actionLoading,
    error,
    updateOrder,
    deleteOrder,
    setSelectedOrder,
    updateFilters,
    resetFilters,
    clearError,
    refreshOrders,
    goToPage,
    changeLimit,
  } = useOrders({
    initialFilters: {
      page: 1,
      limit: 10,
    },
  });

  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  // Handle actions
  const handleAddOrder = () => {
    setSelectedOrder(null);
    setIsFormDialogOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsFormDialogOpen(true);
  };

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleSaveOrder = async (orderData: any) => {
    try {
      if (orderData.id) {
        // Update existing order
        await updateOrder(orderData.id, {
          status: orderData.status,
          paymentStatus: orderData.paymentStatus,
          paymentMethod: orderData.paymentMethod,
          notes: orderData.notes,
        });
        toast.success('Cập nhật đơn hàng thành công');
      }
      setSelectedOrder(null);
      setIsFormDialogOpen(false);
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Lỗi khi lưu đơn hàng');
    }
  };

  const handleConfirmDelete = async (orderToDelete: Order) => {
    try {
      await deleteOrder(orderToDelete.id);
      toast.success('Xóa đơn hàng thành công');
      setSelectedOrder(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Lỗi khi xóa đơn hàng');
    }
  };

  // Handle search and filters
  const handleSearch = (searchTerm: string) => {
    updateFilters({ search: searchTerm });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    updateFilters({ [filterType]: value });
  };

  const handleRefresh = () => {
    refreshOrders();
    toast.success('Dữ liệu đã được làm mới');
  };

  return (
    <div className="space-y-6">
      <OrdersHeader onAddOrder={handleAddOrder} />
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button variant="ghost" size="sm" onClick={clearError} className="ml-2">
              Đóng
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <OrdersStats 
        stats={stats} 
        loading={statsLoading} 
      />

      <OrdersSearch
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        filters={filters}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Danh sách đơn hàng ({pagination.total})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // TODO: Export functionality
                toast.info('Chức năng xuất dữ liệu sẽ được thêm sau');
              }}
            >
              <Database className="h-4 w-4 mr-2" />
              Xuất dữ liệu
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Đang tải dữ liệu...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Không có đơn hàng nào</p>
            </div>
          ) : (
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              disabled={actionLoading}
                            >
                              <span className="sr-only">Mở menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteOrder(order)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Hiển thị {orders.length} trong tổng số {pagination.total} đơn hàng
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page <= 1 || loading}
                >
                  Trước
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === pagination.totalPages || 
                      Math.abs(page - pagination.page) <= 2
                    )
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-sm text-muted-foreground">...</span>
                        )}
                        <Button
                          variant={page === pagination.page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          disabled={loading}
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || loading}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <OrderViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        order={selectedOrder}
      />

      <OrderFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        order={selectedOrder}
        onSave={handleSaveOrder}
      />

      <OrderDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        order={selectedOrder}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
