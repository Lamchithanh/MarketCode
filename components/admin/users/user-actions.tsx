'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Eye, Trash2, Shield, UserX, Mail, CheckCircle } from 'lucide-react';
import { User } from '@/lib/services/user-service';

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  onVerifyEmail?: (user: User) => void;
}

export function UserActions({ 
  user, 
  onEdit, 
  onDelete, 
  onView,
  onToggleStatus,
  onVerifyEmail
}: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        {onView && (
          <DropdownMenuItem onClick={() => onView(user)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
        )}
        {onToggleStatus && (
          <DropdownMenuItem onClick={() => onToggleStatus(user)}>
            {user.isActive ? (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
        )}
        {onVerifyEmail && !user.emailVerified && (
          <DropdownMenuItem onClick={() => onVerifyEmail(user)}>
            <Mail className="mr-2 h-4 w-4" />
            Verify Email
          </DropdownMenuItem>
        )}
        {user.emailVerified && (
          <DropdownMenuItem disabled className="text-green-600">
            <CheckCircle className="mr-2 h-4 w-4" />
            Email Verified
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(user)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
