"use client";

import { useEmailSupport } from "@/hooks/use-email-support";

export function ClientEmailSupport() {
  const { email, loading } = useEmailSupport();
  
  if (loading) {
    return <span className="text-muted-foreground">Đang tải...</span>;
  }
  
  return <span>{email}</span>;
}
