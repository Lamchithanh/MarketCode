'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Database } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OrderViewDialog } from './order-view-dialog';
import { OrderEditDialog } from './order-edit-dialog';
import { OrderDeleteDialog } from './order-delete-dialog';
import { OrdersTable } from './orders-table-component';
import { OrdersPagination } from './orders-pagination';
import { OrderStatsCards } from './order-stats-cards';
import { OrderFilters, type OrderFilters as OrderFiltersType } from './order-filters';
import { useOrderStats } from '@/hooks/use-order-stats';
import { Order } from '@/lib/services/order-service';

export function OrdersManagementNew() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Sử dụng custom hook cho stats management
  const {
    stats,
    loading: statsLoading,
    fetchStats,
    refreshStats,
    optimisticUpdateStatus,
    revertOptimisticUpdate
  } = useOrderStats();
  const [filters, setFilters] = useState<OrderFiltersType>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Initial data fetch
  useEffect(() => {
    const initialFetch = async () => {
      await fetchOrders();
      await fetchStats(); // ✅ Sử dụng fetchStats từ hook
    };
    initialFetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh stats khi có thay đổi pagination hoặc filters
  useEffect(() => {
    // Chỉ refresh stats khi không phải lần load đầu tiên
    if (orders.length > 0) {
      const debounceTimer = setTimeout(() => {
        fetchStats(); // ✅ Sử dụng fetchStats từ hook
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  }, [pagination.page, JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch orders data with filters
  const fetchOrders = async (page = 1, limit = 20, appliedFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filter parameters
      if (appliedFilters.search && appliedFilters.search.trim()) {
        params.append('search', appliedFilters.search.trim());
      }
      if (appliedFilters.status) params.append('status', appliedFilters.status);
      if (appliedFilters.paymentStatus) params.append('paymentStatus', appliedFilters.paymentStatus);
      if (appliedFilters.paymentMethod) params.append('paymentMethod', appliedFilters.paymentMethod);
      if (appliedFilters.dateFrom) params.append('dateFrom', appliedFilters.dateFrom.toISOString());
      if (appliedFilters.dateTo) params.append('dateTo', appliedFilters.dateTo.toISOString());
      if (appliedFilters.minAmount) params.append('minAmount', appliedFilters.minAmount.toString());
      if (appliedFilters.maxAmount) params.append('maxAmount', appliedFilters.maxAmount.toString());
      
      const response = await fetch(`/api/admin/orders?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setOrders(data.orders || []);
      setPagination({
        page: data.page || 1,
        limit: data.limit || 20,
        total: data.total || 0,
        totalPages: data.totalPages || 0
      });
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Action handlers
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowViewDialog(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowEditDialog(true);
  };

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDeleteDialog(true);
  };

  // Handle status updates
  const handleUpdateStatus = async (orderId: string, status: string) => {
    // Tìm order cần update
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (!orderToUpdate) return;

    // Optimistically update stats using custom hook
    const oldStatus = orderToUpdate.status;
    optimisticUpdateStatus(oldStatus, status);

    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orderId,
          status,
        }),
      });

      if (!response.ok) {
        // Revert optimistic update nếu có lỗi
        revertOptimisticUpdate();
        throw new Error('Failed to update order status');
      }

      // Refresh both orders list and stats để đảm bảo chính xác
      await Promise.all([
        fetchOrders(pagination.page, pagination.limit),
        refreshStats()
      ]);
      toast.success('Trạng thái đơn hàng đã được cập nhật');
    } catch (error) {
      // Revert optimistic update nếu có lỗi
      revertOptimisticUpdate();
      console.error('Error updating order status:', error);
      toast.error('Không thể cập nhật trạng thái đơn hàng');
      throw error;
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orderId,
          paymentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      // Refresh both orders list and stats
      await fetchOrders(pagination.page, pagination.limit);
      await refreshStats(); // ✅ Sử dụng refreshStats từ hook
      toast.success('Trạng thái thanh toán đã được cập nhật');
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Không thể cập nhật trạng thái thanh toán');
      throw error;
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    // Hiển thị loading state trên stats cards
    setLoading(true);
    
    try {
      // Fetch cả orders và stats song song để nhanh hơn
      await Promise.all([
        fetchOrders(pagination.page, pagination.limit),
        refreshStats() // ✅ Sử dụng refreshStats từ hook
      ]);
      toast.success('Dữ liệu đã được làm mới');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Không thể làm mới dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: OrderFiltersType) => {
    setFilters(newFilters);
    fetchOrders(1, pagination.limit, newFilters); // Reset to page 1 when filters change
  };

  // Handle pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchOrders(page, pagination.limit);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button variant="ghost" size="sm" onClick={handleRefresh} className="ml-2">
              Thử lại
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Statistics */}
      <OrderStatsCards stats={stats} loading={statsLoading} />

      {/* Filters */}
      <OrderFilters onFiltersChange={handleFiltersChange} />

      {/* Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Database className="h-5 w-5 mr-2" />
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
            <>
              <OrdersTable
                orders={orders}
                loading={loading}
                onViewOrder={handleViewOrder}
                onEditOrder={handleEditOrder}
                onDeleteOrder={handleDeleteOrder}
                onUpdateStatus={handleUpdateStatus}
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
              />

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <OrdersPagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                  loading={loading}
                  onPageChange={goToPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <OrderViewDialog 
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        order={selectedOrder}
      />

      <OrderEditDialog 
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        order={selectedOrder}
        onOrderUpdated={async () => {
          await fetchOrders(pagination.page, pagination.limit);
          await fetchStats(); // ✅ Cập nhật stats khi order được update
        }}
      />

      <OrderDeleteDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        order={selectedOrder}
        onOrderDeleted={async () => {
          await fetchOrders(pagination.page, pagination.limit);
          await fetchStats(); // ✅ Cập nhật stats khi order được delete
        }}
      />
    </div>
  );
}
