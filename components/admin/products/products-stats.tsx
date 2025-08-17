'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, Download, Eye } from 'lucide-react';

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  downloadCount: number;
  viewCount: number;
  isActive: boolean;
  category: string;
  tags: string[];
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductsStatsProps {
  products: ProductItem[];
}

export function ProductsStats({ products }: ProductsStatsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Total Revenue',
      value: formatPrice(products.reduce((sum, p) => sum + p.price, 0)),
      icon: DollarSign,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Total Downloads',
      value: products.reduce((sum, p) => sum + p.downloadCount, 0).toLocaleString(),
      icon: Download,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Total Views',
      value: products.reduce((sum, p) => sum + p.viewCount, 0).toLocaleString(),
      icon: Eye,
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
