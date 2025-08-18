import { useState, useEffect } from 'react';
import { Tag } from '@/lib/services/product-service';

export function useAllTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllTags = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/tags?limit=1000'); // Get all tags
      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.statusText}`);
      }
      
      const data = await response.json();
      // Handle both paginated and direct array responses
      const tagsData = data.tags || data;
      setTags(tagsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags');
      console.error('Error fetching tags:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTags();
  }, []);

  return {
    tags,
    loading,
    error,
    refetch: fetchAllTags
  };
}
