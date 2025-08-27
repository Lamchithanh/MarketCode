import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface SettingFieldProps {
  setting: {
    key: string;
    label: string;
    description?: string;
    type: 'string' | 'number' | 'boolean' | 'textarea' | 'email' | 'url';
    placeholder?: string;
    min?: number;
    max?: number;
  };
  currentValue: string | number | boolean;
  hasChanged: boolean;
  onSettingChange: (key: string, value: string | number | boolean) => void;
}

export function SettingField({ setting, currentValue, hasChanged, onSettingChange }: SettingFieldProps) {
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
              onCheckedChange={(checked) => onSettingChange(setting.key, checked)}
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
            onChange={(e) => onSettingChange(setting.key, e.target.value)}
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
            onChange={(e) => onSettingChange(setting.key, Number(e.target.value))}
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
            onChange={(e) => onSettingChange(setting.key, e.target.value)}
          />
        </div>
      );
  }
}
