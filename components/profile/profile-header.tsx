import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Calendar, Star, Edit } from "lucide-react";
import { UpdateProfileModal } from "./update-profile-modal";
import { useUserProfile } from "@/hooks/use-user-profile";

interface ProfileHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    role?: string;
  };
  stats: {
    averageRating: number;
    reviews: number;
    memberSince: string;
  };
  onUpdateProfile?: () => void;
}

export function ProfileHeader({ user: initialUser, stats, onUpdateProfile }: ProfileHeaderProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const { user, updateUserProfile, updateAvatar } = useUserProfile(initialUser);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUpdateProfile = () => {
    setIsUpdateModalOpen(true);
  };

  const handleProfileUpdate = async (data: any) => {
    await updateUserProfile(data);
    onUpdateProfile?.(); // Notify parent component to refresh
  };

  const handleAvatarChange = async (avatarUrl: string | null) => {
    await updateAvatar(avatarUrl);
    onUpdateProfile?.(); // Notify parent component to refresh
  };

  return (
    <Card className="mb-8 border-0 shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={user.avatar || undefined} alt={user.name || ""} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {getInitials(user.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-muted-foreground mb-2">{user.email}</p>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {user.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Tham gia từ {new Date(stats.memberSince).toLocaleDateString('vi-VN')}
                </Badge>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium">{stats.averageRating}</span>
                <span className="text-muted-foreground">({stats.reviews} đánh giá)</span>
              </div>
            </div>
          </div>
          <div className="ml-auto">
            <Button 
              variant="outline" 
              size="lg" 
              className="flex items-center gap-2"
              onClick={handleUpdateProfile}
            >
              <Edit className="h-4 w-4" />
              Chỉnh sửa hồ sơ
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Update Profile Modal */}
      <UpdateProfileModal
        user={user}
        onProfileUpdate={handleProfileUpdate}
        onAvatarChange={handleAvatarChange}
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
      />
    </Card>
  );
} 