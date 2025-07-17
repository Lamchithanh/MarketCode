"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChangePasswordModal } from "./change-password-modal";
import { UpdateProfileModal } from "./update-profile-modal";
import { NotificationSettingsModal } from "./notification-settings-modal";
import { ProfileInfoCard } from "./profile-info-card";
import { ProfileStatsCard } from "./profile-stats-card";
import { 
  type ChangePasswordForm, 
  type UpdateProfileForm,
  type NotificationSettingsForm
} from "@/lib/validations/profile";

interface ProfileSettingsProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
    avatar?: string | null;
    phone?: string | null;
  };
  stats: {
    totalOrders: number;
    downloads: number;
    wishlist: number;
  };
  initialNotificationSettings?: NotificationSettingsForm;
  onPasswordChange?: (data: ChangePasswordForm) => Promise<void>;
  onProfileUpdate?: (data: UpdateProfileForm) => Promise<void>;
  onAvatarChange?: (file: File | null) => Promise<void>;
  onNotificationSettingsUpdate?: (settings: NotificationSettingsForm) => Promise<void>;
}

export function ProfileSettings({ 
  user, 
  stats, 
  initialNotificationSettings,
  onPasswordChange,
  onProfileUpdate,
  onAvatarChange,
  onNotificationSettingsUpdate
}: ProfileSettingsProps) {

  // Default handlers for demo purposes
  const handlePasswordChange = async (data: ChangePasswordForm) => {
    try {
      if (onPasswordChange) {
        await onPasswordChange(data);
      } else {
        // Default implementation
        console.log("Changing password:", data);
        // TODO: Implement API call
      }
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  };

  const handleProfileUpdate = async (data: UpdateProfileForm) => {
    try {
      if (onProfileUpdate) {
        await onProfileUpdate(data);
      } else {
        // Default implementation
        console.log("Updating profile:", data);
        // TODO: Implement API call
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const handleAvatarChange = async (file: File | null) => {
    try {
      if (onAvatarChange) {
        await onAvatarChange(file);
      } else {
        // Default implementation
        console.log("Uploading avatar:", file);
        // TODO: Implement API call
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  };

  const handleNotificationSettingsUpdate = async (settings: NotificationSettingsForm) => {
    try {
      if (onNotificationSettingsUpdate) {
        await onNotificationSettingsUpdate(settings);
      } else {
        // Default implementation
        console.log("Updating notification settings:", settings);
        // TODO: Implement API call
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      throw error;
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Cài đặt tài khoản</CardTitle>
        <CardDescription>
          Quản lý thông tin và tùy chỉnh tài khoản
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Profile Information Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <ProfileInfoCard user={user} />
            <ProfileStatsCard stats={stats} />
          </div>
          
          <Separator />
          
          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap">
            <ChangePasswordModal 
              onPasswordChange={handlePasswordChange}
            />
            <UpdateProfileModal 
              user={user}
              onProfileUpdate={handleProfileUpdate}
              onAvatarChange={handleAvatarChange}
            />
            <NotificationSettingsModal 
              initialSettings={initialNotificationSettings}
              onSettingsUpdate={handleNotificationSettingsUpdate}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 