'use client';

import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export function ReviewsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Review Management</h2>
        <p className="text-muted-foreground">
          Manage customer reviews and ratings
        </p>
      </div>
      <Button size="sm" className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white">
        <Star className="h-4 w-4 mr-2" />
        Add Review
      </Button>
    </div>
  );
}
