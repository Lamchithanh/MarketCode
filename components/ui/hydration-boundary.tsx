"use client";

import { useIsClient } from "@/hooks/use-hydration";
import { ReactNode } from "react";

interface HydrationBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function HydrationBoundary({ 
  children, 
  fallback 
}: HydrationBoundaryProps) {
  const isClient = useIsClient();

  // Return children immediately to avoid hydration mismatch
  // Let individual components handle their own loading states
  return <>{children}</>;
} 