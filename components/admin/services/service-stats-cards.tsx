'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  CheckCircle, 
  XCircle,
  Star,
  Package,
  Calendar
} from 'lucide-react';

interface ServiceStatsCardsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    popular: number;
    categories: Record<string, number>;
    this_week: number;
  };
}

export function ServiceStatsCards({ stats }: ServiceStatsCardsProps) {
  const cards = [
    {
      title: 'Tổng dịch vụ',
      value: stats.total,
      icon: Settings,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Tất cả dịch vụ trong hệ thống'
    },
    {
      title: 'Đang hoạt động',
      value: stats.active,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'Dịch vụ khả dụng cho khách hàng'
    },
    {
      title: 'Tạm dừng',
      value: stats.inactive,
      icon: XCircle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      description: 'Dịch vụ không khả dụng'
    },
    {
      title: 'Nổi bật',
      value: stats.popular,
      icon: Star,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      description: 'Dịch vụ được đánh dấu nổi bật'
    },
    {
      title: 'Danh mục',
      value: Object.keys(stats.categories).length,
      icon: Package,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'Số danh mục dịch vụ'
    },
    {
      title: 'Tuần này',
      value: stats.this_week,
      icon: Calendar,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      description: 'Dịch vụ mới trong tuần'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
              {card.title === 'Danh mục' && Object.keys(stats.categories).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {Object.entries(stats.categories).slice(0, 3).map(([category, count]) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category} ({count})
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
