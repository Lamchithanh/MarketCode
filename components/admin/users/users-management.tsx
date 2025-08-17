'use client';

import { useState } from 'react';
import { UsersHeader } from './users-header';
import { UsersStats } from './users-stats';
import { UsersSearch } from './users-search';
import { UsersDataTable } from './users-data-table';
import { UserViewDialog } from './user-view-dialog';
import { UserFormDialog } from './user-form-dialog';
import { UserDeleteDialog } from './user-delete-dialog';
import { useUsers } from '@/hooks/use-users';
import { User, CreateUserData, UpdateUserData } from '@/lib/services/user-service';

export function UsersManagement() {
  const {
    users,
    selectedUser,
    stats,
    pagination,
    filters,
    loading,
    statsLoading,
    actionLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    restoreUser,
    toggleUserStatus,
    verifyUserEmail,
    setSelectedUser,
    updateFilters,
    resetFilters,
    clearError,
    refreshUsers,
    goToPage,
    changeLimit
  } = useUsers({
    initialFilters: {
      page: 1,
      limit: 20
    }
  });

  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Handle add user
  const handleAddUser = () => {
    setSelectedUser(null); // null = Add mode
    setIsFormDialogOpen(true);
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user); // user = Edit mode
    setIsFormDialogOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Handle view user
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  // Handle save user (create or update)
  const handleSaveUser = async (userData: CreateUserData | UpdateUserData) => {
    try {
      if ('id' in userData && userData.id) {
        // Edit mode - update existing user
        const { id, ...updateData } = userData;
        await updateUser(id, updateData);
      } else {
        // Add mode - create new user
        await createUser(userData as CreateUserData);
      }
      
      setIsFormDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      // Error is handled by the hook
      console.error('Error saving user:', error);
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async (userToDelete: User) => {
    try {
      const success = await deleteUser(userToDelete.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      // Error is handled by the hook
      console.error('Error deleting user:', error);
    }
  };

  // Handle search change
  const handleSearchChange = (searchTerm: string) => {
    updateFilters({ search: searchTerm });
  };

  // Handle refresh
  const handleRefresh = async () => {
    await refreshUsers();
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  // Handle limit change
  const handleLimitChange = (limit: number) => {
    changeLimit(limit);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <UsersHeader onAddUser={handleAddUser} />

      {/* Stats Cards */}
      <UsersStats 
        stats={stats} 
        loading={statsLoading} 
      />

      {/* Search and Filters */}
      <UsersSearch
        searchTerm={filters.search || ''}
        onSearchChange={handleSearchChange}
        onRefresh={handleRefresh}
        loading={loading}
        onResetFilters={resetFilters}
      />

      {/* Users Table */}
      <UsersDataTable
        users={users}
        loading={loading}
        pagination={pagination}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onViewUser={handleViewUser}
        onToggleStatus={toggleUserStatus}
        onVerifyEmail={verifyUserEmail}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-destructive text-sm">{error}</p>
            <button
              onClick={clearError}
              className="text-destructive hover:text-destructive/80 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* View User Dialog */}
      <UserViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        user={selectedUser}
      />

      {/* User Form Dialog (Add/Edit) */}
      <UserFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        user={selectedUser}
        onSave={handleSaveUser}
        loading={actionLoading}
      />

      {/* Delete User Dialog */}
      <UserDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />
    </div>
  );
}
