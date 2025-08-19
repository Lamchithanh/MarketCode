import { useState, useEffect } from 'react';
import { Project } from '@/types';

interface UseProductsLandingReturn {
  products: Project[];
  loading: boolean;
  error: string | null;
}

export function useProductsLanding(): UseProductsLandingReturn {
  const [products, setProducts] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const result = await response.json();
        
        if (result.success && result.products) {
          setProducts(result.products);
        } else {
          throw new Error(result.error || 'Failed to load products');
        }
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}
