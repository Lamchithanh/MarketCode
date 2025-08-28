"use client";

import { useState, useEffect } from 'react';

interface SystemSettings {
  siteName: string;
  logoUrl: string;
  emailFromName: string;
  
  // Email settings
  email_service_enabled: boolean;
  email_smtp_host: string;
  email_smtp_port: number;
  email_smtp_user: string;
  email_smtp_password: string;
  email_smtp_secure: boolean;
  email_from_address: string;
  
  // 2FA settings
  admin_2fa_enabled: boolean;
  user_2fa_enabled: boolean;
  '2fa_issuer_name': string;
  '2fa_backup_codes_count': number;
  '2fa_token_window': number;
  '2fa_qr_code_size': number;
  user_can_disable_2fa: boolean;
  '2fa_setup_email_enabled': boolean;
  login_require_2fa_for_admin: boolean;
  login_require_2fa_for_user: boolean;
  
  // Site settings
  site_description: string;
  maintenance_mode: boolean;
  enable_registration: boolean;
  enable_email_verification: boolean;
}

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<Partial<SystemSettings>>({
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
      
      // Convert settings array to object if needed
      if (Array.isArray(data.settings)) {
        const settingsObj: Partial<SystemSettings> = {};
        data.settings.forEach((setting: { key: string; value: string; type: string }) => {
          let value: unknown = setting.value;
          
          // Convert types based on setting type
          if (setting.type === 'boolean') {
            value = setting.value === 'true';
          } else if (setting.type === 'number') {
            value = parseInt(setting.value) || 0;
          } else if (setting.type === 'json') {
            try {
              value = JSON.parse(setting.value);
            } catch {
              value = setting.value;
            }
          }
          
          (settingsObj as Record<string, unknown>)[setting.key] = value;
        });
        
        setSettings(prev => ({ ...prev, ...settingsObj }));
      } else {
        setSettings(prev => ({ ...prev, ...data }));
      }
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

  const updateSetting = async (key: keyof SystemSettings, value: string | number | boolean) => {
    try {
      const response = await fetch('/api/admin/system/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });

      const data = await response.json();

      if (data.success) {
        setSettings(prev => ({ ...prev, [key]: value }));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to update setting' };
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      return { success: false, error: 'Failed to update setting' };
    }
  };

  const toggleSetting = async (key: keyof SystemSettings) => {
    const currentValue = settings[key] as boolean;
    return await updateSetting(key, !currentValue);
  };

  // Helper methods for specific settings
  const toggle2FAForSystem = (enabled: boolean) => updateSetting('admin_2fa_enabled', enabled);
  const toggle2FAForUsers = (enabled: boolean) => updateSetting('user_2fa_enabled', enabled);
  const toggleEmailService = (enabled: boolean) => updateSetting('email_service_enabled', enabled);
  const toggleMaintenanceMode = (enabled: boolean) => updateSetting('maintenance_mode', enabled);
  const toggleRegistration = (enabled: boolean) => updateSetting('enable_registration', enabled);

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSetting,
    toggleSetting,
    // Specific toggles
    toggle2FAForSystem,
    toggle2FAForUsers,
    toggleEmailService,
    toggleMaintenanceMode,
    toggleRegistration,
  };
};
