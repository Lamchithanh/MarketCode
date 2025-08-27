"use client";

import { useState, useEffect } from 'react';

interface SystemSettings {
  siteName: string;
  logoUrl: string;
  emailFromName: string;
}

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'MarketCode',
    logoUrl: '',
    emailFromName: 'MarketCode Team',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/system-settings');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching system settings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Keep fallback values on error
      setSettings({
        siteName: 'MarketCode',
        logoUrl: '',
        emailFromName: 'MarketCode Team',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
  };
};
