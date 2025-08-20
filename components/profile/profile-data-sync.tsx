"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/hooks/use-user';

export function ProfileDataSync() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to User table changes
    const channel = supabase
      .channel('user_profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'User',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Profile updated in database:', payload);
          // Refresh the page to show updated data
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, router]);

  return null; // This is a data-only component
}
