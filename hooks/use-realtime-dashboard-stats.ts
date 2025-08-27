'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

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

export function useRealtimeDashboardStats() {
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
  const channelRef = useRef<RealtimeChannel | null>(null);

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

  const fetchInitialStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/dashboard/stats');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const newUpdatedFields = compareStats(data.stats, previousStats.current);
      previousStats.current = data.stats;
      
      setStats(data.stats);
      setRecentActivities(data.recentActivities || []);
      setUpdatedFields(newUpdatedFields);

      // Clear updated fields after 5 seconds
      if (newUpdatedFields.size > 0) {
        setTimeout(() => {
          setUpdatedFields(new Set());
        }, 5000);
      }
    } catch (err) {
      console.error('Error fetching initial dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      
      // Fallback data if API fails
      setStats({
        totalUsers: 6,
        deletedUsers: 3,
        totalProducts: 4,
        totalOrders: 7,
        totalDownloads: 6,
        totalRevenue: 29.99,
        averageRating: 4.0,
        newsletterSubscribers: 0,
        pendingMessages: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const setupRealtimeSubscriptions = useCallback(() => {
    // Cleanup existing subscription
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }

    // Create new realtime channel focused on User table for testing
    channelRef.current = supabase.channel('dashboard-users-realtime')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'User' 
        },
        (payload) => {
          console.log('🔴 REALTIME: User table change detected:', payload);
          console.log('Event:', payload.eventType);
          console.log('Table:', payload.table);
          
          // Add a small delay to ensure database consistency
          setTimeout(() => {
            console.log('🔄 Refreshing dashboard stats...');
            fetchInitialStats();
          }, 1000);
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime dashboard subscriptions ACTIVE');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime dashboard subscription ERROR');
          setError('Realtime connection error');
        } else if (status === 'TIMED_OUT') {
          console.warn('⚠️ Realtime subscription TIMED OUT');
          setError('Realtime connection timeout');
        } else if (status === 'CLOSED') {
          console.warn('🔒 Realtime subscription CLOSED');
        }
      });
  }, [fetchInitialStats]);

  useEffect(() => {
    // Fetch initial data
    fetchInitialStats();
    
    // Setup realtime subscriptions
    setupRealtimeSubscriptions();
    
    return () => {
      // Cleanup subscription on unmount
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [fetchInitialStats, setupRealtimeSubscriptions]);

  return {
    stats,
    recentActivities,
    loading,
    error,
    updatedFields,
    refetch: fetchInitialStats,
  };
}
