'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Smartphone, KeyRound, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface TwoFactorAuthProps {
  email: string;
  password: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  callbackUrl?: string;
}

export function TwoFactorAuth({ 
  email, 
  password, 
  open, 
  onOpenChange, 
  onSuccess, 
  callbackUrl 
}: TwoFactorAuthProps) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);

  const handleVerify = async () => {
    if (!token.trim()) {
      toast.error('Please enter verification code');
      return;
    }

    setLoading(true);
    try {
      // First verify 2FA token
      const verifyResponse = await fetch('/api/admin/two-factor/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        toast.error(verifyData.error || 'Invalid verification code');
        return;
      }

      // If 2FA verified, proceed with login
      const result = await signIn('credentials', {
        email,
        password,
        twoFactor: token,
        redirect: false,
      });

      if (result?.ok) {
        toast.success('Login successful!');
        onSuccess?.();
        onOpenChange(false);
        
        if (callbackUrl) {
          window.location.href = callbackUrl;
        } else {
          window.location.reload();
        }
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenInput = (value: string) => {
    if (useBackupCode) {
      // Backup codes are alphanumeric, 8 characters
      setToken(value.toUpperCase().slice(0, 8));
    } else {
      // TOTP codes are 6 digits
      setToken(value.replace(/\D/g, '').slice(0, 6));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            Enter the verification code from your authenticator app or use a backup code.
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {useBackupCode ? (
                <>
                  <KeyRound className="w-4 h-4" />
                  Backup Code
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  Authenticator Code
                </>
              )}
            </CardTitle>
            <CardDescription>
              {useBackupCode
                ? 'Enter one of your saved backup recovery codes'
                : 'Open your authenticator app and enter the 6-digit code'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twofa-token">
                {useBackupCode ? 'Backup Code' : 'Verification Code'}
              </Label>
              <Input
                id="twofa-token"
                value={token}
                onChange={(e) => handleTokenInput(e.target.value)}
                placeholder={useBackupCode ? 'XXXXXXXX' : '000000'}
                className="text-center font-mono text-lg"
                maxLength={useBackupCode ? 8 : 6}
                autoComplete="one-time-code"
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleVerify} 
                disabled={loading || token.length < (useBackupCode ? 8 : 6)}
                className="w-full"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </Button>

              <Button
                variant="ghost"
                onClick={() => setUseBackupCode(!useBackupCode)}
                className="w-full text-sm"
              >
                {useBackupCode 
                  ? 'Use authenticator app instead'
                  : 'Use backup code instead'
                }
              </Button>
            </div>

            {useBackupCode && (
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  Each backup code can only be used once. Make sure to save your remaining codes.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="link" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
