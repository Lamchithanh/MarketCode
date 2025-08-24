import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string | null;
}

export function useUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  // Function to refresh user data from database
  const refreshUser = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setUser({
            id: result.data.id,
            name: result.data.name || '',
            email: result.data.email || '',
            role: result.data.role || 'USER',
            avatar: result.data.avatar,
          });
          setHasFetched(true);
        }
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // Fallback to session data
      if (session?.user) {
        setUser({
          id: session.user.id as string,
          name: session.user.name || '',
          email: session.user.email || '',
          role: ((session.user as { role?: string }).role || 'USER') as 'USER' | 'ADMIN',
          avatar: (session.user as { avatar?: string }).avatar,
        });
        setHasFetched(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (status === 'authenticated' && session?.user) {
      // Only fetch if we haven't fetched for this user yet
      if (!hasFetched || user?.id !== session.user.id) {
        refreshUser();
      } else {
        setIsLoading(false);
      }
    } else if (status === 'unauthenticated') {
      setUser(null);
      setHasFetched(false);
      setIsLoading(false);
    }
  }, [session?.user?.id, status, hasFetched, user?.id]); // Optimized dependencies

  return {
    user,
    isLoading: status === 'loading' || isLoading,
    isAuthenticated: !!user,
    refreshUser, // Export refresh function for manual updates
  };
}
