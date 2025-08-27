import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  onRefresh: () => void;
  loading?: boolean;
}

export function DashboardHeader({ onRefresh, loading }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Giám sát và quản lý nền tảng MarketCode của bạn
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">
          Cập nhật cuối: {new Date().toLocaleTimeString('vi-VN')}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="ml-2"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>
    </div>
  );
}
