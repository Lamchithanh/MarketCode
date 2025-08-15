'use client';

import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface SettingsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SettingsSearch({ searchTerm, onSearchChange }: SettingsSearchProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search settings..." 
            value={searchTerm} 
            onChange={(e) => onSearchChange(e.target.value)} 
            className="pl-10" 
          />
        </div>
      </CardContent>
    </Card>
  );
}
