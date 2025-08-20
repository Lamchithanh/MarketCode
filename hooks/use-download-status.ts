'use client';

import { useState, useEffect, useCallback } from 'react';

export interface DownloadStatus {
  downloaded: boolean;
  downloadCount: number;
  canDownload: boolean;
  maxDownloads: number;
  downloadedAt: string | null;
  allDownloads: Array<{
    id: string;
    createdAt: string;
  }>;
}

export function useDownloadStatus(userId: string | null, productId: string | null) {
  const [status, setStatus] = useState<DownloadStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDownloadStatus = useCallback(async () => {
    if (!userId || !productId) {
      setStatus(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/downloads/check?userId=${encodeURIComponent(userId)}&productId=${encodeURIComponent(productId)}`
      );

      if (!response.ok) {
        throw new Error('Failed to check download status');
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      console.error('Error checking download status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check download status');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [userId, productId]);

  const trackDownload = useCallback(async () => {
    if (!userId || !productId) {
      throw new Error('Missing userId or productId');
    }

    const response = await fetch('/api/downloads/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        productId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to track download');
    }

    const result = await response.json();
    
    // Refresh status after tracking
    await checkDownloadStatus();
    
    return result;
  }, [userId, productId, checkDownloadStatus]);

  useEffect(() => {
    checkDownloadStatus();
  }, [checkDownloadStatus]);

  return {
    status,
    loading,
    error,
    checkDownloadStatus,
    trackDownload,
  };
}
