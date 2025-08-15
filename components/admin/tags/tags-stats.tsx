'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, Package, Hash, TrendingUp } from 'lucide-react';

interface TagItem {
  id: string;
  name: string;
  productCount: number;
}

interface TagsStatsProps {
  tags: TagItem[];
}

export function TagsStats({ tags }: TagsStatsProps) {
  const totalProducts = tags.reduce((sum, tag) => sum + tag.productCount, 0);
  const avgProductsPerTag = tags.length > 0 ? Math.round(totalProducts / tags.length) : 0;
  const mostUsedTag = tags.reduce((prev, current) => 
    prev.productCount > current.productCount ? prev : current, tags[0] || { productCount: 0 });

  const stats = [
    {
      title: 'Total Tags',
      value: tags.length,
      icon: Tag,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Tagged Products',
      value: totalProducts,
      icon: Package,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Avg Products/Tag',
      value: avgProductsPerTag,
      icon: Hash,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Most Used',
      value: mostUsedTag?.productCount || 0,
      icon: TrendingUp,
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
