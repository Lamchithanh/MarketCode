'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, RefreshCw, RotateCcw } from 'lucide-react';

interface UsersSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh?: () => void;
  onResetFilters?: () => void;
  loading?: boolean;
}

export function UsersSearch({ 
  searchTerm, 
  onSearchChange, 
  onRefresh,
  onResetFilters,
  loading = false 
}: UsersSearchProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            {onResetFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onResetFilters}
                disabled={loading}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
