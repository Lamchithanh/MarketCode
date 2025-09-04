'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Mail, CheckCircle, Eye } from 'lucide-react';
import { MessageStats } from '@/hooks/use-messages';

interface MessageStatsCardsProps {
  stats: MessageStats;
}

export function MessageStatsCards({ stats }: MessageStatsCardsProps) {
  const statCards = [
    {
      title: 'Tổng tin nhắn',
      value: stats.total,
      icon: MessageSquare,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Tin nhắn chưa đọc',
      value: stats.unread,
      icon: Mail,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      title: 'Tin nhắn đã đọc',
      value: stats.read,
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Tuần này',
      value: stats.thisWeek,
      icon: Eye,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
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
              <p className="text-xs text-stone-600">Cập nhật gần đây</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
