'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Shield, Calendar, CheckCircle, Clock } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: string;
  emailVerified?: string;
  createdAt: string;
}

interface UserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserData | null;
}

export function UserViewDialog({ open, onOpenChange, user }: UserViewDialogProps) {
  if (!user) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadge = (role: string) => {
    return (
      <Badge 
        variant={role === 'ADMIN' ? 'default' : 'secondary'}
        className={role === 'ADMIN' ? 'bg-stone-600 text-white' : 'bg-stone-100 text-stone-600'}
      >
        <Shield className="h-3 w-3 mr-1" />
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge 
        variant={isActive ? 'default' : 'destructive'}
        className={isActive ? 'bg-green-100 text-green-800' : ''}
      >
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const getVerificationStatus = (emailVerified?: string) => {
    if (emailVerified) {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">Verified</span>
        </div>
      );
    }
    return (
      <div className="flex items-center text-yellow-600">
        <Clock className="h-4 w-4 mr-1" />
        <span className="text-sm">Pending</span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about the user account
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-stone-500 to-stone-600 text-white text-lg">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.isActive)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">User ID</label>
              <p className="font-mono text-sm bg-muted p-2 rounded mt-1">{user.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Verification</label>
              <div className="mt-1">
                {getVerificationStatus(user.emailVerified)}
                {user.emailVerified && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Verified on {formatDate(user.emailVerified)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Last Login
              </label>
              <p className="text-foreground mt-1">{formatDate(user.lastLoginAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Account Created
              </label>
              <p className="text-foreground mt-1">{formatDate(user.createdAt)}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Account Statistics</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-foreground">
                  {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-xs text-muted-foreground">Days Active</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-foreground">
                  {user.lastLoginAt ? 
                    Math.floor((Date.now() - new Date(user.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24)) : 
                    'N/A'
                  }
                </div>
                <div className="text-xs text-muted-foreground">Days Since Login</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-foreground">
                  {user.role === 'ADMIN' ? 'Yes' : 'No'}
                </div>
                <div className="text-xs text-muted-foreground">Admin Access</div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
