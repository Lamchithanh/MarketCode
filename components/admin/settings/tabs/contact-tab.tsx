import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail } from 'lucide-react';
import { SettingField } from '../shared/setting-field';

interface ContactTabProps {
  settingsData: Record<string, string | number | boolean | object>;
  editedSettings: Record<string, string | number | boolean>;
  onSettingChange: (key: string, value: string | number | boolean) => void;
}

const contactSettings = [
  { key: 'contact_email', label: 'Email liên hệ', type: 'email' as const, placeholder: 'contact@marketcode.com' },
  { key: 'support_email', label: 'Email hỗ trợ', type: 'email' as const, placeholder: 'support@marketcode.com' },
  { key: 'email_from_address', label: 'Email gửi', type: 'email' as const, placeholder: 'noreply@marketcode.com' },
  { key: 'email_from_name', label: 'Tên người gửi', type: 'string' as const, placeholder: 'MarketCode Team' },
  { key: 'support_phone', label: 'Số điện thoại hỗ trợ', type: 'string' as const, placeholder: '0981911449' },
  { key: 'support_hours', label: 'Giờ hỗ trợ', type: 'string' as const, placeholder: '8:00 - 22:00' }
];

export function ContactTab({ settingsData, editedSettings, onSettingChange }: ContactTabProps) {
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
          <Mail className="h-5 w-5 text-primary" />
          Thông tin liên hệ và hỗ trợ
        </CardTitle>
        <p className="text-muted-foreground">
          Cấu hình thông tin liên hệ, email hỗ trợ và thông tin đội ngũ
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {contactSettings.map((setting, index) => (
            <React.Fragment key={setting.key}>
              <SettingField
                setting={setting}
                currentValue={getCurrentValue(setting.key)}
                hasChanged={hasChanged(setting.key)}
                onSettingChange={onSettingChange}
              />
              {index < contactSettings.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
