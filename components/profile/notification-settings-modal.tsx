"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Save, X } from "lucide-react";
import { toast, toastMessages } from "@/components/ui/toast";
import { 
  defaultNotificationSettings,
  type NotificationSettingsForm 
} from "@/lib/validations/profile";

interface NotificationSettingsModalProps {
  initialSettings?: NotificationSettingsForm;
  onSettingsUpdate?: (settings: NotificationSettingsForm) => Promise<void>;
  disabled?: boolean;
}

export function NotificationSettingsModal({ 
  initialSettings = defaultNotificationSettings, 
  onSettingsUpdate, 
  disabled = false 
}: NotificationSettingsModalProps) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<NotificationSettingsForm>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key: keyof NotificationSettingsForm, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSettingsUpdate?.(settings);
      setOpen(false);
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast.error("Không thể lưu cài đặt thông báo. Vui lòng thử lại!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSettings(initialSettings);
  };

  const notificationMethods = [
    {
      key: "email" as const,
      label: "Email",
      description: "Nhận thông báo qua email",
    },
    {
      key: "push" as const,
      label: "Push notifications",
      description: "Nhận thông báo đẩy trên trình duyệt",
    },
    {
      key: "sms" as const,
      label: "SMS",
      description: "Nhận thông báo qua tin nhắn",
    },
  ];

  const notificationTypes = [
    {
      key: "orderUpdates" as const,
      label: "Cập nhật đơn hàng",
      description: "Trạng thái đơn hàng, thanh toán",
    },
    {
      key: "productUpdates" as const,
      label: "Sản phẩm mới",
      description: "Thông báo về sản phẩm mới",
    },
    {
      key: "promotions" as const,
      label: "Khuyến mãi",
      description: "Ưu đãi và khuyến mãi đặc biệt",
    },
    {
      key: "marketing" as const,
      label: "Marketing",
      description: "Tin tức và cập nhật marketing",
    },
    {
      key: "security" as const,
      label: "Bảo mật",
      description: "Cảnh báo bảo mật và hoạt động đăng nhập",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Bell className="h-4 w-4 mr-2" />
          Cài đặt thông báo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Cài đặt thông báo
          </DialogTitle>
          <DialogDescription>
            Tùy chỉnh cách bạn nhận thông báo từ hệ thống
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Notification Methods */}
          <div className="space-y-4">
            <h4 className="font-medium">Phương thức nhận thông báo</h4>
            <div className="space-y-3">
              {notificationMethods.map((method) => (
                <div key={method.key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">{method.label}</Label>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  <Switch
                    checked={settings[method.key]}
                    onCheckedChange={(checked) => handleSettingChange(method.key, checked)}
                    disabled={isSaving}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Notification Types */}
          <div className="space-y-4">
            <h4 className="font-medium">Loại thông báo</h4>
            <div className="space-y-3">
              {notificationTypes.map((type) => (
                <div key={type.key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">{type.label}</Label>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                  <Switch
                    checked={settings[type.key]}
                    onCheckedChange={(checked) => handleSettingChange(type.key, checked)}
                    disabled={isSaving}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Đang lưu..." : "Lưu cài đặt"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 