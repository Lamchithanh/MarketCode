import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import type { Category, CreateCategoryData, UpdateCategoryData, CategoryFilters, CategoryStats, PaginatedCategories } from '@/lib/services/category-service';

interface UseCategoriesReturn {
  // State
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  stats: CategoryStats | null;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Actions
  fetchCategories: (filters?: CategoryFilters) => Promise<void>;
  fetchStats: () => Promise<void>;
  createCategory: (categoryData: CreateCategoryData) => Promise<Category>;
  updateCategory: (id: string, categoryData: UpdateCategoryData) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  restoreCategory: (id: string) => Promise<Category>;
  
  // UI helpers
  setSelectedCategory: (category: Category | null) => void;
  setError: (error: string | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export function useCategories(): UseCategoriesReturn {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch categories with filters
  const fetchCategories = useCallback(async (filters: CategoryFilters = {}) => {
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

      const response = await fetch(`/api/admin/categories?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch categories');
      }

      const data: PaginatedCategories = await response.json();
      
      setCategories(data.categories);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
      setLimit(data.limit);
    } catch (error) {
      console.error('Error fetching categories:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  // Fetch category statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/categories/stats');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch category statistics');
      }

      const data: CategoryStats = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching category stats:', error);
      // Don't show toast for stats errors as they're not critical
    }
  }, []);

  // Create new category
  const createCategory = useCallback(async (categoryData: CreateCategoryData): Promise<Category> => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
      }

      const newCategory: Category = await response.json();
      
      toast.success('Category created successfully');
      
      // Refresh data
      await fetchCategories();
      await fetchStats();
      
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create category';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [fetchCategories, fetchStats]);

  // Update existing category
  const updateCategory = useCallback(async (id: string, categoryData: UpdateCategoryData): Promise<Category> => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update category');
      }

      const updatedCategory: Category = await response.json();
      
      toast.success('Category updated successfully');
      
      // Update local state
      setCategories(prevCategories => 
        prevCategories.map(category => 
          category.id === id ? updatedCategory : category
        )
      );
      
      // Clear selected category if it was the updated one
      if (selectedCategory?.id === id) {
        setSelectedCategory(updatedCategory);
      }
      
      // Refresh data
      await fetchCategories();
      await fetchStats();
      
      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update category';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [selectedCategory, fetchCategories, fetchStats]);

  // Delete category (soft delete)
  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }
      
      toast.success('Category deleted successfully');
      
      // Remove category from local state immediately
      setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      
      // Clear selected category if it's the deleted one
      if (selectedCategory?.id === id) {
        setSelectedCategory(null);
      }
      
      // Refresh data
      await fetchCategories();
      await fetchStats();
    } catch (error) {
      console.error('Error deleting category:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete category';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [selectedCategory, fetchCategories, fetchStats]);

  // Restore deleted category
  const restoreCategory = useCallback(async (id: string): Promise<Category> => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/categories/${id}/restore`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to restore category');
      }

      const restoredCategory: Category = await response.json();
      
      toast.success('Category restored successfully');
      
      // Refresh data
      await fetchCategories();
      await fetchStats();
      
      return restoredCategory;
    } catch (error) {
      console.error('Error restoring category:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore category';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [fetchCategories, fetchStats]);

  // Initial data fetch
  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, [fetchCategories, fetchStats]);

  return {
    // State
    categories,
    selectedCategory,
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
    fetchCategories,
    fetchStats,
    createCategory,
    updateCategory,
    deleteCategory,
    restoreCategory,
    
    // UI helpers
    setSelectedCategory,
    setError,
    setPage,
    setLimit,
  };
}
