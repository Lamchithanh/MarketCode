import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Image, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface BrandingTabProps {
  settingsData: Record<string, string | number | boolean | object>;
  editedSettings: Record<string, string | number | boolean>;
  onSettingChange: (key: string, value: string | number | boolean) => void;
}

interface FileUploadFieldProps {
  label: string;
  settingKey: string;
  currentValue: string;
  hasChanged: boolean;
  onSettingChange: (key: string, value: string) => void;
  accept: string;
  description?: string;
}

function FileUploadField({
  label,
  settingKey,
  currentValue,
  hasChanged,
  onSettingChange,
  accept,
  description
}: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File không được vượt quá 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'branding');
      formData.append('path', `${settingKey}/${file.name}`);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      if (result.success && result.url) {
        onSettingChange(settingKey, result.url);
        setUploadSuccess(true);
        toast.success(`${label} đã được tải lên thành công!`);
        
        // Reset success state after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Lỗi khi tải lên ${label.toLowerCase()}`);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    onSettingChange(settingKey, url);
    setUploadSuccess(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label htmlFor={settingKey}>{label}</Label>
        {hasChanged && <Badge variant="outline" className="text-xs">Đã thay đổi</Badge>}
        {uploadSuccess && <Badge variant="default" className="text-xs bg-green-600">Đã tải lên</Badge>}
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {/* Current image preview */}
      {currentValue && (
        <div className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50">
          <div className="relative w-16 h-16 border rounded overflow-hidden bg-white">
            <img 
              src={String(currentValue)} 
              alt={label}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">File hiện tại</p>
            <p className="text-xs text-muted-foreground truncate">{String(currentValue)}</p>
          </div>
        </div>
      )}

      {/* Upload button */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          className="relative"
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : uploadSuccess ? (
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {uploading ? 'Đang tải lên...' : 'Tải lên file'}
        </Button>

        <div className="flex-1">
          <Input
            id={settingKey}
            type="url"
            value={String(currentValue)}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Hoặc nhập URL trực tiếp"
            disabled={uploading}
          />
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Chấp nhận: {accept.split(',').join(', ')} • Tối đa 5MB
      </div>
    </div>
  );
}

export function BrandingTab({ settingsData, editedSettings, onSettingChange }: BrandingTabProps) {
  const getCurrentValue = (key: string): string => {
    const editedValue = editedSettings[key];
    if (editedValue !== undefined) {
      return String(editedValue);
    }
    
    const dataValue = settingsData[key];
    if (typeof dataValue === 'object') {
      return '';
    }
    return String(dataValue || '');
  };

  const hasChanged = (key: string) => {
    return editedSettings[key] !== undefined;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Image className="h-5 w-5 text-primary" />
          Hình ảnh & Thương hiệu
        </CardTitle>
        <p className="text-muted-foreground">
          Tải lên và quản lý logo, favicon và các yếu tố thương hiệu
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-8">
          <FileUploadField
            label="Logo website/Favicon"
            settingKey="logo_url"
            currentValue={getCurrentValue('logo_url')}
            hasChanged={hasChanged('logo_url')}
            onSettingChange={onSettingChange}
            accept="image/png,image/jpg,image/jpeg,image/svg+xml,image/webp"
            description="Logo hiển thị trên header và các trang chính. Khuyến nghị kích thước: 200x60px"
          />
        </div>
      </CardContent>
    </Card>
  );
}
