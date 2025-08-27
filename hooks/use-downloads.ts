'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface DownloadItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  productThumbnail: string;
  downloadDate: string;
  ipAddress: string;
  userAgent: string;
  githubUrl: string;
}

interface DownloadStats {
  totalDownloads: number;
  uniqueUsers: number;
  topProducts: Array<{ name: string; count: number }>;
  recentDownloads: number;
}

export function useDownloads() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDownloads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/downloads');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setDownloads(result.data);
      } else {
        console.error('API response:', result);
        throw new Error(result.error || 'Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching downloads:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch downloads');
      setDownloads([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  const searchDownloads = useCallback((
    downloads: DownloadItem[],
    searchTerm: string
  ) => {
    if (!searchTerm) return downloads;
    
    const searchLower = searchTerm.toLowerCase();
    return downloads.filter(download =>
      download.userName.toLowerCase().includes(searchLower) ||
      download.userEmail.toLowerCase().includes(searchLower) ||
      download.productName.toLowerCase().includes(searchLower)
    );
  }, []);

  const deleteDownload = useCallback(async (downloadId: string) => {
    try {
      const response = await fetch('/api/admin/downloads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ downloadId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete download');
      }

      setDownloads(prev => prev.filter(d => d.id !== downloadId));
      toast.success('Download record deleted');
      return { success: true };
    } catch (err) {
      console.error('Error deleting download:', err);
      toast.error('Failed to delete download record');
      return { success: false, error: err };
    }
  }, []);

  const stats: DownloadStats = {
    totalDownloads: downloads.length,
    uniqueUsers: new Set(downloads.map(d => d.userId)).size,
    recentDownloads: downloads.filter(d => {
      try {
        const downloadDate = new Date(d.downloadDate);
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return downloadDate >= oneWeekAgo;
      } catch {
        return false; // Invalid date
      }
    }).length,
    topProducts: Object.entries(
      downloads.reduce((acc, d) => {
        if (d.productName && d.productName !== 'Unknown Product') {
          acc[d.productName] = (acc[d.productName] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))
  };

  return {
    downloads,
    loading,
    error,
    stats,
    fetchDownloads,
    searchDownloads,
    deleteDownload,
  };
}
