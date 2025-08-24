import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import type { Tag, CreateTagData, UpdateTagData, TagFilters, TagStats, PaginatedTags } from '@/lib/services/tag-service';

interface UseTagsReturn {
  // State
  tags: Tag[];
  selectedTag: Tag | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  stats: TagStats | null;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Actions
  fetchTags: (filters?: TagFilters) => Promise<void>;
  fetchStats: () => Promise<void>;
  createTag: (tagData: CreateTagData) => Promise<Tag>;
  updateTag: (id: string, tagData: UpdateTagData) => Promise<Tag>;
  deleteTag: (id: string) => Promise<void>;
  restoreTag: (id: string) => Promise<Tag>;
  
  // UI helpers
  setSelectedTag: (tag: Tag | null) => void;
  setError: (error: string | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export function useTags(): UseTagsReturn {
  // State
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<TagStats | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch tags with filters
  const fetchTags = useCallback(async (filters: TagFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = filters.page || page || 1;
      const currentLimit = filters.limit || limit || 20;
      
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: currentLimit.toString(),
      });
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }

      const response = await fetch(`/api/admin/tags?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tags');
      }

      const data: PaginatedTags = await response.json();
      
      setTags(data.tags);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
      setLimit(data.limit);
    } catch (error) {
      console.error('Error fetching tags:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tags';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  // Fetch tag statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/tags/stats');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tag statistics');
      }

      const data: TagStats = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching tag stats:', error);
      // Don't show toast for stats errors as they're not critical
    }
  }, []);

  // Create new tag
  const createTag = useCallback(async (tagData: CreateTagData): Promise<Tag> => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create tag');
      }

      const newTag: Tag = await response.json();
      
      toast.success('Tag created successfully');
      
      // Refresh data
      await fetchTags();
      await fetchStats();
      
      return newTag;
    } catch (error) {
      console.error('Error creating tag:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create tag';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [fetchTags, fetchStats]);

  // Update existing tag
  const updateTag = useCallback(async (id: string, tagData: UpdateTagData): Promise<Tag> => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/tags/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update tag');
      }

      const updatedTag: Tag = await response.json();
      
      toast.success('Tag updated successfully');
      
      // Update local state
      setTags(prevTags => 
        prevTags.map(tag => 
          tag.id === id ? updatedTag : tag
        )
      );
      
      // Clear selected tag if it was the updated one
      if (selectedTag?.id === id) {
        setSelectedTag(updatedTag);
      }
      
      // Refresh data
      await fetchTags();
      await fetchStats();
      
      return updatedTag;
    } catch (error) {
      console.error('Error updating tag:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update tag';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [selectedTag, fetchTags, fetchStats]);

  // Delete tag (soft delete)
  const deleteTag = useCallback(async (id: string): Promise<void> => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/tags/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete tag');
      }
      
      toast.success('Tag deleted successfully');
      
      // Remove tag from local state immediately
      setTags(prevTags => prevTags.filter(tag => tag.id !== id));
      
      // Clear selected tag if it's the deleted one
      if (selectedTag?.id === id) {
        setSelectedTag(null);
      }
      
      // Refresh data
      await fetchTags();
      await fetchStats();
    } catch (error) {
      console.error('Error deleting tag:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete tag';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [selectedTag, fetchTags, fetchStats]);

  // Restore deleted tag
  const restoreTag = useCallback(async (id: string): Promise<Tag> => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/tags/${id}/restore`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to restore tag');
      }

      const restoredTag: Tag = await response.json();
      
      toast.success('Tag restored successfully');
      
      // Refresh data
      await fetchTags();
      await fetchStats();
      
      return restoredTag;
    } catch (error) {
      console.error('Error restoring tag:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore tag';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [fetchTags, fetchStats]);

  // Initial data fetch
  useEffect(() => {
    fetchTags();
    fetchStats();
  }, [fetchTags, fetchStats]);

  return {
    // State
    tags,
    selectedTag,
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
    fetchTags,
    fetchStats,
    createTag,
    updateTag,
    deleteTag,
    restoreTag,
    
    // UI helpers
    setSelectedTag,
    setError,
    setPage,
    setLimit,
  };
}
