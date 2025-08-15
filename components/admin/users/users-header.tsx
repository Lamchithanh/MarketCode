'use client';

import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface UsersHeaderProps {
  onAddUser?: () => void;
}

export function UsersHeader({ onAddUser }: UsersHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          Manage user accounts and permissions
        </p>
      </div>
      <Button 
        size="sm" 
        className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white"
        onClick={onAddUser}
      >
        <Users className="h-4 w-4 mr-2" />
        Add User
      </Button>
    </div>
  );
}
