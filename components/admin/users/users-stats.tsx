'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Activity, Mail } from 'lucide-react';

interface User {
  id: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  emailVerified?: string;
}

interface UsersStatsProps {
  users: User[];
}

export function UsersStats({ users }: UsersStatsProps) {
  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Admin Users',
      value: users.filter(u => u.role === 'ADMIN').length,
      icon: Shield,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Active Users',
      value: users.filter(u => u.isActive).length,
      icon: Activity,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Verified Users',
      value: users.filter(u => u.emailVerified).length,
      icon: Mail,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
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
