'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/hooks/use-user';

export interface UserDownload {
  id: string;
  productId: string;
  productName: string;
  productThumbnail: string;
  githubUrl: string;
  downloadDate: string;
  ipAddress: string;
}

export function useUserDownloads() {
  const [downloads, setDownloads] = useState<UserDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const fetchUserDownloads = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/downloads/user/${user.id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch downloads');
      }

      setDownloads(result.data || []);
    } catch (err) {
      console.error('Error fetching user downloads:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch downloads');
      setDownloads([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUserDownloads();
  }, [fetchUserDownloads]);

  const trackDownload = useCallback(async (productId: string) => {
    if (!user?.id) return { success: false, error: 'Not authenticated' };

    try {
      const response = await fetch('/api/downloads/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to track download');
      }

      // Refresh downloads to show new record
      await fetchUserDownloads();

      return { success: true };
    } catch (err) {
      console.error('Error tracking download:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to track download' };
    }
  }, [user?.id, fetchUserDownloads]);

  return {
    downloads,
    loading,
    error,
    trackDownload,
    refetch: fetchUserDownloads
  };
}
