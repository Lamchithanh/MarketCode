'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  XCircle, 
  DollarSign,
  TrendingUp
} from 'lucide-react';

interface OrderStatsProps {
  stats: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
    todayOrders: number;
  };
  loading?: boolean;
}

export function OrderStatsCards({ stats, loading = false }: OrderStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount || 0);
  };

  // Validate stats data and provide fallbacks
  const safeStats = {
    total: stats?.total || 0,
    pending: stats?.pending || 0,
    processing: stats?.processing || 0,
    completed: stats?.completed || 0,
    cancelled: stats?.cancelled || 0,
    totalRevenue: stats?.totalRevenue || 0,
    todayOrders: stats?.todayOrders || 0
  };

  const statsData = [
    {
      title: 'Tổng đơn hàng',
      value: safeStats.total,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Chờ xử lý',
      value: safeStats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Đang xử lý',
      value: safeStats.processing,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Hoàn thành',
      value: safeStats.completed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Đã hủy',
      value: safeStats.cancelled,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(safeStats.totalRevenue),
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      isRevenue: true,
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted rounded w-20"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.isRevenue ? stat.value : (stat.value || 0).toLocaleString('vi-VN')}
              </div>
              {stat.title === 'Tổng đơn hàng' && safeStats.todayOrders && safeStats.todayOrders > 0 && (
                <p className="text-xs text-muted-foreground">
                  +{safeStats.todayOrders} hôm nay
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
