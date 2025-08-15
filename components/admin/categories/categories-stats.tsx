'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderTree, Package, Eye, Hash } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  productCount?: number;
  isActive: boolean;
}

interface CategoriesStatsProps {
  categories: Category[];
}

export function CategoriesStats({ categories }: CategoriesStatsProps) {
  const totalProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
  const activeCategories = categories.filter(cat => cat.isActive).length;

  const stats = [
    {
      title: 'Total Categories',
      value: categories.length,
      icon: FolderTree,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Active Categories',
      value: activeCategories,
      icon: Eye,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Avg Products/Category',
      value: Math.round(totalProducts / (categories.length || 1)),
      icon: Hash,
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
