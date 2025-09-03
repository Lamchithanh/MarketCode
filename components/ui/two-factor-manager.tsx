'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, QrCode, Shield, ShieldCheck, ShieldX, Eye, EyeOff, RefreshCw, Smartphone, Key, Download } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface TwoFactorManagerProps {
  userId: string;
  userRole?: string;
  isAdmin?: boolean;
  onStatusChange?: (enabled: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface TwoFactorStatus {
  enabled: boolean;
  lastVerifiedAt?: string;
}

interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
  manualEntryKey: string;
}

export function TwoFactorManager({ 
  userId, 
  userRole = 'USER',
  isAdmin = false,
  onStatusChange,
  isOpen: externalIsOpen,
  onClose: externalOnClose
}: TwoFactorManagerProps) {
  const [isOpen, setIsOpen] = useState(externalIsOpen || false);
  const [activeTab, setActiveTab] = useState('setup');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<TwoFactorStatus | null>(null);
  const [setupData, setSetupData] = useState<TwoFactorSetup | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  
  // Form states
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Get 2FA status
  const get2FAStatus = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = userRole === 'ADMIN' ? '/api/admin/two-factor/setup' : '/api/user/two-factor/setup';
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.success) {
        setStatus({
          enabled: data.enabled,
          lastVerifiedAt: data.lastVerifiedAt
        });
      } else {
        setError(data.error || 'Failed to get 2FA status');
      }
    } catch (err) {
      console.error('Get 2FA status error:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  // Sync with external isOpen prop
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
      if (externalIsOpen) {
        get2FAStatus();
      }
    }
  }, [externalIsOpen, get2FAStatus]);

  // Setup 2FA
  const setup2FA = async () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const endpoint = userRole === 'ADMIN' ? '/api/admin/two-factor/setup' : '/api/user/two-factor/setup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSetupData({
          secret: data.secret,
          qrCodeUrl: data.qrCodeUrl,
          backupCodes: data.backupCodes,
          manualEntryKey: data.manualEntryKey
        });
        setActiveTab('verify');
        setPassword('');
      } else {
        setError(data.error || 'Failed to setup 2FA');
      }
    } catch (err) {
      console.error('Setup 2FA error:', err);
      setError('Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  // Verify and enable 2FA
  const verify2FA = async () => {
    if (!verificationCode.trim() || !setupData) {
      setError('Verification code is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const endpoint = userRole === 'ADMIN' ? '/api/admin/two-factor/verify' : '/api/user/two-factor/verify';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: setupData.secret,
          token: verificationCode,
          backupCodes: setupData.backupCodes
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('2FA has been enabled successfully!');
        setStatus({ enabled: true });
        onStatusChange?.(true);
        if (externalOnClose) {
          externalOnClose();
        } else {
          setIsOpen(false);
        }
        resetForm();
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (err) {
      console.error('Verify 2FA error:', err);
      setError('Failed to verify 2FA code');
    } finally {
      setLoading(false);
    }
  };

  // Disable 2FA
  const disable2FA = async () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const endpoint = userRole === 'ADMIN' ? '/api/admin/two-factor/disable' : '/api/user/two-factor/disable';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('2FA has been disabled successfully!');
        setStatus({ enabled: false });
        onStatusChange?.(false);
        if (externalOnClose) {
          externalOnClose();
        } else {
          setIsOpen(false);
        }
        resetForm();
      } else {
        setError(data.error || 'Failed to disable 2FA');
      }
    } catch (err) {
      console.error('Disable 2FA error:', err);
      setError('Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (err) {
      console.error('Copy error:', err);
      toast.error('Failed to copy to clipboard');
    }
  };

  // Download backup codes
  const downloadBackupCodes = () => {
    if (!setupData?.backupCodes) return;
    
    const content = `MarketCode 2FA Backup Codes\nGenerated: ${new Date().toLocaleString()}\n\n${setupData.backupCodes.join('\n')}\n\nKeep these codes safe! Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketcode-2fa-backup-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Safe removeChild
    try {
      if (a && a.parentNode) {
        a.parentNode.removeChild(a);
      }
    } catch (error) {
      // Ignore removeChild errors
      console.debug('Safe removeChild handled:', error);
    }
    
    URL.revokeObjectURL(url);
    toast.success('Backup codes downloaded!');
  };

  // Reset form
  const resetForm = () => {
    setPassword('');
    setVerificationCode('');
    setError(null);
    setSetupData(null);
    setActiveTab('setup');
  };

  // Handle open dialog
  const handleOpen = () => {
    if (externalIsOpen === undefined) {
      setIsOpen(true);
      get2FAStatus();
    }
  };

  // Handle close dialog
  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setIsOpen(false);
    }
    resetForm();
  };

  return (
    <>
      {externalIsOpen === undefined && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpen}
          className="flex items-center gap-2"
        >
          {status?.enabled ? (
            <ShieldCheck className="w-4 h-4 text-green-600" />
          ) : (
            <Shield className="w-4 h-4 text-gray-500" />
          )}
          2FA
        </Button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="xl"
        title={
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Two-Factor Authentication
            {status?.enabled && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Enabled
              </Badge>
            )}
          </div>
        }
        description={
          userRole === 'ADMIN' ? 
          'Secure your admin account with two-factor authentication using your mobile device.' :
          'Add an extra layer of security to your account with two-factor authentication.'
        }
      >
        <div className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Loading...
            </div>
          )}

          {!loading && status && (
            <>
              {status.enabled ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <ShieldCheck className="w-5 h-5" />
                      2FA is Active
                    </CardTitle>
                    <CardDescription>
                      Your account is protected with two-factor authentication.
                      {status.lastVerifiedAt && (
                        <span className="block mt-1 text-xs">
                          Last verified: {new Date(status.lastVerifiedAt).toLocaleString()}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="disable-password">Enter your password to disable 2FA</Label>
                        <div className="flex mt-2">
                          <div className="relative flex-1">
                            <Input
                              id="disable-password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && disable2FA()}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                          <Button 
                            onClick={disable2FA}
                            disabled={loading || !password.trim()}
                            variant="destructive"
                            className="ml-2"
                          >
                            <ShieldX className="w-4 h-4 mr-2" />
                            Disable 2FA
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="setup">Setup</TabsTrigger>
                    <TabsTrigger value="verify" disabled={!setupData}>Verify</TabsTrigger>
                  </TabsList>

                  <TabsContent value="setup" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Smartphone className="w-5 h-5" />
                          Setup 2FA
                        </CardTitle>
                        <CardDescription>
                          First, download an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator on your mobile device.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="setup-password">Enter your password to begin setup</Label>
                            <div className="flex mt-2">
                              <div className="relative flex-1">
                                <Input
                                  id="setup-password"
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="Enter your password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && setup2FA()}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                              </div>
                              <Button 
                                onClick={setup2FA}
                                disabled={loading || !password.trim()}
                                className="ml-2"
                              >
                                <QrCode className="w-4 h-4 mr-2" />
                                Generate QR Code
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="verify" className="space-y-4">
                    {setupData && (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Left Column - QR Code */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <QrCode className="w-5 h-5" />
                              Scan QR Code
                            </CardTitle>
                            <CardDescription>
                              Scan with your authenticator app
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-center">
                                <Image 
                                  src={setupData.qrCodeUrl} 
                                  alt="2FA QR Code" 
                                  width={180}
                                  height={180}
                                  className="border rounded-lg"
                                />
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <Label className="text-sm font-medium">Manual Entry Key:</Label>
                                <div className="flex items-center mt-1">
                                  <code className={`flex-1 text-xs font-mono ${showSecret ? '' : 'blur-sm'}`}>
                                    {setupData.manualEntryKey}
                                  </code>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowSecret(!showSecret)}
                                    className="ml-2"
                                  >
                                    {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(setupData.manualEntryKey, 'Secret key')}
                                    className="ml-1"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="verification-code">Enter 6-digit code</Label>
                                <div className="flex mt-2">
                                  <Input
                                    id="verification-code"
                                    type="text"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                    onKeyDown={(e) => e.key === 'Enter' && verify2FA()}
                                    className="text-center text-lg font-mono"
                                  />
                                  <Button 
                                    onClick={verify2FA}
                                    disabled={loading || verificationCode.length !== 6}
                                    className="ml-2"
                                  >
                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                    Verify
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Right Column - Backup Codes */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <Key className="w-5 h-5" />
                                Backup Codes
                              </span>
                              <Button
                                onClick={downloadBackupCodes}
                                variant="outline"
                                size="sm"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Save
                              </Button>
                            </CardTitle>
                            <CardDescription>
                              Save these codes securely - use once each
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <div className="grid grid-cols-1 gap-2 font-mono text-sm max-h-60 overflow-y-auto">
                                {setupData.backupCodes.map((code, index) => (
                                  <div key={index} className="flex items-center justify-between bg-white px-3 py-2 rounded border">
                                    <span>{code}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(code, 'Backup code')}
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </>
          )}

          <div className="flex justify-end gap-2 pt-4 mt-6 border-t">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
