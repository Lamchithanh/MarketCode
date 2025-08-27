import { useState, useCallback, useRef } from 'react';

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
  todayOrders: number;
}

export function useOrderStats() {
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
    todayOrders: 0
  });
  const [loading, setLoading] = useState(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders/stats');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setStats(result.data);
        } else {
          console.error('Invalid API response:', result);
        }
      }
    } catch (err) {
      console.error('Error fetching order stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced refresh để tránh gọi API quá nhiều
  const refreshStats = useCallback((delay = 500) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    refreshTimeoutRef.current = setTimeout(() => {
      fetchStats();
    }, delay);
  }, [fetchStats]);

  // Optimistic update cho status changes
  const optimisticUpdateStatus = useCallback((fromStatus: string, toStatus: string) => {
    setStats(prevStats => {
      const newStats = { ...prevStats };
      
      // Giảm count của status cũ
      const fromKey = fromStatus.toLowerCase() as keyof OrderStats;
      if (fromKey in newStats && typeof newStats[fromKey] === 'number') {
        (newStats[fromKey] as number) = Math.max(0, (newStats[fromKey] as number) - 1);
      }
      
      // Tăng count của status mới
      const toKey = toStatus.toLowerCase() as keyof OrderStats;
      if (toKey in newStats && typeof newStats[toKey] === 'number') {
        (newStats[toKey] as number)++;
      }
      
      return newStats;
    });
  }, []);

  // Revert optimistic update
  const revertOptimisticUpdate = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    fetchStats,
    refreshStats,
    optimisticUpdateStatus,
    revertOptimisticUpdate,
    setStats // For manual updates
  };
}
