"use client";

import { ReactNode } from "react";
import { useIsClient } from "@/hooks/use-hydration";

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function NoSSR({ children, fallback = null }: NoSSRProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Auth-specific NoSSR wrapper with consistent fallback
interface AuthNoSSRProps {
  children: ReactNode;
}

export function AuthNoSSR({ children }: AuthNoSSRProps) {
  return (
    <NoSSR fallback={
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
    }>
      {children}
    </NoSSR>
  );
}