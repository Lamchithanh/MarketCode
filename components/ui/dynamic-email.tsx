"use client";

import { useSystemSettings } from "@/hooks/use-settings";

interface DynamicEmailProps {
  fallback?: string;
}

export function DynamicEmail({ fallback = 'support@marketcode.com' }: DynamicEmailProps) {
  const { settings, loading } = useSystemSettings();

  if (loading) {
    return <span className="animate-pulse">{fallback}</span>;
  }

  return <span>{settings.support_email || fallback}</span>;
}
