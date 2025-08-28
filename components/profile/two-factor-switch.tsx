'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { TwoFactorManager } from '@/components/ui/two-factor-manager';

interface TwoFactorSwitchProps {
  userId: string;
  initialEnabled?: boolean;
  userRole?: string;
}

export function TwoFactorSwitch({ 
  userId, 
  initialEnabled = false,
  userRole = 'USER' 
}: TwoFactorSwitchProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [loading, setLoading] = useState(false);
  const [showManager, setShowManager] = useState(false);

  // Get current 2FA status from user settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/user/settings');
        const data = await response.json();
        
        if (data.success && data.settings) {
          setEnabled(data.settings.twoFactorEnabled || false);
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      // If enabling, show 2FA setup manager
      setShowManager(true);
    } else {
      // If disabling, directly update setting
      await updateSetting(false);
    }
  };

  const updateSetting = async (value: boolean) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: {
            twoFactorEnabled: value
          }
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update settings');
      }

      if (result.success) {
        setEnabled(value);
        toast.success(
          value 
            ? 'Đã bật xác thực 2FA thành công!' 
            : 'Đã tắt xác thực 2FA thành công!'
        );
      } else {
        throw new Error(result.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating 2FA setting:', error);
      toast.error('Có lỗi xảy ra khi cập nhật cài đặt 2FA');
      // Revert the switch state
      setEnabled(!value);
    } finally {
      setLoading(false);
    }
  };

  const handleManagerStatusChange = (newEnabled: boolean) => {
    if (newEnabled) {
      // 2FA was successfully enabled
      updateSetting(true);
    }
    setShowManager(false);
  };

  return (
    <>
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {enabled ? (
                <ShieldCheck className="w-5 h-5 text-green-600" />
              ) : (
                <Shield className="w-5 h-5 text-gray-500" />
              )}
              <CardTitle className="text-base">Xác thực 2 yếu tố (2FA)</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <Switch
                checked={enabled}
                onCheckedChange={handleToggle}
                disabled={loading}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription>
            {enabled ? (
              <span className="text-green-700">
                Tài khoản của bạn được bảo vệ bởi xác thực 2 yếu tố
              </span>
            ) : (
              <span className="text-gray-600">
                Tăng cường bảo mật tài khoản bằng xác thực 2 yếu tố
              </span>
            )}
          </CardDescription>
        </CardContent>
      </Card>

      {/* 2FA Manager Modal */}
      {showManager && (
        <TwoFactorManager
          userId={userId}
          userRole={userRole}
          onStatusChange={handleManagerStatusChange}
          isOpen={showManager}
          onClose={() => setShowManager(false)}
        />
      )}
    </>
  );
}
