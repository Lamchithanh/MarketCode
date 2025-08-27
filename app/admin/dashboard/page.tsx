"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Users, Package, ShoppingCart, DollarSign, Activity } from "lucide-react";
import { PageLoader } from "@/components/ui/loader";
import { useRealtimeDashboardStats } from "@/hooks/use-realtime-dashboard-stats";
import { StatCard } from "@/components/admin/dashboard/stat-card";
import { QuickActions } from "@/components/admin/dashboard/quick-actions";
import { RecentActivities } from "@/components/admin/dashboard/recent-activities";
import { SystemOverview } from "@/components/admin/dashboard/system-overview";

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { stats, recentActivities, loading, error, updatedFields, refetch } = useRealtimeDashboardStats();

  // Debug log to check if deletedUsers is being received
  console.log('Dashboard stats:', stats);
  console.log('Deleted users:', stats.deletedUsers);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return <PageLoader text="Đang tải admin dashboard..." size="2xl" />;
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  const statsConfig = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers,
      secondaryValue: `${stats.deletedUsers} đã xóa`,
      icon: Users,
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
      isUpdated: updatedFields.has('totalUsers') || updatedFields.has('deletedUsers'),
    },
    {
      title: "Tổng sản phẩm",
      value: stats.totalProducts,
      icon: Package,
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
      isUpdated: updatedFields.has('totalProducts'),
    },
    {
      title: "Đơn hàng hôm nay",
      value: stats.totalOrders,
      icon: ShoppingCart,
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
      isUpdated: updatedFields.has('totalOrders'),
    },
    {
      title: "Doanh thu tháng",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
      isUpdated: updatedFields.has('totalRevenue'),
    },
  ];

  const quickActionsConfig = [
    {
      title: "Thêm sản phẩm mới",
      description: "Tạo sản phẩm mới cho marketplace",
      icon: Package,
      href: "/admin/products",
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
    },
    {
      title: "Quản lý đơn hàng",
      description: "Xem và xử lý đơn hàng mới",
      icon: ShoppingCart,
      href: "/admin/orders",
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
    },
    {
      title: "Cài đặt hệ thống",
      description: "Quản lý cấu hình và cài đặt",
      icon: Activity,
      href: "/admin/settings",
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
    },
    {
      title: "Quản lý người dùng",
      description: "Quản lý tài khoản người dùng",
      icon: Users,
      href: "/admin/users",
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Giám sát và quản lý nền tảng MarketCode của bạn
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={refetch}
            disabled={loading}
            className="px-3 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? '⏳ Đang tải...' : '🔄 Làm mới'}
          </button>
          <p className="text-sm text-muted-foreground">
            🔴 Realtime • Cập nhật cuối: {new Date().toLocaleTimeString('vi-VN')}
          </p>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            Lỗi khi tải dữ liệu: {error}. Đang hiển thị dữ liệu mẫu.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsConfig.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <QuickActions actions={quickActionsConfig} />

        {/* Recent Activities */}
        <RecentActivities activities={recentActivities} />
      </div>

      {/* System Overview */}
      <div className="mt-8">
        <SystemOverview 
          totalDownloads={stats.totalDownloads}
          averageRating={stats.averageRating}
          newsletterSubscribers={stats.newsletterSubscribers}
          pendingMessages={stats.pendingMessages}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
