import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { User, CreateUserData, UpdateUserData, UserFilters, UserStats, PaginatedUsers } from '@/lib/services/user-service';

interface UseUsersOptions {
  initialFilters?: UserFilters;
  autoFetch?: boolean;
}

interface UseUsersReturn {
  // State
  users: User[];
  selectedUser: User | null;
  stats: UserStats | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: UserFilters;
  loading: boolean;
  statsLoading: boolean;
  actionLoading: boolean;
  error: string | null;

  // Actions
  createUser: (userData: CreateUserData) => Promise<User>;
  updateUser: (id: string, userData: UpdateUserData) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  restoreUser: (id: string) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  verifyUserEmail: (id: string) => Promise<void>;

  // State setters
  setSelectedUser: (user: User | null) => void;
  setFilters: (filters: UserFilters) => void;
  updateFilters: (updates: Partial<UserFilters>) => void;
  resetFilters: () => void;
  clearError: () => void;

  // Utilities
  refreshUsers: () => Promise<void>;
  goToPage: (page: number) => void;
  changeLimit: (limit: number) => void;
}

export function useUsers(options: UseUsersOptions = {}): UseUsersReturn {
  const { initialFilters = {}, autoFetch = true } = options;

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 20,
    ...initialFilters
  });
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Memoized computed values
  const currentFilters = useMemo(() => filters, [filters]);

  // Fetch users with current filters
  const fetchUsers = useCallback(async (newFilters?: UserFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (newFilters?.search) params.append('search', newFilters.search);
      if (newFilters?.role) params.append('role', newFilters.role);
      if (newFilters?.isActive !== undefined) params.append('isActive', newFilters.isActive.toString());
      if (newFilters?.page) params.append('page', newFilters.page.toString());
      if (newFilters?.limit) params.append('limit', newFilters.limit.toString());
      
      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const data: PaginatedUsers = await response.json();
      setUsers(data.users);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user statistics
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/users/stats');
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }
      
      const data: UserStats = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch stats');
      toast.error('Failed to fetch stats');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: CreateUserData) => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }
      
      const newUser: User = await response.json();
      toast.success('User created successfully');
      await fetchUsers();
      await fetchStats();
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [fetchUsers, fetchStats]);

  const updateUser = useCallback(async (id: string, userData: UpdateUserData) => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      
      const updatedUser: User = await response.json();
      toast.success('User updated successfully');
      await fetchStats();
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [fetchStats]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      
      toast.success('User deleted successfully');
      
      // Remove user from local state immediately
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      
      // Clear selected user if it's the deleted one
      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }
      
      // Refresh data
      await fetchUsers();
      await fetchStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [fetchUsers, fetchStats, selectedUser]);

  const restoreUser = useCallback(async (id: string) => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/users/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to restore user');
      }
      
      toast.success('User restored successfully');
      await fetchUsers();
      await fetchStats();
    } catch (error) {
      console.error('Error restoring user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore user';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [fetchUsers, fetchStats]);

  const toggleUserStatus = useCallback(async (id: string) => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/users/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_status' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle user status');
      }
      
      toast.success('User status updated successfully');
      await fetchStats();
    } catch (error) {
      console.error('Error toggling user status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle user status';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [fetchStats]);

  const verifyUserEmail = useCallback(async (id: string) => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/users/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_email' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify user email');
      }
      
      toast.success('User email verified successfully');
    } catch (error) {
      console.error('Error verifying user email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify user email';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((updates: Partial<UserFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      page: 1 // Reset to first page when filters change
    }));
  }, []);

  // Reset filters to initial state
  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 20,
      ...initialFilters
    });
  }, [initialFilters]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh users with current filters
  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  // Navigate to specific page
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      updateFilters({ page });
    }
  }, [pagination.totalPages, updateFilters]);

  // Change page limit
  const changeLimit = useCallback((limit: number) => {
    updateFilters({ limit, page: 1 });
  }, [updateFilters]);

  // Auto-fetch on mount and when filters change
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
      fetchStats();
    }
  }, [autoFetch, fetchUsers, fetchStats]);

  // Auto-fetch when filters change
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [filters, autoFetch, fetchUsers]);

  return {
    // State
    users,
    selectedUser,
    stats,
    pagination,
    filters,
    loading,
    statsLoading,
    actionLoading,
    error,

    // Actions
    createUser,
    updateUser,
    deleteUser,
    restoreUser,
    toggleUserStatus,
    verifyUserEmail,

    // State setters
    setSelectedUser,
    setFilters,
    updateFilters,
    resetFilters,
    clearError,

    // Utilities
    refreshUsers,
    goToPage,
    changeLimit,
  };
}
