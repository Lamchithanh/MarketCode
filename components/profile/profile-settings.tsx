"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChangePasswordModal } from "./change-password-modal";
import { UpdateProfileModal } from "./update-profile-modal";
import { ProfileInfoCard } from "./profile-info-card";
import { ProfileStatsCard } from "./profile-stats-card";
import { useUserProfile } from "@/hooks/use-user-profile";
import { 
  type ChangePasswordForm,
  type UpdateProfileForm
} from "@/lib/validations/profile";
import { toast } from "sonner";

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
}

export function ProfileSettings({ 
  user: initialUser, 
  stats
}: ProfileSettingsProps) {
  const { user, updateUserProfile, updateAvatar } = useUserProfile(initialUser);

  const handlePasswordChange = async (data: ChangePasswordForm) => {
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to change password');
      }

      if (result.success) {
        toast.success('Đã thay đổi mật khẩu thành công');
      } else {
        throw new Error(result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi đổi mật khẩu');
      throw error;
    }
  };

  const handleProfileUpdate = async (data: UpdateProfileForm) => {
    await updateUserProfile({
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    });
  };

  const handleAvatarChange = async (avatarUrl: string | null) => {
    await updateAvatar(avatarUrl);
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 