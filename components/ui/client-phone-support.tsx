"use client";

import { useCartSettings } from "@/hooks/use-cart-settings";

export function ClientPhoneSupport() {
  const { settings, loading } = useCartSettings();
  
  if (loading) {
    return <span className="text-muted-foreground">Đang tải...</span>;
  }
  
  return <span>{settings.supportPhone} ({settings.supportHours})</span>;
}
