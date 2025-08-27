'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

// Import tab components
import { BasicInfoTab } from './tabs/basic-info-tab';
import { ContactTab } from './tabs/contact-tab';
import { EmailTab } from './tabs/email-tab';
import { SystemTab } from './tabs/system-tab';
import { BrandingTab } from './tabs/branding-tab';
import { RewardsTab } from './tabs/rewards-tab';
import { PaymentTab } from './tabs/payment-tab';

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  component: React.ComponentType<{
    settingsData: Record<string, string | number | boolean | object>;
    editedSettings: Record<string, string | number | boolean>;
    onSettingChange: (key: string, value: string | number | boolean) => void;
  }>;
}

const tabs: TabConfig[] = [
  {
    id: 'basic',
    label: 'Thông tin cơ bản',
    icon: Globe,
    component: BasicInfoTab
  },
  {
    id: 'contact',
    label: 'Liên hệ',
    icon: Mail,
    component: ContactTab
  },
  {
    id: 'email',
    label: 'Email',
    icon: Bell,
    component: EmailTab
  },
  {
    id: 'system',
    label: 'Hệ thống',
    icon: Settings,
    component: SystemTab
  },
  {
    id: 'branding',
    label: 'Thương hiệu',
    icon: Image,
    component: BrandingTab
  },
  {
    id: 'rewards',
    label: 'Phần thưởng',
    icon: Users,
    component: RewardsTab
  },
  {
    id: 'payment',
    label: 'Thanh toán',
    icon: DollarSign,
    component: PaymentTab
  }
];

export function SettingsTabs() {
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
  const [activeTab, setActiveTab] = useState('basic');

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
        return updateSetting(key, String(value), typeof value);
      });

      await Promise.all(savePromises);
      
      setEditedSettings({});
      setHasChanges(false);
      toast.success('Đã lưu tất cả cài đặt thành công!');
    } catch (error) {
      toast.error('Có lỗi khi lưu cài đặt');
      console.error('Error saving settings:', error);
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

      {/* Settings Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {tabs.map((tab) => {
              const TabComponent = tab.component;
              return (
                <TabsContent key={tab.id} value={tab.id} className="mt-6">
                  <TabComponent
                    settingsData={settingsData}
                    editedSettings={editedSettings}
                    onSettingChange={handleSettingChange}
                  />
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>

      {/* Save Reminder */}
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
