import { useState, useEffect } from 'react';

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface ProductRatingStats {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number; 
    3: number;
    4: number;
    5: number;
  };
}

export function useProductReviews(productId?: string) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [ratingStats, setRatingStats] = useState<ProductRatingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/products/${id}/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews || []);
        
        // Calculate rating stats
        const approvedReviews = (data.reviews || []).filter((review: ProductReview) => review.isApproved);
        const totalReviews = approvedReviews.length;
        
        if (totalReviews > 0) {
          const averageRating = approvedReviews.reduce((sum: number, review: ProductReview) => sum + review.rating, 0) / totalReviews;
          
          const ratingDistribution = {
            1: approvedReviews.filter((r: ProductReview) => r.rating === 1).length,
            2: approvedReviews.filter((r: ProductReview) => r.rating === 2).length,
            3: approvedReviews.filter((r: ProductReview) => r.rating === 3).length,
            4: approvedReviews.filter((r: ProductReview) => r.rating === 4).length,
            5: approvedReviews.filter((r: ProductReview) => r.rating === 5).length,
          };

          setRatingStats({
            productId: id,
            averageRating: Number(averageRating.toFixed(1)),
            totalReviews,
            ratingDistribution
          });
        } else {
          setRatingStats({
            productId: id,
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
    }
  }, [productId]);

  return {
    reviews: reviews.filter(review => review.isApproved), // Only return approved reviews
    ratingStats,
    loading,
    error,
    refetch: () => productId && fetchReviews(productId)
  };
}

// Hook for fetching all products rating stats at once  
export function useAllProductsRatings(productIds: string[]) {
  const [ratingsMap, setRatingsMap] = useState<Record<string, ProductRatingStats>>({});
  const [loading, setLoading] = useState(false);

  // Create stable dependency
  const productIdsKey = productIds.sort().join(',');

  useEffect(() => {
    if (productIds.length === 0) return;

    console.log('useAllProductsRatings - fetching for IDs:', productIds);

    const fetchAllRatings = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/products/ratings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch ratings');
        }

        const data = await response.json();
        console.log('useAllProductsRatings - received data:', data);
        
        if (data.success) {
          setRatingsMap(data.ratings || {});
        }
      } catch (error) {
        console.error('Error fetching product ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRatings();
  }, [productIdsKey, productIds]); // Include both dependencies

  return {
    ratingsMap,
    loading,
    getRating: (productId: string) => ratingsMap[productId] || { 
      productId, 
      averageRating: 0, 
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  };
}
