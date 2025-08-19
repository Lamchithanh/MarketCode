'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Palette, Server, Activity } from 'lucide-react';

interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface SettingsStatsProps {
  settings: {
    general: Setting[];
    branding: Setting[];
    system: Setting[];
  };
}

export function SettingsStats({ settings }: SettingsStatsProps) {
  const totalSettings = settings.general.length + settings.branding.length + settings.system.length;
  
  const stats = [
    {
      title: "Tổng cài đặt",
      value: totalSettings,
      description: "Tổng số cài đặt trong hệ thống",
      icon: Activity,
      color: "text-blue-600"
    },
    {
      title: "Cài đặt chung",
      value: settings.general.length,
      description: "Các cài đặt cơ bản",
      icon: Settings,
      color: "text-green-600"
    },
    {
      title: "Thương hiệu",
      value: settings.branding.length,
      description: "Cài đặt giao diện và thương hiệu",
      icon: Palette,
      color: "text-purple-600"
    },
    {
      title: "Hệ thống",
      value: settings.system.length,
      description: "Cài đặt kỹ thuật và bảo mật",
      icon: Server,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
