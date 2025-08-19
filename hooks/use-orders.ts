import { useState, useEffect, useCallback } from 'react';
import { Order, OrderFilters, OrderStats, UpdateOrderData } from '@/lib/services/order-service';

export interface UseOrdersOptions {
  initialFilters?: OrderFilters;
}

export interface UseOrdersReturn {
  // Data
  orders: Order[];
  selectedOrder: Order | null;
  stats: OrderStats | null;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Filters
  filters: OrderFilters;
  
  // Loading states
  loading: boolean;
  statsLoading: boolean;
  actionLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  updateOrder: (id: string, updateData: UpdateOrderData) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  
  // State management
  setSelectedOrder: (order: Order | null) => void;
  updateFilters: (newFilters: Partial<OrderFilters>) => void;
  resetFilters: () => void;
  clearError: () => void;
  refreshOrders: () => Promise<void>;
  goToPage: (page: number) => void;
  changeLimit: (limit: number) => void;
}

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const DEFAULT_FILTERS: OrderFilters = {
  page: 1,
  limit: 10,
};

export function useOrders(options: UseOrdersOptions = {}): UseOrdersReturn {
  const { initialFilters = DEFAULT_FILTERS } = options;
  
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<OrderFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch orders
  const fetchOrders = useCallback(async (currentFilters: OrderFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      // Add filter params
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/admin/orders?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      
      setOrders(data.orders || []);
      setPagination(data.pagination || DEFAULT_PAGINATION);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      
      const response = await fetch('/api/admin/orders/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch order stats');
      }
      
      const data = await response.json();
      setStats(data);
      
    } catch (err) {
      console.error('Error fetching order stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);
  
  // Update order
  const updateOrder = useCallback(async (id: string, updateData: UpdateOrderData) => {
    try {
      console.log('Updating order:', { id, updateData });
      setActionLoading(true);
      
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      console.log('Update response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Update failed:', errorData);
        throw new Error(errorData.error || `Failed to update order (${response.status})`);
      }
      
      const result = await response.json();
      console.log('Update successful:', result);
      
      // Refresh orders list
      await fetchOrders();
      await fetchStats();
      
    } catch (err) {
      console.error('Error updating order:', err);
      setError(err instanceof Error ? err.message : 'Failed to update order');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [fetchOrders, fetchStats]);
  
  // Delete order
  const deleteOrder = useCallback(async (id: string) => {
    try {
      setActionLoading(true);
      
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      
      // Refresh orders list
      await fetchOrders();
      await fetchStats();
      
    } catch (err) {
      console.error('Error deleting order:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete order');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [fetchOrders, fetchStats]);
  
  // Filter management
  const updateFilters = useCallback((newFilters: Partial<OrderFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }; // Reset to first page
    setFilters(updatedFilters);
    fetchOrders(updatedFilters);
  }, [filters, fetchOrders]);
  
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    fetchOrders(DEFAULT_FILTERS);
  }, [fetchOrders]);
  
  // Pagination
  const goToPage = useCallback((page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchOrders(newFilters);
  }, [filters, fetchOrders]);
  
  const changeLimit = useCallback((limit: number) => {
    const newFilters = { ...filters, limit, page: 1 };
    setFilters(newFilters);
    fetchOrders(newFilters);
  }, [filters, fetchOrders]);
  
  // Utils
  const refreshOrders = useCallback(async () => {
    await Promise.all([fetchOrders(), fetchStats()]);
  }, [fetchOrders, fetchStats]);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // Effects
  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [fetchOrders, fetchStats]);
  
  return {
    // Data
    orders,
    selectedOrder,
    stats,
    pagination,
    filters,
    
    // Loading states  
    loading,
    statsLoading,
    actionLoading,
    error,
    
    // Actions
    updateOrder,
    deleteOrder,
    
    // State management
    setSelectedOrder,
    updateFilters,
    resetFilters,
    clearError,
    refreshOrders,
    goToPage,
    changeLimit,
  };
}
