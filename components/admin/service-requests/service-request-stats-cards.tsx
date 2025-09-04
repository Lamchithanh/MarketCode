'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  DollarSign,
  Calendar
} from 'lucide-react';
import { ServiceRequestStats } from '@/hooks/use-service-requests';

interface ServiceRequestStatsCardsProps {
  stats: ServiceRequestStats;
}

export function ServiceRequestStatsCards({ stats }: ServiceRequestStatsCardsProps) {
  const cards = [
    {
      title: 'Tổng yêu cầu',
      value: stats.total,
      icon: Settings,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Tất cả yêu cầu dịch vụ'
    },
    {
      title: 'Chờ xử lý',
      value: stats.pending,
      icon: Clock,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      description: 'Yêu cầu mới cần xem xét'
    },
    {
      title: 'Đang thực hiện',
      value: stats.in_progress,
      icon: TrendingUp,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      description: 'Dự án đang triển khai'
    },
    {
      title: 'Đã hoàn thành',
      value: stats.completed,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'Dự án đã giao thành công'
    },
    {
      title: 'Đã báo giá',
      value: stats.quoted,
      icon: DollarSign,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'Đã gửi báo giá'
    },
    {
      title: 'Tuần này',
      value: stats.this_week,
      icon: Calendar,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      description: 'Yêu cầu mới trong tuần'
    },
    {
      title: 'Doanh thu',
      value: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        notation: 'compact'
      }).format(stats.total_revenue),
      icon: TrendingUp,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      description: 'Từ các dự án hoàn thành',
      isRevenue: true
    },
    {
      title: 'Đã hủy',
      value: stats.cancelled,
      icon: XCircle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      description: 'Yêu cầu bị hủy bỏ'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {card.isRevenue ? card.value : typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
