'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/services/user-service';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUsers();

    // Setup realtime subscription
    channelRef.current = supabase.channel('users-table-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'User',
        },
        (payload) => {
          console.log('🔴 REALTIME: User table changed!', payload);
          console.log('Event type:', payload.eventType);
          console.log('New record:', payload.new);
          console.log('Old record:', payload.old);
          
          // Refresh users list after any change
          setTimeout(() => {
            fetchUsers();
          }, 500);
        }
      )
      .subscribe((status) => {
        console.log('📡 Users realtime status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Users realtime ACTIVE');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Users realtime ERROR');
        }
      });

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}
