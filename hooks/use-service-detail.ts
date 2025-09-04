'use client';

import { useState, useEffect, useCallback } from 'react';
import { Service } from './use-services';

interface UseServiceDetailReturn {
  service: Service | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useServiceDetail(slug: string): UseServiceDetailReturn {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchService = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`/api/services/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Service not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setService(data.service);
    } catch (err) {
      console.error('Error fetching service detail:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch service');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchService();
    }
  }, [slug, fetchService]);

  const refetch = async () => {
    await fetchService();
  };

  return {
    service,
    loading,
    error,
    refetch
  };
}
