import { useState, useCallback, useEffect } from 'react';

export interface GitCodeItem {
  id: string;
  code: string;
  repo_url: string;
  description: string;
  expire_date: string | null;
  usage_limit: number;
  times_used: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface GitCodeRedeemResult {
  success: boolean;
  message: string;
  data?: {
    code: string;
    repo_url: string;
    description: string;
  };
}

interface UseGitCodeRedeemerReturn {
  redeemGitCode: (code: string) => Promise<GitCodeRedeemResult>;
  loading: boolean;
}

interface UseGitCodesReturn {
  gitCodes: GitCodeItem[];
  loading: boolean;
  error: string | null;
  createGitCode: (gitCode: Omit<GitCodeItem, 'id' | 'created_at' | 'updated_at' | 'times_used'>) => Promise<boolean>;
  updateGitCode: (id: string, updates: Partial<GitCodeItem>) => Promise<boolean>;
  deleteGitCode: (id: string) => Promise<boolean>;
  fetchGitCodes: () => Promise<void>;
}

export function useGitCodes(): UseGitCodesReturn {
  const [gitCodes, setGitCodes] = useState<GitCodeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGitCodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/gitcode');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setGitCodes(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch GitCodes');
      }
    } catch (err) {
      console.error('Error fetching GitCodes:', err);
      setError('Đã xảy ra lỗi khi tải danh sách GitCode');
    } finally {
      setLoading(false);
    }
  }, []);

  const createGitCode = useCallback(async (gitCode: Omit<GitCodeItem, 'id' | 'created_at' | 'updated_at' | 'times_used'>): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/gitcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gitCode),
      });

      const result = await response.json();
      if (result.success) {
        await fetchGitCodes();
        return true;
      } else {
        setError(result.error || 'Failed to create GitCode');
        return false;
      }
    } catch (err) {
      console.error('Error creating GitCode:', err);
      setError('Đã xảy ra lỗi khi tạo GitCode');
      return false;
    }
  }, [fetchGitCodes]);

  const updateGitCode = useCallback(async (id: string, updates: Partial<GitCodeItem>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/gitcode/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const result = await response.json();
      if (result.success) {
        await fetchGitCodes();
        return true;
      } else {
        setError(result.error || 'Failed to update GitCode');
        return false;
      }
    } catch (err) {
      console.error('Error updating GitCode:', err);
      setError('Đã xảy ra lỗi khi cập nhật GitCode');
      return false;
    }
  }, [fetchGitCodes]);

  const deleteGitCode = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/gitcode/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        await fetchGitCodes();
        return true;
      } else {
        setError(result.error || 'Failed to delete GitCode');
        return false;
      }
    } catch (err) {
      console.error('Error deleting GitCode:', err);
      setError('Đã xảy ra lỗi khi xóa GitCode');
      return false;
    }
  }, [fetchGitCodes]);

  useEffect(() => {
    fetchGitCodes();
  }, [fetchGitCodes]);

  return {
    gitCodes,
    loading,
    error,
    createGitCode,
    updateGitCode,
    deleteGitCode,
    fetchGitCodes,
  };
}

export function useGitCodeRedeemer(): UseGitCodeRedeemerReturn {
  const [loading, setLoading] = useState(false);

  const redeemGitCode = useCallback(async (code: string): Promise<GitCodeRedeemResult> => {
    if (!code.trim()) {
      return {
        success: false,
        message: 'Vui lòng nhập mã GitCode'
      };
    }

    setLoading(true);

    try {
      const response = await fetch('/api/gitcode/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.error || `HTTP ${response.status}: Không thể xử lý yêu cầu`
        };
      }

      if (result.success) {
        return {
          success: true,
          message: result.message || 'Đã sử dụng GitCode thành công!',
          data: result.data
        };
      } else {
        return {
          success: false,
          message: result.error || 'Mã GitCode không hợp lệ'
        };
      }

    } catch (error) {
      console.error('GitCode redeem error:', error);
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi xử lý GitCode. Vui lòng thử lại!'
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