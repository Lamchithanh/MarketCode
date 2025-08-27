import { useState, useEffect, useRef, useCallback } from 'react';

interface DashboardStats {
  totalUsers: number;
  deletedUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalDownloads: number;
  totalRevenue: number;
  averageRating: number;
  newsletterSubscribers: number;
  pendingMessages: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'product' | 'user' | 'review' | 'download';
  message: string;
  time: string;
  metadata?: Record<string, unknown>;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    deletedUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalDownloads: 0,
    totalRevenue: 0,
    averageRating: 0,
    newsletterSubscribers: 0,
    pendingMessages: 0,
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedFields, setUpdatedFields] = useState<Set<keyof DashboardStats>>(new Set());
  const previousStats = useRef<DashboardStats | null>(null);

  const compareStats = (newStats: DashboardStats, oldStats: DashboardStats | null): Set<keyof DashboardStats> => {
    if (!oldStats) return new Set();
    
    const updated = new Set<keyof DashboardStats>();
    (Object.keys(newStats) as Array<keyof DashboardStats>).forEach((key) => {
      if (newStats[key] !== oldStats[key]) {
        updated.add(key);
      }
    });
    return updated;
  };

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats from API
      const response = await fetch('/api/admin/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      
      const data = await response.json();
      
      // Compare with previous stats to detect changes
      const newUpdatedFields = compareStats(data.stats, previousStats.current);
      setUpdatedFields(newUpdatedFields);
      
      // Update stats and store previous values
      previousStats.current = { ...data.stats };
      setStats(data.stats);
      setRecentActivities(data.recentActivities || []);
      setError(null);

      // Clear updated fields after 6 seconds
      if (newUpdatedFields.size > 0) {
        setTimeout(() => {
          setUpdatedFields(new Set());
        }, 6000);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      
      // Fallback data if API fails
      setStats({
        totalUsers: 1234,
        deletedUsers: 100,
        totalProducts: 567,
        totalOrders: 89,
        totalDownloads: 45678,
        totalRevenue: 12345,
        averageRating: 4.8,
        newsletterSubscribers: 2345,
        pendingMessages: 12,
      });
      
      setRecentActivities([
        {
          id: '1',
          type: 'order',
          message: 'Đơn hàng mới #ORD-001 từ user@example.com',
          time: '2 phút trước',
        },
        {
          id: '2',
          type: 'product',
          message: 'Sản phẩm "React Admin Dashboard" đã được thêm',
          time: '15 phút trước',
        },
        {
          id: '3',
          type: 'user',
          message: 'Người dùng mới đã đăng ký: john@example.com',
          time: '1 giờ trước',
        },
        {
          id: '4',
          type: 'review',
          message: 'Đánh giá 5 sao cho sản phẩm "Vue.js Template"',
          time: '2 giờ trước',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchStats();
    
    // Set up auto refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    recentActivities,
    loading,
    error,
    updatedFields,
    refetch: fetchStats,
  };
}
