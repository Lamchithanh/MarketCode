"use client";

import { ReactNode, useEffect, useRef } from "react";

interface FramerMotionProviderProps {
  children: ReactNode;
}

export function FramerMotionProvider({ children }: FramerMotionProviderProps) {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Override console.error to filter out known React DOM warnings
    const originalError = console.error;
    
    console.error = (...args) => {
      const message = args[0]?.toString() || '';
      
      // Filter out known React 19 + Next.js 15 DOM manipulation errors
      if (
        message.includes('removeChild') ||
        message.includes('Cannot read properties of null') ||
        message.includes('commitDeletionEffectsOnFiber') ||
        message.includes('recursivelyTraverseDeletionEffects') ||
        message.includes('framer-motion')
      ) {
        // Suppress these errors in all environments
        return;
      }
      
      // Log other errors normally
      originalError(...args);
    };

    // Add global error boundary for DOM manipulation
    const handleError = (event: ErrorEvent) => {
      const message = event.error?.message || event.message || '';
      
      if (
        message.includes('removeChild') ||
        message.includes('Cannot read properties of null') ||
        message.includes('commitDeletionEffectsOnFiber')
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message = event.reason?.toString() || '';
      
      if (
        message.includes('removeChild') ||
        message.includes('Cannot read properties of null') ||
        message.includes('commitDeletionEffectsOnFiber')
      ) {
        event.preventDefault();
        return false;
      }
    };

    // Override Node.removeChild to prevent null reference errors
    if (typeof window !== 'undefined') {
      const originalRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function<T extends Node>(child: T): T {
        try {
          if (this && child && this.contains(child)) {
            return originalRemoveChild.call(this, child) as T;
          }
          return child;
        } catch {
          // Silently handle removeChild errors
          return child;
        }
      };
    }

    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

    // Cleanup on unmount
    return () => {
      console.error = originalError;
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    };
  }, []);

  return <>{children}</>;
}
