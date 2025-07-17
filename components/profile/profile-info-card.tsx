import { User, Mail, Shield } from "lucide-react";

interface ProfileInfoCardProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function ProfileInfoCard({ user }: ProfileInfoCardProps) {
  return (
    <div>
      <h4 className="font-medium mb-4">Thông tin cá nhân</h4>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Họ tên: <span className="font-medium">{user.name || "Chưa cập nhật"}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Email: <span className="font-medium">{user.email || "Chưa cập nhật"}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Vai trò: <span className="font-medium capitalize">{user.role || "User"}</span>
          </span>
        </div>
      </div>
    </div>
  );
} 