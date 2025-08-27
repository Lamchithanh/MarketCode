import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Globe } from 'lucide-react';
import { SettingField } from '../shared/setting-field';

interface BasicInfoTabProps {
  settingsData: Record<string, string | number | boolean | object>;
  editedSettings: Record<string, string | number | boolean>;
  onSettingChange: (key: string, value: string | number | boolean) => void;
}

const basicInfoSettings = [
  { key: 'site_name', label: 'Tên website', type: 'string' as const, placeholder: 'MarketCode' },
  { key: 'site_description', label: 'Mô tả website', type: 'textarea' as const, placeholder: 'Nền tảng mua bán mã nguồn chất lượng cao' },
  { key: 'site_title', label: 'Tiêu đề website', type: 'string' as const, placeholder: 'MarketCode - Premium Source Code' },
  { key: 'hero_title', label: 'Tiêu đề hero', type: 'string' as const, placeholder: 'Khám phá mã nguồn chất lượng cao' },
  { key: 'hero_subtitle', label: 'Phụ đề hero', type: 'string' as const, placeholder: 'Nơi các lập trình viên chia sẻ và mua bán mã nguồn cao cấp' },
  { key: 'footer_text', label: 'Text footer', type: 'string' as const, placeholder: '© 2025 MarketCode. Tất cả quyền được bảo lưu.' }
];

export function BasicInfoTab({ settingsData, editedSettings, onSettingChange }: BasicInfoTabProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-primary" />
          Thông tin cơ bản website
        </CardTitle>
        <p className="text-muted-foreground">
          Cấu hình thông tin chung và hiển thị của website MarketCode
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {basicInfoSettings.map((setting, index) => (
            <React.Fragment key={setting.key}>
              <SettingField
                setting={setting}
                currentValue={getCurrentValue(setting.key)}
                hasChanged={hasChanged(setting.key)}
                onSettingChange={onSettingChange}
              />
              {index < basicInfoSettings.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
