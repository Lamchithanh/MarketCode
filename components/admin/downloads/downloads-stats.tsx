'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, CheckCircle, XCircle, Clock } from 'lucide-react';

interface DownloadItem {
  id: string;
  status: "completed" | "failed" | "pending";
}

interface DownloadsStatsProps {
  downloads: DownloadItem[];
}

export function DownloadsStats({ downloads }: DownloadsStatsProps) {
  const totalDownloads = downloads.length;
  const completedDownloads = downloads.filter(download => download.status === "completed").length;
  const failedDownloads = downloads.filter(download => download.status === "failed").length;
  const pendingDownloads = downloads.filter(download => download.status === "pending").length;

  const stats = [
    {
      title: 'Total Downloads',
      value: totalDownloads,
      icon: Download,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Completed',
      value: completedDownloads,
      icon: CheckCircle,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Failed',
      value: failedDownloads,
      icon: XCircle,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Pending',
      value: pendingDownloads,
      icon: Clock,
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
