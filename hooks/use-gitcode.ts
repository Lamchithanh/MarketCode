'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface GitCodeItem {
  id: string;
  code: string;
  repo_url: string;
  description: string;
  expire_date: string | null;
  usage_limit: number | null;
  times_used: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GitCodeUsageResult {
  success: boolean;
  message: string;
  data?: {
    code: string;
    repo_url: string;
    description: string;
  };
}

// Hook for admin management of gift codes
export function useGitCodes() {
  const [gitCodes, setGitCodes] = useState<GitCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGitCodes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/gitcode?admin=true');
      if (!response.ok) {
        throw new Error('Failed to fetch git codes');
      }

      const result = await response.json();
      setGitCodes(result.data || []);
    } catch (err) {
      console.error('Error fetching git codes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch git codes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGitCodes();
  }, [fetchGitCodes]);

  const createGitCode = useCallback(async (data: {
    code: string;
    repo_url: string;
    description: string;
    expire_date?: string;
    usage_limit?: number;
  }) => {
    try {
      const response = await fetch('/api/gitcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create git code');
      }

      toast.success('Mã GitCode đã được tạo thành công!');
      fetchGitCodes(); // Refresh list
      return { success: true, data: result.data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create git code';
      toast.error(message);
      return { success: false, error: message };
    }
  }, [fetchGitCodes]);

  const updateGitCode = useCallback(async (id: string, data: Partial<GitCodeItem>) => {
    try {
      const response = await fetch(`/api/gitcode`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update git code');
      }

      toast.success('Mã GitCode đã được cập nhật thành công!');
      fetchGitCodes(); // Refresh list
      return { success: true, data: result.data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update git code';
      toast.error(message);
      return { success: false, error: message };
    }
  }, [fetchGitCodes]);

  const deleteGitCode = useCallback(async (id: string) => {
    try {
      const response = await fetch('/api/gitcode', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete git code');
      }

      toast.success('Mã GitCode đã được xóa thành công!');
      fetchGitCodes(); // Refresh list
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete git code';
      toast.error(message);
      return { success: false, error: message };
    }
  }, [fetchGitCodes]);

  return {
    gitCodes,
    loading,
    error,
    fetchGitCodes,
    createGitCode,
    updateGitCode,
    deleteGitCode
  };
}

// Hook for users to redeem gift codes
export function useGitCodeRedeemer() {
  const [loading, setLoading] = useState(false);

  const redeemGitCode = useCallback(async (code: string): Promise<GitCodeUsageResult> => {
    try {
      setLoading(true);

      const response = await fetch(`/api/gitcode?code=${encodeURIComponent(code)}`);
      const result = await response.json();

      if (!response.ok) {
        return { success: false, message: result.error || 'Mã không hợp lệ' };
      }

      return {
        success: true,
        message: 'Sử dụng mã thành công!',
        data: {
          code: result.data.code,
          repo_url: result.data.repo_url,
          description: result.data.description
        }
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Có lỗi xảy ra khi sử dụng mã'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    redeemGitCode,
    loading
  };
}
