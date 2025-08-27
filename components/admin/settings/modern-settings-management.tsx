'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  RefreshCw, 
  Globe, 
  Mail, 
  Settings, 
  DollarSign,
  Users,
  Bell,
  Image,
  Loader2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useAdminSettings } from '@/hooks/use-admin-settings';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

import React from 'react';

interface SettingGroup {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  settings: {
    key: string;
    label: string;
    description?: string;
    type: 'string' | 'number' | 'boolean' | 'textarea' | 'email' | 'url';
    placeholder?: string;
    min?: number;
    max?: number;
  }[];
}

const settingGroups: SettingGroup[] = [
  {
    title: 'Thông tin cơ bản',
    icon: Globe,
    description: 'Cài đặt thông tin chung của website',
    settings: [
      { key: 'site_name', label: 'Tên website', type: 'string', placeholder: 'MarketCode' },
      { key: 'site_description', label: 'Mô tả website', type: 'textarea', placeholder: 'Nền tảng mua bán mã nguồn chất lượng cao' },
      { key: 'site_title', label: 'Tiêu đề website', type: 'string', placeholder: 'MarketCode - Premium Source Code' },
      { key: 'hero_title', label: 'Tiêu đề hero', type: 'string', placeholder: 'Khám phá mã nguồn chất lượng cao' },
      { key: 'hero_subtitle', label: 'Phụ đề hero', type: 'string', placeholder: 'Nơi các lập trình viên chia sẻ và vá mua bán mã nguồn cao' },
      { key: 'footer_text', label: 'Text footer', type: 'string', placeholder: '© 2025 MarketCode. Tất cả quyền được bảo lưu.' }
    ]
  },
  {
    title: 'Thông tin liên hệ',
    icon: Mail,
    description: 'Cài đặt thông tin liên hệ và hỗ trợ',
    settings: [
      { key: 'contact_email', label: 'Email liên hệ', type: 'email', placeholder: 'contact@marketcode.com' },
      { key: 'support_email', label: 'Email hỗ trợ', type: 'email', placeholder: 'support@marketcode.com' },
      { key: 'email_from_address', label: 'Email gửi', type: 'email', placeholder: 'noreply@marketcode.com' },
      { key: 'email_from_name', label: 'Tên người gửi', type: 'string', placeholder: 'MarketCode Team' },
      { key: 'support_phone', label: 'Số điện thoại hỗ trợ', type: 'string', placeholder: '0981911449' },
      { key: 'support_hours', label: 'Giờ hỗ trợ', type: 'string', placeholder: '8:00 - 22:00' }
    ]
  },
  {
    title: 'Cài đặt email',
    icon: Bell,
    description: 'Cấu hình SMTP và email',
    settings: [
      { key: 'email_smtp_host', label: 'SMTP Host', type: 'string', placeholder: 'smtp.gmail.com' },
      { key: 'email_smtp_port', label: 'SMTP Port', type: 'number', placeholder: '587', min: 1, max: 65535 },
      { key: 'enable_email_verification', label: 'Xác thực email', type: 'boolean' },
      { key: 'enable_registration', label: 'Cho phép đăng ký', type: 'boolean' }
    ]
  },
  {
    title: 'Cài đặt hệ thống',
    icon: Settings,
    description: 'Cấu hình hệ thống và bảo mật',
    settings: [
      { key: 'maintenance_mode', label: 'Chế độ bảo trì', type: 'boolean' },
      { key: 'max_file_upload_size', label: 'Kích thước file tối đa (MB)', type: 'number', min: 1, max: 100 },
      { key: 'items_per_page', label: 'Số item mỗi trang', type: 'number', min: 5, max: 100, placeholder: '10' },
      { key: 'vat_rate', label: 'Thuế VAT (%)', type: 'number', min: 0, max: 100, placeholder: '10' }
    ]
  },
  {
    title: 'Hình ảnh & Thương hiệu',
    icon: Image,
    description: 'Logo, favicon và hình ảnh thương hiệu',
    settings: [
      { key: 'logo_url', label: 'URL Logo', type: 'url', placeholder: '/images/logo.png' },
      { key: 'favicon_url', label: 'URL Favicon', type: 'url', placeholder: '/favicon.ico' }
    ]
  },
  {
    title: 'Phần thưởng & Hoàn thành hồ sơ',
    icon: Users,
    description: 'Cài đặt hệ thống phần thưởng người dùng',
    settings: [
      { key: 'profile_completion_coupon_code', label: 'Mã coupon hoàn thành hồ sơ', type: 'string', placeholder: 'COMPLETE_PROFILE_10' },
      { key: 'profile_completion_reward_enabled', label: 'Bật phần thưởng hồ sơ', type: 'boolean' },
      { key: 'profile_completion_reward_message', label: 'Thông báo phần thưởng', type: 'textarea', placeholder: 'Chúc mừng! Bạn đã hoàn tất hồ sơ và nhận được mã giảm giá!' }
    ]
  },
  {
    title: 'Tiền tệ & Thanh toán',
    icon: DollarSign,
    description: 'Cài đặt tiền tệ và thanh toán',
    settings: [
      { key: 'currency', label: 'Đơn vị tiền tệ', type: 'string', placeholder: 'VND' },
      { key: 'backup_frequency', label: 'Tần suất backup', type: 'string', placeholder: 'daily' }
    ]
  }
];

export function ModernSettingsManagement() {
  const { 
    settingsData, 
    loading, 
    saving,
    error, 
    fetchSettings,
    updateSetting 
  } = useAdminSettings();

  const [editedSettings, setEditedSettings] = useState<Record<string, string | number | boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: string, value: string | number | boolean) => {
    setEditedSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    try {
      const savePromises = Object.entries(editedSettings).map(([key, value]) => {
        const setting = settingGroups
          .flatMap(group => group.settings)
          .find(s => s.key === key);
        
        if (setting) {
          return updateSetting(key, String(value), setting.type);
        }
      }).filter(Boolean);

      await Promise.all(savePromises);
      
      setEditedSettings({});
      setHasChanges(false);
      toast.success('Đã lưu tất cả cài đặt thành công!');
    } catch (error) {
      toast.error('Có lỗi khi lưu cài đặt');
      console.error('Error saving settings:', error);
    }
  };

  const getCurrentValue = (key: string) => {
    return editedSettings[key] !== undefined 
      ? editedSettings[key] 
      : settingsData[key] || '';
  };

  const renderSettingField = (setting: SettingGroup['settings'][0]) => {
    const currentValue = getCurrentValue(setting.key);
    const hasChanged = editedSettings[setting.key] !== undefined;

    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor={setting.key}>{setting.label}</Label>
              {setting.description && (
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasChanged && <Badge variant="outline" className="text-xs">Đã thay đổi</Badge>}
              <Switch
                id={setting.key}
                checked={currentValue === true || currentValue === 'true'}
                onCheckedChange={(checked) => 
                  handleSettingChange(setting.key, checked)
                }
              />
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={setting.key}>{setting.label}</Label>
              {hasChanged && <Badge variant="outline" className="text-xs">Đã thay đổi</Badge>}
            </div>
            {setting.description && (
              <p className="text-sm text-muted-foreground">{setting.description}</p>
            )}
            <Textarea
              id={setting.key}
              value={String(currentValue)}
              placeholder={setting.placeholder}
              onChange={(e) => handleSettingChange(setting.key, e.target.value)}
              rows={3}
            />
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={setting.key}>{setting.label}</Label>
              {hasChanged && <Badge variant="outline" className="text-xs">Đã thay đổi</Badge>}
            </div>
            {setting.description && (
              <p className="text-sm text-muted-foreground">{setting.description}</p>
            )}
            <Input
              id={setting.key}
              type="number"
              value={String(currentValue)}
              placeholder={setting.placeholder}
              min={setting.min}
              max={setting.max}
              onChange={(e) => handleSettingChange(setting.key, Number(e.target.value))}
            />
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={setting.key}>{setting.label}</Label>
              {hasChanged && <Badge variant="outline" className="text-xs">Đã thay đổi</Badge>}
            </div>
            {setting.description && (
              <p className="text-sm text-muted-foreground">{setting.description}</p>
            )}
            <Input
              id={setting.key}
              type={setting.type === 'email' ? 'email' : setting.type === 'url' ? 'url' : 'text'}
              value={String(currentValue)}
              placeholder={setting.placeholder}
              onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải cài đặt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          Lỗi khi tải cài đặt: {error}
          <Button 
            onClick={fetchSettings} 
            className="ml-2" 
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý và cấu hình các tham số hệ thống MarketCode
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={fetchSettings} 
            variant="outline"
            disabled={loading || saving}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          
          {hasChanges && (
            <Button 
              onClick={handleSaveAll} 
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Lưu tất cả thay đổi ({Object.keys(editedSettings).length})
            </Button>
          )}
        </div>
      </div>

      {/* Settings Groups */}
      <div className="grid gap-8">
        {settingGroups.map((group, groupIndex) => {
          const IconComponent = group.icon;
          return (
            <Card key={groupIndex} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <IconComponent className="h-6 w-6 text-primary" />
                  {group.title}
                </CardTitle>
                <p className="text-muted-foreground">{group.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-6">
                  {group.settings.map((setting, settingIndex) => (
                    <div key={setting.key}>
                      {renderSettingField(setting)}
                      {settingIndex < group.settings.length - 1 && (
                        <Separator className="mt-6" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer with save reminder */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="bg-yellow-50 border-yellow-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  Bạn có {Object.keys(editedSettings).length} thay đổi chưa được lưu
                </span>
                <Button 
                  onClick={handleSaveAll} 
                  disabled={saving}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Lưu ngay
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
