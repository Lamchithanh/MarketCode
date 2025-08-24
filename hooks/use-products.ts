import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import type { Product, CreateProductData, UpdateProductData, ProductFilters, ProductStats, PaginatedProducts } from '@/lib/services/product-service';

interface UseProductsReturn {
  // State
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  stats: ProductStats | null;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Actions
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchStats: () => Promise<void>;
  createProduct: (productData: CreateProductData) => Promise<Product>;
  updateProduct: (id: string, productData: UpdateProductData) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  restoreProduct: (id: string) => Promise<Product>;
  incrementViewCount: (id: string) => Promise<void>;
  incrementDownloadCount: (id: string) => Promise<void>;
  
  // UI helpers
  setSelectedProduct: (product: Product | null) => void;
  setError: (error: string | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export function useProducts(): UseProductsReturn {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ProductStats | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch products with filters
  const fetchProducts = useCallback(async (filters: ProductFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: filters.page?.toString() || page.toString(),
        limit: filters.limit?.toString() || limit.toString(),
      });
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      if (filters.categoryId) {
        queryParams.append('categoryId', filters.categoryId);
      }
      
      if (filters.userId) {
        queryParams.append('userId', filters.userId);
      }
      
      if (filters.isActive !== undefined) {
        queryParams.append('isActive', filters.isActive.toString());
      }
      
      if (filters.minPrice !== undefined) {
        queryParams.append('minPrice', filters.minPrice.toString());
      }
      
      if (filters.maxPrice !== undefined) {
        queryParams.append('maxPrice', filters.maxPrice.toString());
      }
      
      if (filters.technologies && filters.technologies.length > 0) {
        queryParams.append('technologies', filters.technologies.join(','));
      }
      
      if (filters.tagIds && filters.tagIds.length > 0) {
        queryParams.append('tagIds', filters.tagIds.join(','));
      }

      const response = await fetch(`/api/admin/products?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch products');
      }

      const data = await response.json();
      
      // Debug: Log fetched data
      if (data.products && data.products.length > 0) {
        const testProduct = data.products.find(p => p.title === 'Test Product with Images');
        if (testProduct) {
          console.log('useProducts - Fetched product data:', {
            title: testProduct.title,
            category: testProduct.category,
            author: testProduct.author
          });
        }
      }
      
      // Transform AdminProduct to Product format
      const transformedProducts: Product[] = (data.products || []).map(adminProduct => ({
        id: adminProduct.id,
        userId: '00000000-0000-0000-0000-000000000000', // Placeholder
        categoryId: '00000000-0000-0000-0000-000000000000', // Placeholder
        title: adminProduct.title,
        slug: adminProduct.title.toLowerCase().replace(/\s+/g, '-'),
        description: adminProduct.description,
        price: adminProduct.price,
        thumbnailUrl: undefined,
        images: [],
        fileUrl: undefined,
        demoUrl: undefined,
        githubUrl: undefined,
        downloadCount: adminProduct.downloadCount,
        viewCount: adminProduct.viewCount,
        isActive: adminProduct.isActive,
        technologies: [],
        fileSize: undefined,
        createdAt: adminProduct.createdAt,
        updatedAt: adminProduct.updatedAt,
        deletedAt: undefined,
        category: { id: '00000000-0000-0000-0000-000000000000', name: adminProduct.category, slug: adminProduct.category.toLowerCase().replace(/\s+/g, '-'), description: undefined, icon: undefined },
        user: { id: '00000000-0000-0000-0000-000000000000', name: adminProduct.author, email: adminProduct.authorEmail, avatar: undefined },
        tags: []
      }));
      
      setProducts(transformedProducts);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
      setPage(data.page || 1);
      setLimit(data.limit || 20);
    } catch (error) {
      console.error('Error fetching products:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  // Fetch product statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/products/stats');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch product statistics');
      }

      const data: ProductStats = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching product stats:', error);
      // Don't show toast for stats errors as they're not critical
    }
  }, []);

  // Create new product
  const createProduct = useCallback(async (productData: CreateProductData): Promise<Product> => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const newProduct: Product = await response.json();
      
      toast.success('Product created successfully');
      
      // Refresh data
      await fetchProducts();
      await fetchStats();
      
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [fetchProducts, fetchStats]);

  // Update existing product
  const updateProduct = useCallback(async (id: string, productData: UpdateProductData): Promise<Product> => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      const updatedProduct: Product = await response.json();
      
      toast.success('Product updated successfully');
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id ? updatedProduct : product
        )
      );
      
      // Clear selected product if it was the updated one
      if (selectedProduct?.id === id) {
        setSelectedProduct(updatedProduct);
      }
      
      // Refresh data
      await fetchProducts();
      await fetchStats();
      
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [selectedProduct, fetchProducts, fetchStats]);

  // Delete product (soft delete)
  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
      
      toast.success('Product deleted successfully');
      
      // Remove product from local state immediately
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      
      // Clear selected product if it's the deleted one
      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }
      
      // Refresh data
      await fetchProducts();
      await fetchStats();
    } catch (error) {
      console.error('Error deleting product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [selectedProduct, fetchProducts, fetchStats]);

  // Restore deleted product
  const restoreProduct = useCallback(async (id: string): Promise<Product> => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/products/${id}/restore`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to restore product');
      }

      const restoredProduct: Product = await response.json();
      
      toast.success('Product restored successfully');
      
      // Refresh data
      await fetchProducts();
      await fetchStats();
      
      return restoredProduct;
    } catch (error) {
      console.error('Error restoring product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore product';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [fetchProducts, fetchStats]);

  // Increment view count
  const incrementViewCount = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/products/${id}/view`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        console.error('Failed to increment view count');
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }, []);

  // Increment download count
  const incrementDownloadCount = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/products/${id}/download`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        console.error('Failed to increment download count');
      }
    } catch (error) {
      console.error('Error incrementing download count:', error);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, [fetchProducts, fetchStats]);

  return {
    // State
    products,
    selectedProduct,
    loading,
    actionLoading,
    error,
    stats,
    
    // Pagination
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    
    // Actions
    fetchProducts,
    fetchStats,
    createProduct,
    updateProduct,
    deleteProduct,
    restoreProduct,
    incrementViewCount,
    incrementDownloadCount,
    
    // UI helpers
    setSelectedProduct,
    setError,
    setPage,
    setLimit,
  };
}
