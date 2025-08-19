import { useState, useEffect } from 'react';

interface SystemSettings {
  contact_email?: string;
  support_email?: string;
  site_name?: string;
  enable_email_verification?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/settings');
      const result = await response.json();
      
      if (result.success) {
        setSettings(result.settings || {});
      } else {
        throw new Error(result.error || 'Failed to fetch settings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching settings:', err);
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
    refreshSettings: fetchSettings
  };
}
