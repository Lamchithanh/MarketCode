'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, ShieldCheck, ShieldX, Key, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface TwoFactorStatus {
  enabled: boolean;
  lastVerifiedAt?: string;
}

interface SystemStatus {
  enabled: boolean;
}

interface SetupResult {
  qrCodeUrl: string;
  secret: string;
  backupCodes: string[];
  manualEntryKey: string;
}

export default function AdminTwoFactorManager() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState<TwoFactorStatus | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [setupData, setSetupData] = useState<SetupResult | null>(null);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [copiedCodes, setCopiedCodes] = useState<Set<number>>(new Set());

  // Load initial data
  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      loadUserStatus();
      loadSystemStatus();
    }
  }, [session]);

  const loadUserStatus = async () => {
    try {
      const response = await fetch('/api/admin/two-factor/setup');
      const data = await response.json();
      
      if (data.success) {
        setUserStatus({
          enabled: data.enabled,
          lastVerifiedAt: data.lastVerifiedAt
        });
      }
    } catch (error) {
      console.error('Error loading user 2FA status:', error);
    }
  };

  const loadSystemStatus = async () => {
    try {
      const response = await fetch('/api/admin/two-factor/toggle');
      const data = await response.json();
      
      if (data.success) {
        setSystemStatus({ enabled: data.enabled });
      }
    } catch (error) {
      console.error('Error loading system 2FA status:', error);
    }
  };

  const toggleSystemStatus = async (enabled: boolean) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/two-factor/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });

      const data = await response.json();
      
      if (data.success) {
        setSystemStatus({ enabled });
        toast.success(data.message);
      } else {
        toast.error(data.error || 'Failed to update system 2FA');
      }
    } catch (error) {
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const startSetup = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/two-factor/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      
      if (data.success) {
        setSetupData({
          qrCodeUrl: data.qrCodeUrl,
          secret: data.secret,
          backupCodes: data.backupCodes,
          manualEntryKey: data.manualEntryKey
        });
        toast.success('2FA setup initiated successfully');
      } else {
        toast.error(data.error || 'Failed to setup 2FA');
      }
    } catch (error) {
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  const verifyAndEnable = async () => {
    if (!verificationToken || !setupData) {
      toast.error('Please enter verification token');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/two-factor/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: setupData.secret,
          token: verificationToken,
          backupCodes: setupData.backupCodes
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setUserStatus(prev => ({ ...prev!, enabled: true }));
        setShowSetupDialog(false);
        setSetupData(null);
        setVerificationToken('');
        toast.success('2FA has been enabled successfully!');
        loadUserStatus(); // Refresh status
      } else {
        toast.error(data.error || 'Verification failed');
      }
    } catch (error) {
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const disableTwoFactor = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/two-factor/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      
      if (data.success) {
        setUserStatus(prev => ({ ...prev!, enabled: false }));
        setShowDisableDialog(false);
        setPassword('');
        toast.success('2FA has been disabled successfully');
        loadUserStatus(); // Refresh status
      } else {
        toast.error(data.error || 'Failed to disable 2FA');
      }
    } catch (error) {
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (typeof index === 'number') {
        setCopiedCodes(prev => new Set(prev).add(index));
        setTimeout(() => {
          setCopiedCodes(prev => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
          });
        }, 2000);
      }
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  if (session?.user?.role !== 'ADMIN') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <span>Admin access required</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System 2FA Settings
          </CardTitle>
          <CardDescription>
            Enable or disable Two-Factor Authentication for the entire admin system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="system-2fa">Enable 2FA System</Label>
              <p className="text-sm text-muted-foreground mt-1">
                When enabled, admins can use 2FA for additional security
              </p>
            </div>
            <Switch
              id="system-2fa"
              checked={systemStatus?.enabled || false}
              onCheckedChange={toggleSystemStatus}
              disabled={loading}
            />
          </div>
          
          {systemStatus && (
            <Alert className="mt-4">
              <AlertDescription className="flex items-center gap-2">
                {systemStatus.enabled ? (
                  <>
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    2FA is enabled for the system
                  </>
                ) : (
                  <>
                    <ShieldX className="h-4 w-4 text-amber-600" />
                    2FA is disabled for the system
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* User 2FA Management */}
      {systemStatus?.enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              My 2FA Settings
            </CardTitle>
            <CardDescription>
              Manage your personal Two-Factor Authentication settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStatus && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {userStatus.enabled ? (
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                    ) : (
                      <ShieldX className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium">
                        2FA Status: <Badge variant={userStatus.enabled ? "default" : "secondary"}>
                          {userStatus.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </p>
                      {userStatus.lastVerifiedAt && (
                        <p className="text-sm text-muted-foreground">
                          Last verified: {new Date(userStatus.lastVerifiedAt).toLocaleString('vi-VN')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {!userStatus.enabled ? (
                      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
                        <DialogTrigger asChild>
                          <Button>Enable 2FA</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                            <DialogDescription>
                              Set up 2FA to secure your admin account
                            </DialogDescription>
                          </DialogHeader>
                          
                          {!setupData ? (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="setup-password">Current Password</Label>
                                <Input
                                  id="setup-password"
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Enter your password"
                                />
                              </div>
                              <Button 
                                onClick={startSetup}
                                disabled={loading || !password}
                                className="w-full"
                              >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Start Setup
                              </Button>
                            </div>
                          ) : (
                            <Tabs defaultValue="qr" className="w-full">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="qr">QR Code</TabsTrigger>
                                <TabsTrigger value="manual">Manual</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="qr" className="space-y-4">
                                <div className="text-center">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img 
                                    src={setupData.qrCodeUrl} 
                                    alt="2FA QR Code" 
                                    className="mx-auto border rounded-lg"
                                  />
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Scan with your authenticator app
                                  </p>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="manual" className="space-y-4">
                                <div>
                                  <Label>Manual Entry Key</Label>
                                  <div className="flex gap-2 mt-1">
                                    <Input 
                                      value={setupData.manualEntryKey}
                                      readOnly
                                      className="font-mono"
                                    />
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      onClick={() => copyToClipboard(setupData.manualEntryKey)}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label>Backup Codes</Label>
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    {setupData.backupCodes.map((code, index) => (
                                      <div key={index} className="flex gap-1">
                                        <Input 
                                          value={code}
                                          readOnly
                                          className="font-mono text-xs"
                                        />
                                        <Button 
                                          size="sm"
                                          variant="outline"
                                          onClick={() => copyToClipboard(code, index)}
                                        >
                                          {copiedCodes.has(index) ? (
                                            <CheckCircle className="h-3 w-3" />
                                          ) : (
                                            <Copy className="h-3 w-3" />
                                          )}
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Save these backup codes in a secure location
                                  </p>
                                </div>
                              </TabsContent>
                              
                              <div className="space-y-4 pt-4">
                                <div>
                                  <Label htmlFor="verification-token">Verification Code</Label>
                                  <Input
                                    id="verification-token"
                                    value={verificationToken}
                                    onChange={(e) => setVerificationToken(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                  />
                                </div>
                                <Button 
                                  onClick={verifyAndEnable}
                                  disabled={loading || !verificationToken}
                                  className="w-full"
                                >
                                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Verify & Enable
                                </Button>
                              </div>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline">Disable 2FA</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
                            <DialogDescription>
                              This will remove 2FA protection from your account
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                Your account will be less secure without 2FA
                              </AlertDescription>
                            </Alert>
                            
                            <div>
                              <Label htmlFor="disable-password">Current Password</Label>
                              <Input
                                id="disable-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                              />
                            </div>
                            
                            <Button 
                              onClick={disableTwoFactor}
                              disabled={loading || !password}
                              variant="destructive"
                              className="w-full"
                            >
                              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Disable 2FA
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
