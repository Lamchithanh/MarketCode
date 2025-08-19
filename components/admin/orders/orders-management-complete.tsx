// Order management component with CRUD operations
'use client';

import { useState } from 'react';
import { RefreshCw, Database, Plus } from 'lucide-react';
import { OrdersStats } from './orders-stats';
import { OrdersFilters } from './orders-filters';
import { BulkActions } from './bulk-actions';
import { OrderActions } from './order-actions';
import { OrderDetailDialog } from './order-detail-dialog';
import { OrderFormDialog } from './temp-order-form';
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
import { useOrders } from '@/hooks/use-orders';
import { toast } from 'sonner';
import { Order, CreateOrderData, UpdateOrderData } from '@/lib/services/order-service';

interface OrderFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  buyerId?: string;
}

export function OrdersManagementNew() {
  const {
    orders,
    stats,
    pagination,
    loading,
    error,
    refreshOrders,
    updateOrder,
    deleteOrder
  } = useOrders();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<OrderFilters>({});
  
  // Dialog states
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  // Filter orders based on current filters
  const filteredOrders = orders.filter((order) => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        (order.buyerName || '').toLowerCase().includes(searchTerm) ||
        (order.buyerEmail || '').toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    if (filters.status && order.status !== filters.status) return false;
    if (filters.paymentStatus && order.paymentStatus !== filters.paymentStatus) return false;
    if (filters.buyerId && order.buyerId !== filters.buyerId) return false;

    if (filters.dateFrom) {
      const orderDate = new Date(order.createdAt);
      const fromDate = new Date(filters.dateFrom);
      if (orderDate < fromDate) return false;
    }

    if (filters.dateTo) {
      const orderDate = new Date(order.createdAt);
      const toDate = new Date(filters.dateTo);
      if (orderDate > toDate) return false;
    }

    if (filters.minAmount && order.totalAmount < filters.minAmount) return false;
    if (filters.maxAmount && order.totalAmount > filters.maxAmount) return false;

    return true;
  });

  const handleOrderSelection = (orderId: string, selected: boolean) => {
    if (selected) {
      setSelectedIds(prev => [...prev, orderId]);
    } else {
      setSelectedIds(prev => prev.filter(id => id !== orderId));
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrder(orderId, { 
        status: status as 'COMPLETED' | 'PROCESSING' | 'PENDING' | 'CANCELLED'
      });
      toast.success('Cập nhật trạng thái thành công');
    } catch {
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      await updateOrder(orderId, { 
        paymentStatus: paymentStatus as 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
      });
      toast.success('Cập nhật trạng thái thanh toán thành công');
    } catch {
      toast.error('Không thể cập nhật trạng thái thanh toán');
    }
  };

  const handleBulkUpdateStatus = async (ids: string[], status: string) => {
    const promises = ids.map(id => updateOrder(id, { 
      status: status as 'COMPLETED' | 'PROCESSING' | 'PENDING' | 'CANCELLED'
    }));
    await Promise.all(promises);
  };

  const handleBulkUpdatePaymentStatus = async (ids: string[], paymentStatus: string) => {
    const promises = ids.map(id => updateOrder(id, { 
      paymentStatus: paymentStatus as 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
    }));
    await Promise.all(promises);
  };

  const handleBulkDelete = async (ids: string[]) => {
    const promises = ids.map(id => deleteOrder(id));
    await Promise.all(promises);
  };

  const handleDeleteOrder = async (order: Order) => {
    try {
      await deleteOrder(order.id);
      toast.success('Xóa đơn hàng thành công');
    } catch {
      toast.error('Không thể xóa đơn hàng');
    }
  };

  // Dialog handlers
  const handleViewOrder = (order: Order) => {
    setDetailOrder(order);
  };

  const handleEditOrder = (order: Order) => {
    setEditOrder(order);
  };

  const handleCreateOrder = async (data: CreateOrderData) => {
    try {
      setFormLoading(true);
      const response = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      await refreshOrders();
      toast.success('Tạo đơn hàng thành công');
    } catch (error) {
      console.error('Create order error:', error);
      toast.error(`Lỗi tạo đơn hàng: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateOrderForm = async (data: UpdateOrderData) => {
    if (!editOrder) return;
    
    try {
      setFormLoading(true);
      await updateOrder(editOrder.id, data);
      setEditOrder(null);
      toast.success('Cập nhật đơn hàng thành công');
    } catch (error) {
      console.error('Update order error:', error);
      toast.error(`Lỗi cập nhật đơn hàng: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormSubmit = async (data: CreateOrderData | UpdateOrderData) => {
    if (editOrder) {
      // Edit mode
      return handleUpdateOrderForm(data as UpdateOrderData);
    } else {
      // Create mode  
      return handleCreateOrder(data as CreateOrderData);
    }
  };

  const resetFilters = () => {
    setFilters({});
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Có lỗi xảy ra khi tải dữ liệu: {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshOrders}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tất cả đơn hàng trong hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshOrders} disabled={loading} variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo đơn hàng
          </Button>
        </div>
      </div>

      {/* Stats */}
      <OrdersStats stats={stats} loading={loading} />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bộ lọc và tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <BulkActions
          orders={filteredOrders}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onBulkUpdateStatus={handleBulkUpdateStatus}
          onBulkUpdatePaymentStatus={handleBulkUpdatePaymentStatus}
          onBulkDelete={handleBulkDelete}
          loading={loading}
        />
      )}

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách đơn hàng</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Database className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Không có đơn hàng</h3>
              <p className="mt-2 text-muted-foreground">
                {Object.keys(filters).length > 0
                  ? 'Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại.'
                  : 'Chưa có đơn hàng nào trong hệ thống.'
                }
              </p>
              {Object.keys(filters).length > 0 && (
                <Button variant="outline" onClick={resetFilters} className="mt-4">
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        {selectedIds.length === 0 ? (
                          <BulkActions
                            orders={filteredOrders}
                            selectedIds={selectedIds}
                            onSelectionChange={setSelectedIds}
                            loading={loading}
                          />
                        ) : (
                          <Checkbox
                            checked={selectedIds.length === filteredOrders.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedIds(filteredOrders.map(o => o.id));
                              } else {
                                setSelectedIds([]);
                              }
                            }}
                          />
                        )}
                      </TableHead>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thanh toán</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(order.id)}
                            onCheckedChange={(checked) => 
                              handleOrderSelection(order.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {order.buyerName || 'N/A'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.buyerEmail || 'N/A'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                        <TableCell>
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <OrderActions
                            order={order}
                            onView={handleViewOrder}
                            onEdit={handleEditOrder}
                            onDelete={handleDeleteOrder}
                            onUpdateStatus={handleUpdateOrderStatus}
                            onUpdatePaymentStatus={handleUpdatePaymentStatus}
                            loading={loading}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            // Handle previous page
                          }}
                        />
                      </PaginationItem>
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === pagination.page}
                            onClick={(e) => {
                              e.preventDefault();
                              // Handle page change
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            // Handle next page
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <OrderDetailDialog 
        order={detailOrder}
        open={!!detailOrder}
        onOpenChange={(open) => !open && setDetailOrder(null)}
      />
      
      <OrderFormDialog 
        order={editOrder}
        open={!!editOrder}
        onOpenChange={(open) => !open && setEditOrder(null)}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
      
      <OrderFormDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
    </div>
  );
}
