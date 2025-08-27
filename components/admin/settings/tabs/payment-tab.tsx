import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DollarSign, CreditCard, Smartphone } from 'lucide-react';
import { SettingField } from '../shared/setting-field';

interface PaymentTabProps {
  settingsData: Record<string, string | number | boolean | object>;
  editedSettings: Record<string, string | number | boolean>;
  onSettingChange: (key: string, value: string | number | boolean) => void;
}

type SettingConfig = {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'textarea' | 'email' | 'url';
  placeholder?: string;
  min?: number;
  max?: number;
};

const generalPaymentSettings: SettingConfig[] = [
  { key: 'currency', label: 'Đơn vị tiền tệ', type: 'string' as const, placeholder: 'VND' },
  { key: 'vat_rate', label: 'Thuế VAT (%)', type: 'number' as const, min: 0, max: 100, placeholder: '10' },
  { key: 'payment_timeout_hours', label: 'Thời gian chờ thanh toán (giờ)', type: 'number' as const, min: 1, max: 168, placeholder: '24' },
  { key: 'auto_payment_confirmation', label: 'Tự động xác nhận thanh toán', type: 'boolean' as const }
];

const bankSettings: SettingConfig[] = [
  { key: 'bank_name', label: 'Tên ngân hàng', type: 'string' as const, placeholder: 'Vietcombank' },
  { key: 'bank_branch', label: 'Chi nhánh', type: 'string' as const, placeholder: 'Chi nhánh Hà Nội' },
  { key: 'bank_account_name', label: 'Tên tài khoản', type: 'string' as const, placeholder: 'NGUYEN VAN A' },
  { key: 'bank_account_number', label: 'Số tài khoản', type: 'string' as const, placeholder: '1234567890123' },
  { key: 'bank_swift_code', label: 'Mã SWIFT', type: 'string' as const, placeholder: 'BFTVVNVX' }
];

const momoSettings: SettingConfig[] = [
  { key: 'momo_phone', label: 'Số điện thoại MoMo', type: 'string' as const, placeholder: '0987654321' },
  { key: 'momo_name', label: 'Tên tài khoản MoMo', type: 'string' as const, placeholder: 'NGUYEN VAN A' },
  { key: 'momo_qr_code', label: 'URL QR Code MoMo', type: 'url' as const, placeholder: 'https://example.com/momo-qr.png' }
];

export function PaymentTab({ settingsData, editedSettings, onSettingChange }: PaymentTabProps) {
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

  const renderSettingGroup = (
    title: string, 
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>, 
    settings: typeof generalPaymentSettings, 
    description: string
  ) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {React.createElement(icon, { className: "h-5 w-5 text-primary" })}
          {title}
        </CardTitle>
        <p className="text-muted-foreground text-sm">{description}</p>
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

  return (
    <div className="space-y-6">
      {renderSettingGroup(
        'Cài đặt chung',
        DollarSign,
        generalPaymentSettings,
        'Cấu hình tiền tệ và các thiết lập thanh toán chung'
      )}
      
      {renderSettingGroup(
        'Tài khoản ngân hàng',
        CreditCard,
        bankSettings,
        'Thông tin tài khoản ngân hàng để nhận thanh toán'
      )}
      
      {renderSettingGroup(
        'Ví điện tử MoMo',
        Smartphone,
        momoSettings,
        'Cấu hình ví MoMo để nhận thanh toán nhanh chóng'
      )}
    </div>
  );
}
