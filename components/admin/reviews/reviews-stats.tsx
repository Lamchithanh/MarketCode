'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare, ThumbsUp, CheckCircle } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  isHelpful: number;
  isApproved: boolean;
}

interface ReviewsStatsProps {
  reviews: Review[];
}

export function ReviewsStats({ reviews }: ReviewsStatsProps) {
  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter(review => review.isApproved).length;
  const averageRating = reviews.length > 0 ? 
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const totalHelpful = reviews.reduce((sum, review) => sum + review.isHelpful, 0);

  const stats = [
    {
      title: 'Total Reviews',
      value: totalReviews,
      icon: MessageSquare,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Approved Reviews',
      value: approvedReviews,
      icon: CheckCircle,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Average Rating',
      value: averageRating.toFixed(1),
      icon: Star,
      bgColor: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      title: 'Helpful Votes',
      value: totalHelpful,
      icon: ThumbsUp,
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
