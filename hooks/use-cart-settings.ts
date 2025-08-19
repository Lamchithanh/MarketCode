"use client";

import { useState, useEffect } from 'react';

interface CartSettings {
  supportEmail: string;
  supportPhone: string;
  supportHours: string;
  vatRate: number;
}

export function useCartSettings() {
  const [settings, setSettings] = useState<CartSettings>({
    supportEmail: 'support@marketcode.com',
    supportPhone: '1900 1234',
    supportHours: '8:00 - 22:00',
    vatRate: 10
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        
        if (data.success && data.settings) {
          setSettings({
            supportEmail: data.settings.contact_email || 'support@marketcode.com',
            supportPhone: data.settings.support_phone || '1900 1234', 
            supportHours: data.settings.support_hours || '8:00 - 22:00',
            vatRate: data.settings.vat_rate || 10
          });
        }
      } catch (error) {
        console.error('Failed to fetch cart settings:', error);
        // Keep default fallback values
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, loading };
}
