import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bell } from 'lucide-react';
import { SettingField } from '../shared/setting-field';

interface EmailTabProps {
  settingsData: Record<string, string | number | boolean | object>;
  editedSettings: Record<string, string | number | boolean>;
  onSettingChange: (key: string, value: string | number | boolean) => void;
}

const emailSettings = [
  { key: 'email_smtp_host', label: 'SMTP Host', type: 'string' as const, placeholder: 'smtp.gmail.com' },
  { key: 'email_smtp_port', label: 'SMTP Port', type: 'number' as const, placeholder: '587', min: 1, max: 65535 },
  { key: 'enable_email_verification', label: 'Xác thực email', type: 'boolean' as const },
  { key: 'enable_registration', label: 'Cho phép đăng ký', type: 'boolean' as const }
];

export function EmailTab({ settingsData, editedSettings, onSettingChange }: EmailTabProps) {
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
          <Bell className="h-5 w-5 text-primary" />
          Cấu hình Email & SMTP
        </CardTitle>
        <p className="text-muted-foreground">
          Cài đặt máy chủ email, SMTP và các tính năng xác thực
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {emailSettings.map((setting, index) => (
            <React.Fragment key={setting.key}>
              <SettingField
                setting={setting}
                currentValue={getCurrentValue(setting.key)}
                hasChanged={hasChanged(setting.key)}
                onSettingChange={onSettingChange}
              />
              {index < emailSettings.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
