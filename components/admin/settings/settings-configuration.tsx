"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Palette, 
  Server, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Loader2,
  Globe,
  Mail,
  Hash,
  Type,
  Image,
  Database,
  Shield,
  LucideIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { SettingsStats } from './settings-stats';
import { SettingsBackupRestore } from './settings-backup-restore';
import { SystemStatus } from './system-status';

interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface GroupedSettings {
  general: Setting[];
  branding: Setting[];
  system: Setting[];
}

export default function SettingsConfiguration() {
  const [settings, setSettings] = useState<GroupedSettings>({
    general: [],
    branding: [],
    system: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changes, setChanges] = useState<Record<string, string>>({});

  const SETTING_LABELS: Record<string, { label: string; icon: LucideIcon; description?: string }> = {
    // General Settings - Chỉ giữ các cài đặt quan trọng
    'site_name': { label: 'Tên website', icon: Globe, description: 'Tên hiển thị của website' },
    'site_description': { label: 'Mô tả website', icon: Type, description: 'Mô tả ngắn gọn về website' },
    'contact_email': { label: 'Email liên hệ', icon: Mail, description: 'Email chính để liên hệ' },
    'items_per_page': { label: 'Số mục mỗi trang', icon: Hash, description: 'Số sản phẩm hiển thị mỗi trang' },
    'enable_registration': { label: 'Cho phép đăng ký', icon: Shield, description: 'Người dùng có thể tự đăng ký tài khoản' },
    'enable_email_verification': { label: 'Xác thực email', icon: Mail, description: 'Yêu cầu xác thực email khi đăng ký' },
    'currency': { label: 'Đơn vị tiền tệ', icon: Hash, description: 'Đơn vị tiền tệ mặc định' },
    'maintenance_mode': { label: 'Chế độ bảo trì', icon: Settings, description: 'Tạm thời tắt website để bảo trì' },

    // Branding Settings - Chỉ giữ những thứ cần thiết
    'logo_url': { label: 'URL Logo', icon: Image, description: 'Đường dẫn tới logo của website' },
    'footer_text': { label: 'Văn bản footer', icon: Type, description: 'Văn bản hiển thị ở cuối trang' },
    'hero_title': { label: 'Tiêu đề trang chủ', icon: Type, description: 'Tiêu đề chính trang chủ' },
    'hero_subtitle': { label: 'Phụ đề trang chủ', icon: Type, description: 'Phụ đề trang chủ' },

    // System Settings - Chỉ các cài đặt quan trọng
    'max_file_upload_size': { label: 'Dung lượng file tối đa (MB)', icon: Database, description: 'Dung lượng tối đa cho file upload' },
    'email_smtp_host': { label: 'SMTP Host', icon: Server, description: 'Máy chủ SMTP để gửi email' },
    'email_smtp_port': { label: 'SMTP Port', icon: Server, description: 'Cổng kết nối SMTP' },
    'email_from_name': { label: 'Tên người gửi email', icon: Mail, description: 'Tên hiển thị khi gửi email' },
    'email_from_address': { label: 'Địa chỉ email gửi', icon: Mail, description: 'Email dùng để gửi thông báo' },
    'backup_frequency': { label: 'Tần suất backup', icon: Database, description: 'Tần suất sao lưu dữ liệu' }
  };

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      setLoading(true);
      console.log('Fetching settings...');
      
      // Add timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/admin/settings', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Settings data:', data);
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        toast.error('Timeout: Không thể kết nối đến server');
      } else {
        toast.error('Lỗi khi tải cài đặt: ' + (error as Error).message);
      }
      
      // Set empty data to stop loading
      setSettings({
        general: [],
        branding: [],
        system: []
      });
    } finally {
      setLoading(false);
      console.log('Finished fetching settings');
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setChanges(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getCurrentValue = (setting: Setting) => {
    return changes[setting.key] !== undefined ? changes[setting.key] : setting.value;
  };

  const hasChanges = Object.keys(changes).length > 0;

  // Fetch settings when component mounts
  useEffect(() => {
    fetchSettings();
  }, []);

  // Cảnh báo khi rời trang mà chưa lưu thay đổi
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = 'Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời trang?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const handleSaveChanges = async () => {
    if (!hasChanges) return;
    
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings: changes })
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      const result = await response.json();
      toast.success(`Đã cập nhật ${result.updatedCount} cài đặt thành công`);
      
      // Clear changes and reload settings
      setChanges({});
      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Lỗi khi lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  const handleResetChanges = () => {
    setChanges({});
    toast.info('Đã hủy các thay đổi');
  };

  const renderInput = (setting: Setting) => {
    const config = SETTING_LABELS[setting.key];
    const currentValue = getCurrentValue(setting);
    const Icon = config?.icon || Settings;

    if (setting.type === 'boolean') {
      return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label className="text-base flex items-center">
              <Icon className="h-4 w-4 mr-2" />
              {config?.label || setting.key}
            </Label>
            {config?.description && (
              <p className="text-sm text-muted-foreground">{config.description}</p>
            )}
          </div>
          <Switch
            checked={currentValue === 'true'}
            onCheckedChange={(checked) => handleInputChange(setting.key, String(checked))}
          />
        </div>
      );
    }

    if (setting.type === 'text' || setting.key.includes('description') || setting.key.includes('footer_text')) {
      return (
        <div className="space-y-2 p-4 border rounded-lg">
          <Label htmlFor={setting.key} className="flex items-center">
            <Icon className="h-4 w-4 mr-2" />
            {config?.label || setting.key}
          </Label>
          {config?.description && (
            <p className="text-sm text-muted-foreground">{config.description}</p>
          )}
          <Textarea
            id={setting.key}
            value={currentValue}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="resize-none"
            rows={3}
          />
          <div className="flex justify-end space-x-2 mt-3">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                // Reset this field
                const originalValue = setting.value;
                handleInputChange(setting.key, originalValue);
                // Remove from changes if it matches original
                if (originalValue === currentValue) {
                  const newChanges = { ...changes };
                  delete newChanges[setting.key];
                  setChanges(newChanges);
                }
              }}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Hủy
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2 p-4 border rounded-lg">
        <Label htmlFor={setting.key} className="flex items-center">
          <Icon className="h-4 w-4 mr-2" />
          {config?.label || setting.key}
        </Label>
        {config?.description && (
          <p className="text-sm text-muted-foreground">{config.description}</p>
        )}
        <Input
          id={setting.key}
          type={setting.type === 'number' ? 'number' : setting.type === 'url' ? 'url' : 'text'}
          value={currentValue}
          onChange={(e) => handleInputChange(setting.key, e.target.value)}
          className={setting.type === 'number' ? '' : 'font-mono text-sm'}
        />
        <div className="flex justify-end space-x-2 mt-3">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              // Reset this field
              const originalValue = setting.value;
              handleInputChange(setting.key, originalValue);
              // Remove from changes if it matches original
              if (originalValue === currentValue) {
                const newChanges = { ...changes };
                delete newChanges[setting.key];
                setChanges(newChanges);
              }
            }}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Hủy
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Đang tải cài đặt...</p>
          <p className="text-xs text-muted-foreground mt-1">
            Nếu quá lâu, hãy kiểm tra kết nối mạng
          </p>
        </div>
      </div>
    );
  }

  // Show message if no settings loaded
  const totalSettings = (settings?.general?.length || 0) + (settings?.branding?.length || 0) + (settings?.system?.length || 0);
  if (totalSettings === 0 && !loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-muted-foreground">Không thể tải cài đặt</p>
          <Button onClick={fetchSettings} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cài đặt hệ thống</h2>
          <p className="text-muted-foreground">
            Quản lý các cài đặt chung, thương hiệu và hệ thống
          </p>
        </div>
        
        {hasChanges && (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <XCircle className="h-3 w-3 mr-1" />
              {Object.keys(changes).length} thay đổi
            </Badge>
            <Button variant="outline" onClick={handleResetChanges}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSaveChanges} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Lưu thay đổi
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      <SettingsStats settings={settings} />

      {hasChanges && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Bạn có {Object.keys(changes).length} thay đổi chưa được lưu. Nhớ nhấn &quot;Lưu thay đổi&quot; để áp dụng các cài đặt mới.
          </AlertDescription>
        </Alert>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt chung
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            Thương hiệu
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center">
            <Server className="h-4 w-4 mr-2" />
            Hệ thống
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Backup
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Cài đặt chung
              </CardTitle>
              <CardDescription>
                Các cài đặt cơ bản của website như tên, mô tả, email liên hệ...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings.general.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  {renderInput(setting)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Cài đặt thương hiệu
              </CardTitle>
              <CardDescription>
                Tùy chỉnh logo, màu sắc, mạng xã hội và giao diện của website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings.branding.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  {renderInput(setting)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 mr-2" />
                Cài đặt hệ thống
              </CardTitle>
              <CardDescription>
                Cài đặt kỹ thuật như email SMTP, backup, bảo mật và hiệu suất
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings.system.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  {renderInput(setting)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Restore */}
        <TabsContent value="backup" className="space-y-6">
          <SystemStatus />
          <SettingsBackupRestore />
        </TabsContent>
      </Tabs>

      {/* Floating Action Bar - Hiển thị khi có thay đổi */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="shadow-lg border-2 border-primary">
            <CardContent className="flex items-center space-x-4 p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">
                  Bạn có {Object.keys(changes).length} thay đổi chưa lưu
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleResetChanges}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Hủy tất cả
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSaveChanges} 
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {saving ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3 mr-1" />
                  )}
                  Lưu tất cả thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
