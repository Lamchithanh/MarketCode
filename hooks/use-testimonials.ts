'use client';

import { useState, useEffect, useCallback } from 'react';
import { Testimonial, TestimonialsResponse } from '@/types/testimonial';

interface UseTestimonialsOptions {
  limit?: number;
  featured?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useTestimonials(options: UseTestimonialsOptions = {}) {
  const {
    limit = 6,
    featured = false,
    autoRefresh = false,
    refreshInterval = 30000 // 30 seconds
  } = options;

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState({ total: 0, average_rating: '0', five_star_count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      setError(null);
      
      const params = new URLSearchParams({
        limit: limit.toString(),
        featured: featured.toString()
      });

      const response = await fetch(`/api/testimonials?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TestimonialsResponse = await response.json();
      
      setTestimonials(data.testimonials);
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  }, [limit, featured]);

  // Initial fetch
  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchTestimonials, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchTestimonials]);

  const refresh = () => {
    setLoading(true);
    fetchTestimonials();
  };

  return {
    testimonials,
    stats,
    loading,
    error,
    refresh,
    refetch: fetchTestimonials
  };
}
