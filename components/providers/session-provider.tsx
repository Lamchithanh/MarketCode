"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { HydrationBoundary } from "@/components/ui/hydration-boundary";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <HydrationBoundary>
        {children}
      </HydrationBoundary>
    </SessionProvider>
  );
}
