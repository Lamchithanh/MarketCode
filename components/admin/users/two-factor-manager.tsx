'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Copy, Download, Eye, EyeOff, Key, KeyRound, QrCode, Shield, ShieldCheck, ShieldX, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  twoFactorEnabled?: boolean;
  lastTwoFactorAt?: string;
}

interface TwoFactorManagerProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
  manualEntryKey: string;
}

export function TwoFactorManager({ user, open, onOpenChange, onUpdate }: TwoFactorManagerProps) {
  const [loading, setLoading] = useState(false);
  const [setupData, setSetupData] = useState<TwoFactorSetup | null>(null);
  const [verificationToken, setVerificationToken] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [activeTab, setActiveTab] = useState('status');
  const [systemEnabled, setSystemEnabled] = useState(true);

  // Setup 2FA
  const handleSetup2FA = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/two-factor/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'temp' }) // Tạm thời không cần password
      });

      const data = await response.json();

      if (data.success) {
        setSetupData({
          secret: data.secret,
          qrCodeUrl: data.qrCodeUrl,
          backupCodes: data.backupCodes,
          manualEntryKey: data.manualEntryKey
        });
        setActiveTab('setup');
        toast.success('2FA setup initiated');
      } else {
        toast.error(data.error || 'Failed to setup 2FA');
      }
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      toast.error('Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  // Verify và enable 2FA
  const handleVerifyAndEnable = async () => {
    if (!setupData || !verificationToken.trim()) {
      toast.error('Please enter verification code');
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
        toast.success('2FA enabled successfully!');
        setSetupData(null);
        setVerificationToken('');
        setActiveTab('status');
        onUpdate?.();
      } else {
        toast.error(data.error || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast.error('Failed to verify 2FA');
    } finally {
      setLoading(false);
    }
  };

  // Disable 2FA
  const handleDisable2FA = async () => {
    if (!disablePassword.trim()) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/two-factor/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: disablePassword })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('2FA disabled successfully');
        setDisablePassword('');
        setActiveTab('status');
        onUpdate?.();
      } else {
        toast.error(data.error || 'Failed to disable 2FA');
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  // Toggle system 2FA
  const handleToggleSystem2FA = async (enabled: boolean) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/two-factor/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });

      const data = await response.json();

      if (data.success) {
        setSystemEnabled(enabled);
        toast.success(`System 2FA ${enabled ? 'enabled' : 'disabled'}`);
      } else {
        toast.error(data.error || 'Failed to toggle system 2FA');
      }
    } catch (error) {
      console.error('Error toggling system 2FA:', error);
      toast.error('Failed to toggle system 2FA');
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  // Download backup codes
  const downloadBackupCodes = () => {
    if (!setupData) return;
    
    const content = `MarketCode 2FA Backup Codes\nGenerated: ${new Date().toLocaleString()}\n\n${setupData.backupCodes.join('\n')}\n\nKeep these codes safe - each can only be used once!`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketcode-2fa-backup-codes-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup codes downloaded');
  };

  const isAdmin = user.role === 'ADMIN';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            Manage 2FA settings for {user.name} ({user.email})
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            {/* Status Tab */}
            <TabsContent value="status" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Current Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">User 2FA Status</p>
                      <p className="text-sm text-muted-foreground">
                        {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <Badge variant={user.twoFactorEnabled ? 'default' : 'secondary'}>
                      {user.twoFactorEnabled ? (
                        <>
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Enabled
                        </>
                      ) : (
                        <>
                          <ShieldX className="w-3 h-3 mr-1" />
                          Disabled
                        </>
                      )}
                    </Badge>
                  </div>

                  {user.twoFactorEnabled && user.lastTwoFactorAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Last verified: {new Date(user.lastTwoFactorAt).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!user.twoFactorEnabled ? (
                      <Button onClick={handleSetup2FA} disabled={loading} className="flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        {loading ? 'Setting up...' : 'Setup 2FA'}
                      </Button>
                    ) : (
                      <Button 
                        variant="destructive" 
                        onClick={() => setActiveTab('settings')}
                        className="flex items-center gap-2"
                      >
                        <ShieldX className="w-4 h-4" />
                        Disable 2FA
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Setup Tab */}
          <TabsContent value="setup" className="mt-4 space-y-4">
            {setupData ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - QR Code */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <QrCode className="w-5 h-5" />
                      QR Code Setup
                    </CardTitle>
                    <CardDescription>
                      Scan with your authenticator app
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 bg-white rounded-lg border">
                        <Image 
                          src={setupData.qrCodeUrl} 
                          alt="2FA QR Code" 
                          width={160}
                          height={160}
                          className="w-40 h-40" 
                        />
                      </div>
                    </div>

                    {/* Manual Entry - Compact */}
                    <div className="space-y-2">
                      <Label className="text-sm">Manual Key</Label>
                      <div className="flex gap-1">
                        <Input
                          value={showSecret ? setupData.manualEntryKey : '•'.repeat(16)}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowSecret(!showSecret)}
                        >
                          {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(setupData.manualEntryKey, 'Secret key')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Verification */}
                    <div className="space-y-2">
                      <Label htmlFor="verification-token" className="text-sm">Verification Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="verification-token"
                          value={verificationToken}
                          onChange={(e) => setVerificationToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="000000"
                          className="font-mono text-center text-lg"
                          maxLength={6}
                        />
                        <Button 
                          onClick={handleVerifyAndEnable} 
                          disabled={loading || verificationToken.length !== 6}
                          size="sm"
                        >
                          <ShieldCheck className="w-4 h-4 mr-1" />
                          Enable
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Right Column - Backup Codes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span className="flex items-center gap-2">
                        <KeyRound className="w-5 h-5" />
                        Backup Codes
                      </span>
                      <Button size="sm" variant="outline" onClick={downloadBackupCodes}>
                        <Download className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Save these codes securely - use once each
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-4">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="text-xs">
                        Keep these codes safe! Each can only be used once.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {setupData.backupCodes.map((code, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm font-mono border"
                        >
                          <span>{code}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-6 h-6"
                            onClick={() => copyToClipboard(code, `Code ${index + 1}`)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">Click &quot;Setup 2FA&quot; to begin</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-4 space-y-4">
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Global 2FA settings for the system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System 2FA</p>
                      <p className="text-sm text-muted-foreground">
                        Enable/disable 2FA for the entire system
                      </p>
                    </div>
                    <Switch
                      checked={systemEnabled}
                      onCheckedChange={handleToggleSystem2FA}
                      disabled={loading}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Disable 2FA */}
            {user.twoFactorEnabled && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Permanently disable two-factor authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      Disabling 2FA will make your account less secure. You will need to enter your password to confirm.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <Label htmlFor="disable-password">Current Password</Label>
                    <Input
                      id="disable-password"
                      type="password"
                      value={disablePassword}
                      onChange={(e) => setDisablePassword(e.target.value)}
                      placeholder="Enter your current password"
                    />
                  </div>
                  
                  <Button 
                    variant="destructive" 
                    onClick={handleDisable2FA}
                    disabled={loading || !disablePassword.trim()}
                    className="w-full"
                  >
                    <ShieldX className="w-4 h-4 mr-2" />
                    {loading ? 'Disabling...' : 'Disable 2FA'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </div>
        </Tabs>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
