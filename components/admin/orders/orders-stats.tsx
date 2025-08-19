'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { OrderStats } from '@/lib/services/order-service';

interface OrdersStatsProps {
  stats: OrderStats | null;
  loading?: boolean;
}

export function OrdersStats({ stats, loading = false }: OrdersStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Không có dữ liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Không thể tải thống kê đơn hàng</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsData = [
    {
      title: 'Tổng đơn hàng',
      value: stats.totalOrders,
      icon: ShoppingCart,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Đơn hoàn thành',
      value: stats.completedOrders,
      icon: CheckCircle,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Đơn chờ xử lý',
      value: stats.pendingOrders,
      icon: Clock,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-stone-600">
                Updated recently
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
