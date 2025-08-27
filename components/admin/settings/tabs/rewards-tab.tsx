import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users, Gift, MessageSquare } from 'lucide-react';
import { SettingField } from '../shared/setting-field';

interface RewardsTabProps {
  settingsData: Record<string, string | number | boolean | object>;
  editedSettings: Record<string, string | number | boolean>;
  onSettingChange: (key: string, value: string | number | boolean) => void;
}

// Nhóm cài đặt phần thưởng
const rewardSettings = [
  { key: 'profile_completion_reward_enabled', label: 'Bật phần thưởng hồ sơ', type: 'boolean' as const },
  { key: 'profile_completion_coupon_code', label: 'Mã coupon hoàn thành hồ sơ', type: 'string' as const, placeholder: 'COMPLETE_PROFILE_10' }
];

// Nhóm thông báo
const messageSettings = [
  { key: 'profile_completion_reward_message', label: 'Thông báo phần thưởng', type: 'textarea' as const, placeholder: 'Chúc mừng! Bạn đã hoàn tất hồ sơ và nhận được mã giảm giá!' }
];

export function RewardsTab({ settingsData, editedSettings, onSettingChange }: RewardsTabProps) {
  const getCurrentValue = (key: string): string | number | boolean => {
    const editedValue = editedSettings[key];
    if (editedValue !== undefined) {
      return editedValue;
    }
    
    const dataValue = settingsData[key];
    if (typeof dataValue === 'object') {
      return '';
    }
    return dataValue || '';
  };

  const hasChanged = (key: string) => {
    return editedSettings[key] !== undefined;
  };

  const renderSettingsGroup = (
    title: string, 
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>, 
    settings: Array<{
      key: string;
      label: string;
      type: 'string' | 'number' | 'boolean' | 'textarea' | 'email' | 'url';
      placeholder?: string;
      min?: number;
      max?: number;
    }>,
    description: string
  ) => {
    const IconComponent = icon;
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <IconComponent className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {settings.map((setting, index) => (
              <React.Fragment key={setting.key}>
                <SettingField
                  setting={setting}
                  currentValue={getCurrentValue(setting.key)}
                  hasChanged={hasChanged(setting.key)}
                  onSettingChange={onSettingChange}
                />
                {index < settings.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Hiển thị thông tin profile_completion_required_fields
  const requiredFieldsValue = getCurrentValue('profile_completion_required_fields');
  let requiredFieldsDisplay = 'Không có dữ liệu';
  
  if (typeof requiredFieldsValue === 'string') {
    try {
      const fields = JSON.parse(requiredFieldsValue);
      if (Array.isArray(fields)) {
        requiredFieldsDisplay = fields.join(', ');
      }
    } catch {
      requiredFieldsDisplay = String(requiredFieldsValue);
    }
  }

  return (
    <div className="space-y-6">
      {renderSettingsGroup(
        'Cài đặt phần thưởng',
        Gift,
        rewardSettings,
        'Cấu hình hệ thống phần thưởng cho người dùng hoàn thành hồ sơ'
      )}

      {renderSettingsGroup(
        'Thông báo phần thưởng',
        MessageSquare,
        messageSettings,
        'Tin nhắn hiển thị khi người dùng nhận phần thưởng'
      )}    
    </div>
  );
}
