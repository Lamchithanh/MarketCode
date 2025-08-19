"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  AlertCircle, 
  Loader2,
  FileDown,
  FileUp
} from 'lucide-react';
import { toast } from 'sonner';

export function SettingsBackupRestore() {
  const [backing, setBacking] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleExportSettings = async () => {
    try {
      setBacking(true);
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      
      const settings = await response.json();
      
      // Create backup data with metadata
      const backupData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        settings: settings
      };
      
      // Create and download file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marketcode-settings-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Đã xuất backup cài đặt thành công');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Lỗi khi xuất backup cài đặt');
    } finally {
      setBacking(false);
    }
  };

  const handleImportSettings = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setRestoring(true);
      
      const text = await file.text();
      const backupData = JSON.parse(text);
      
      // Validate backup format
      if (!backupData.settings || !backupData.version) {
        throw new Error('Invalid backup file format');
      }

      // Flatten settings for API
      const flatSettings: Record<string, string> = {};
      Object.values(backupData.settings).forEach((categorySettings: unknown) => {
        if (Array.isArray(categorySettings)) {
          categorySettings.forEach((setting: { key: string; value: string }) => {
            flatSettings[setting.key] = setting.value;
          });
        }
      });

      // Send to API
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings: flatSettings })
      });

      if (!response.ok) throw new Error('Failed to restore settings');
      
      const result = await response.json();
      toast.success(`Đã khôi phục ${result.updatedCount} cài đặt thành công`);
      
      // Reload page to show updated settings
      window.location.reload();
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Lỗi khi khôi phục cài đặt. Vui lòng kiểm tra file backup.');
    } finally {
      setRestoring(false);
      // Reset input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileDown className="h-5 w-5 mr-2" />
          Backup & Restore
        </CardTitle>
        <CardDescription>
          Sao lưu và khôi phục cài đặt hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Luôn tạo backup trước khi thay đổi cài đặt quan trọng. Việc khôi phục sẽ ghi đè toàn bộ cài đặt hiện tại.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Export Settings */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Xuất cài đặt</Label>
            <p className="text-sm text-muted-foreground">
              Tải về file backup chứa toàn bộ cài đặt hiện tại
            </p>
            <Button 
              onClick={handleExportSettings}
              disabled={backing}
              className="w-full"
              variant="outline"
            >
              {backing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Xuất Backup
            </Button>
          </div>

          {/* Import Settings */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Nhập cài đặt</Label>
            <p className="text-sm text-muted-foreground">
              Khôi phục cài đặt từ file backup
            </p>
            <div className="relative">
              <Input
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                disabled={restoring}
                className="cursor-pointer"
              />
              {restoring && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Chỉ chấp nhận file JSON được xuất từ hệ thống
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Hành động nhanh</h4>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={handleExportSettings} disabled={backing}>
              <FileDown className="h-3 w-3 mr-1" />
              Backup nhanh
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => (document.querySelector('input[type="file"]') as HTMLElement)?.click()}
              disabled={restoring}
            >
              <FileUp className="h-3 w-3 mr-1" />
              Restore nhanh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
