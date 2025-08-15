'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, DollarSign, Users, TrendingUp } from 'lucide-react';

interface Coupon {
  id: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  usageCount: number;
  isActive: boolean;
}

interface CouponsStatsProps {
  coupons: Coupon[];
}

export function CouponsStats({ coupons }: CouponsStatsProps) {
  const activeCoupons = coupons.filter(coupon => coupon.isActive).length;
  const totalUsage = coupons.reduce((sum, coupon) => sum + coupon.usageCount, 0);
  const avgDiscount = coupons.length > 0 ? 
    coupons.reduce((sum, coupon) => sum + coupon.value, 0) / coupons.length : 0;

  const stats = [
    {
      title: 'Total Coupons',
      value: coupons.length,
      icon: Ticket,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Active Coupons',
      value: activeCoupons,
      icon: TrendingUp,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Total Usage',
      value: totalUsage,
      icon: Users,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Avg Discount',
      value: `${Math.round(avgDiscount)}${coupons.some(c => c.type === 'PERCENTAGE') ? '%' : '$'}`,
      icon: DollarSign,
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
