"use client";

import { useIsClient } from "@/hooks/use-hydration";
import { ReactNode } from "react";

interface HydrationBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function HydrationBoundary({ 
  children, 
  fallback = <div className="animate-pulse bg-gray-100 min-h-screen" /> 
}: HydrationBoundaryProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
} 