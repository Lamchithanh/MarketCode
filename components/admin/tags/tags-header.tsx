'use client';

import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';

interface TagsHeaderProps {
  onAddTag?: () => void;
}

export function TagsHeader({ onAddTag }: TagsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tag Management</h2>
        <p className="text-muted-foreground">
          Manage product tags and labels
        </p>
      </div>
      <Button 
        size="sm" 
        className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white"
        onClick={onAddTag}
      >
        <Tag className="h-4 w-4 mr-2" />
        Add Tag
      </Button>
    </div>
  );
}
