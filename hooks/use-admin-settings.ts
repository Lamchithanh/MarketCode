import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsData {
  [key: string]: string | number | boolean | object;
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [settingsData, setSettingsData] = useState<SettingsData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/settings');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setSettingsData(result.data);
        
        // Convert settings data to array format for table display
        const settingsArray: Setting[] = Object.entries(result.data).map(([key, value]) => ({
          id: key, // Using key as ID
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value),
          type: typeof value === 'boolean' ? 'boolean' : 
                typeof value === 'number' ? 'number' : 
                typeof value === 'object' ? 'json' : 'string',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        setSettings(settingsArray);
      } else {
        console.error('API response:', result);
        throw new Error(result.error || 'Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      setSettings([]);
      setSettingsData({});
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSetting = useCallback(async (key: string, value: string, type: string) => {
    try {
      setSaving(true);
      
      // Parse value based on type
      let parsedValue: string | number | boolean | object = value;
      switch (type) {
        case 'boolean':
          parsedValue = value === 'true' || value === '1';
          break;
        case 'number':
          parsedValue = Number(value);
          break;
        case 'json':
          try {
            parsedValue = JSON.parse(value);
          } catch {
            throw new Error('Invalid JSON format');
          }
          break;
      }

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value: parsedValue }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        toast.success('Setting updated successfully');
        await fetchSettings(); // Refresh settings
      } else {
        throw new Error(result.error || 'Failed to update setting');
      }
    } catch (err) {
      console.error('Error updating setting:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update setting';
      toast.error(errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [fetchSettings]);

  const deleteSetting = useCallback(async (key: string) => {
    try {
      setSaving(true);
      
      const response = await fetch(`/api/admin/settings?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        toast.success('Setting deleted successfully');
        await fetchSettings(); // Refresh settings
      } else {
        throw new Error(result.error || 'Failed to delete setting');
      }
    } catch (err) {
      console.error('Error deleting setting:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete setting';
      toast.error(errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [fetchSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    settingsData,
    loading,
    saving,
    error,
    fetchSettings,
    updateSetting,
    deleteSetting,
  };
}
