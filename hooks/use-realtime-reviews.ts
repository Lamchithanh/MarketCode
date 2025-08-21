"use client";

import { useEffect, useState, useCallback } from 'react';

interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  isHelpful: number; // from database (number)
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
  };
}

interface UseRealtimeReviewsOptions {
  productId?: string;
  enabled?: boolean;
}

interface UseRealtimeReviewsReturn {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRealtimeReviews(
  options: UseRealtimeReviewsOptions = {}
): UseRealtimeReviewsReturn {
  const { productId, enabled = true } = options;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setError(null);
      const url = productId 
        ? `/api/products/${productId}/reviews`
        : '/api/reviews';
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  // Initial fetch only
  useEffect(() => {
    if (!enabled) return;
    fetchReviews();
  }, [enabled, fetchReviews]); // Include fetchReviews dependency

  // Realtime subscription (disabled for now to test)
  /*
  useEffect(() => {
    if (!enabled) return;

    const channelName = productId 
      ? `reviews-product-${productId}`
      : 'reviews-all';

    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Review',
          ...(productId && { filter: `productId=eq.${productId}` })
        },
        async (payload) => {
          console.log('Realtime Review change:', payload);
          await fetchReviews();
        }
      )
      .subscribe((status, error) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to review changes');
        }
        if (error) {
          console.error('Subscription error:', error);
          setError('Realtime subscription failed');
        }
      });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [enabled, productId]);
  */

  const refetch = async () => {
    setIsLoading(true);
    await fetchReviews();
  };

  return {
    reviews,
    isLoading,
    error,
    refetch
  };
}
