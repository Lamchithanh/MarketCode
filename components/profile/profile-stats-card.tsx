import { ShoppingCart, Download, Heart } from "lucide-react";

interface ProfileStatsCardProps {
  stats: {
    totalOrders: number;
    downloads: number;
    wishlist: number;
  };
}

export function ProfileStatsCard({ stats }: ProfileStatsCardProps) {
  const statItems = [
    {
      icon: ShoppingCart,
      label: "Đơn hàng",
      value: stats.totalOrders,
      color: "text-blue-600",
    },
    {
      icon: Download,
      label: "Tải xuống",
      value: stats.downloads,
      color: "text-green-600",
    },
    {
      icon: Heart,
      label: "Yêu thích",
      value: stats.wishlist,
      color: "text-red-600",
    },
  ];

  return (
    <div>
      <h4 className="font-medium mb-4">Thống kê</h4>
      <div className="space-y-3">
        {statItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <IconComponent className={`h-4 w-4 ${item.color}`} />
              <span className="text-sm">
                {item.label}: <span className="font-medium">{item.value}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 