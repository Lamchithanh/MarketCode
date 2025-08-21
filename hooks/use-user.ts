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

  // Function to refresh user data from database
  const refreshUser = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
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
      }
    }
  }, [session]);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (status === 'authenticated' && session?.user) {
      // Fetch fresh data from database instead of just using session
      refreshUser().finally(() => setIsLoading(false));
    } else if (status === 'unauthenticated') {
      setUser(null);
      setIsLoading(false);
    }
  }, [session, status, refreshUser]);

  return {
    user,
    isLoading: status === 'loading' || isLoading,
    isAuthenticated: !!user,
    refreshUser, // Export refresh function for manual updates
  };
}
