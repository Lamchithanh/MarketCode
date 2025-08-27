import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings } from 'lucide-react';
import { SettingField } from '../shared/setting-field';

interface SystemTabProps {
  settingsData: Record<string, string | number | boolean | object>;
  editedSettings: Record<string, string | number | boolean>;
  onSettingChange: (key: string, value: string | number | boolean) => void;
}

const systemSettings = [
  { key: 'maintenance_mode', label: 'Chế độ bảo trì', type: 'boolean' as const },
  { key: 'max_file_upload_size', label: 'Kích thước file tối đa (MB)', type: 'number' as const, min: 1, max: 100 },
  { key: 'items_per_page', label: 'Số item mỗi trang', type: 'number' as const, min: 5, max: 100, placeholder: '10' },
];

export function SystemTab({ settingsData, editedSettings, onSettingChange }: SystemTabProps) {
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
          <Settings className="h-5 w-5 text-primary" />
          Cài đặt hệ thống và bảo mật
        </CardTitle>
        <p className="text-muted-foreground">
          Cấu hình các tham số hệ thống, giới hạn và bảo mật
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {systemSettings.map((setting, index) => (
            <React.Fragment key={setting.key}>
              <SettingField
                setting={setting}
                currentValue={getCurrentValue(setting.key)}
                hasChanged={hasChanged(setting.key)}
                onSettingChange={onSettingChange}
              />
              {index < systemSettings.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
