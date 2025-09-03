"use client";

import { useRouter } from 'next/navigation';
import { useCallback, useRef, useEffect } from 'react';

interface UseNavigationOptions {
  prefetch?: boolean;
  replace?: boolean;
}

export function useNavigation() {
  const router = useRouter();
  const pendingNavigation = useRef<string | null>(null);
  const isNavigating = useRef(false);

  // Prefetch routes on mount
  useEffect(() => {
    router.prefetch('/login');
    router.prefetch('/register');
  }, [router]);

  const navigate = useCallback((href: string, options?: UseNavigationOptions) => {
    // Prevent double navigation
    if (isNavigating.current) {
      return;
    }

    isNavigating.current = true;
    pendingNavigation.current = href;

    try {
      if (options?.replace) {
        router.replace(href);
      } else {
        router.push(href);
      }
    } catch (error) {
      console.warn('Navigation error:', error);
      // Fallback to window navigation
      window.location.href = href;
    } finally {
      // Reset navigation state after a delay
      setTimeout(() => {
        isNavigating.current = false;
        pendingNavigation.current = null;
      }, 100);
    }
  }, [router]);

  const navigateToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const navigateToRegister = useCallback(() => {
    navigate('/register');
  }, [navigate]);

  return {
    navigate,
    navigateToLogin,
    navigateToRegister,
    isNavigating: isNavigating.current,
    pendingNavigation: pendingNavigation.current
  };
}
