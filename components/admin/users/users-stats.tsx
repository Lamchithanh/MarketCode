'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Activity, Mail, TrendingUp } from 'lucide-react';
import { UserStats } from '@/lib/services/user-service';

interface UsersStatsProps {
  stats: UserStats | null;
  loading?: boolean;
}

export function UsersStats({ stats, loading = false }: UsersStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Loading...
              </CardTitle>
              <div className="w-10 h-10 bg-stone-100 rounded-lg animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground animate-pulse bg-stone-200 h-8 rounded" />
              <p className="text-xs text-stone-600 animate-pulse bg-stone-200 h-4 rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                No Data
              </CardTitle>
              <div className="w-10 h-10 bg-stone-100 rounded-lg" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">-</div>
              <p className="text-xs text-stone-600">No data available</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total Users',
      value: stats.total,
      icon: Users,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Admin Users',
      value: stats.admins,
      icon: Shield,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Active Users',
      value: stats.active,
      icon: Activity,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'New This Month',
      value: stats.newThisMonth,
      icon: TrendingUp,
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
                {stat.title === 'New This Month' ? 'This month' : 'Total count'}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
