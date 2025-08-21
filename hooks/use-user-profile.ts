import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UserProfile {
  name?: string | null;
  email?: string | null;
  role?: string;
  avatar?: string | null;
  phone?: string | null;
}

export function useUserProfile(initialUser: UserProfile) {
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUserProfile = useCallback(async () => {
    console.log('refreshUserProfile called');
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile');
      console.log('GET /api/user/profile response:', response.status);
      const result = await response.json();
      console.log('Profile refresh result:', result);
      
      if (response.ok && result.success && result.data) {
        setUser({
          name: result.data.name,
          email: result.data.email,
          avatar: result.data.avatar,
          role: result.data.role,
          phone: result.data.phone
        });
        console.log('User profile updated from database');
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    console.log('updateUserProfile called with:', updates);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updates.name,
          email: updates.email,
          avatar: updates.avatar,
        }),
      });

      const result = await response.json();
      console.log('PUT /api/user/profile result:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      if (result.success) {
        // Update local state immediately
        setUser(prevUser => {
          const newUser = { ...prevUser, ...updates };
          console.log('Local user state updated:', newUser);
          return newUser;
        });
        
        toast.success('Đã cập nhật thông tin thành công');
        
        // Refresh from database to ensure sync
        setTimeout(() => {
          console.log('Triggering profile refresh after update...');
          refreshUserProfile();
        }, 500);
        
        return true;
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật thông tin');
      throw error;
    }
  }, [refreshUserProfile]);

  const updateAvatar = useCallback(async (avatarUrl: string | null) => {
    try {
      // Update profile with new avatar URL - include current name and email
      await updateUserProfile({
        name: user.name || '',
        email: user.email || '', 
        avatar: avatarUrl || undefined
      });
      
      // Refresh profile from database to ensure sync
      setTimeout(() => {
        refreshUserProfile();
      }, 500);
      
      return true;
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error('Có lỗi xảy ra khi cập nhật ảnh đại diện');
      throw error;
    }
  }, [updateUserProfile, refreshUserProfile, user.email, user.name]);

  return {
    user,
    isLoading,
    refreshUserProfile,
    updateUserProfile,
    updateAvatar,
  };
}
