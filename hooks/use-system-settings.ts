"use client";

import { useState, useEffect } from 'react';

interface SystemSettings {
  // Site Identity
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  
  // Version
  version: string;
  
  // Contact Information
  contactEmail: string;
  supportEmail: string;
  supportPhone: string;
  supportHours: string;
  
  // Company Info
  companyAddress: string;
  companyDescription: string;
  copyrightText: string;
  
  // Social Media
  socialLinks: {
    facebook: { url: string; enabled: boolean };
    github: { url: string; enabled: boolean };
    youtube: { url: string; enabled: boolean };
    tiktok: { url: string; enabled: boolean };
  };
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<Partial<SystemSettings>>({
    siteName: 'MarketCode',
    siteTitle: 'MarketCode - Premium Source Code Platform',
    siteDescription: 'Nền tảng mua bán mã nguồn chất lượng cao',
    logoUrl: '/placeholder-image.svg',
    faviconUrl: '/favicon.ico',
    version: '1.0.0',
    contactEmail: 'contact@marketcode.com',
    supportEmail: 'support@marketcode.com',
    supportPhone: '',
    supportHours: '24/7',
    companyAddress: '',
    companyDescription: '',
    copyrightText: '© 2024 MarketCode. All rights reserved.',
    socialLinks: {
      facebook: { url: '', enabled: false },
      github: { url: '', enabled: false },
      youtube: { url: '', enabled: false },
      tiktok: { url: '', enabled: false }
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/system-settings');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSettings(data);

    } catch (err) {
      console.error('Error fetching system settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings: settings as SystemSettings,
    loading,
    error,
    refetch: fetchSettings
  };
}
