'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface TestResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export default function AdminEmailTester() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<TestResult | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: ''
  });

  const testConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    
    try {
      const response = await fetch('/api/admin/email/test');
      const data = await response.json();
      
      setConnectionStatus({
        success: data.success,
        error: data.error
      });
      
      if (data.success) {
        toast.success('Email service connection successful');
      } else {
        toast.error(data.error || 'Connection failed');
      }
    } catch (error) {
      setConnectionStatus({
        success: false,
        error: 'Network error occurred'
      });
      toast.error('Network error occurred');
    } finally {
      setTestingConnection(false);
    }
  };

  const sendTestEmail = async () => {
    if (!formData.to || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/admin/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      setTestResult({
        success: data.success,
        messageId: data.messageId,
        error: data.error
      });
      
      if (data.success) {
        toast.success('Test email sent successfully');
        // Reset form
        setFormData({
          to: '',
          subject: '',
          message: ''
        });
      } else {
        toast.error(data.error || 'Failed to send email');
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Network error occurred'
      });
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fillSampleData = () => {
    setFormData({
      to: session?.user?.email || '',
      subject: 'MarketCode Email Service Test',
      message: `Hello ${session?.user?.name || 'Admin'},

This is a test email from MarketCode email service.

System Information:
- Timestamp: ${new Date().toLocaleString('vi-VN')}
- Service: Google SMTP
- Environment: ${process.env.NODE_ENV || 'development'}

If you receive this email, the email service is working correctly.

Best regards,
MarketCode Team`
    });
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
      {/* Connection Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Service Connection Test
          </CardTitle>
          <CardDescription>
            Test the connection to Google SMTP email service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testConnection}
            disabled={testingConnection}
            className="w-full"
          >
            {testingConnection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Connection
          </Button>
          
          {connectionStatus && (
            <Alert className={connectionStatus.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-start gap-2">
                {connectionStatus.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                )}
                <AlertDescription className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      Connection Status:
                    </span>
                    <Badge variant={connectionStatus.success ? "default" : "destructive"}>
                      {connectionStatus.success ? 'Success' : 'Failed'}
                    </Badge>
                  </div>
                  {connectionStatus.error && (
                    <p className="text-sm text-muted-foreground">
                      Error: {connectionStatus.error}
                    </p>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Send Test Email */}
      <Card>
        <CardHeader>
          <CardTitle>Send Test Email</CardTitle>
          <CardDescription>
            Send a test email to verify the email service is working properly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Email Content</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fillSampleData}
            >
              Fill Sample Data
            </Button>
          </div>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="test-to">To Email</Label>
              <Input
                id="test-to"
                type="email"
                value={formData.to}
                onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                placeholder="recipient@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="test-subject">Subject</Label>
              <Input
                id="test-subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Email subject"
              />
            </div>
            
            <div>
              <Label htmlFor="test-message">Message</Label>
              <Textarea
                id="test-message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Email content"
                rows={8}
              />
            </div>
          </div>
          
          <Button 
            onClick={sendTestEmail}
            disabled={loading || !formData.to || !formData.subject || !formData.message}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Test Email
          </Button>
          
          {testResult && (
            <Alert className={testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-start gap-2">
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                )}
                <AlertDescription className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      Email Status:
                    </span>
                    <Badge variant={testResult.success ? "default" : "destructive"}>
                      {testResult.success ? 'Sent' : 'Failed'}
                    </Badge>
                  </div>
                  {testResult.messageId && (
                    <p className="text-xs font-mono text-muted-foreground">
                      Message ID: {testResult.messageId}
                    </p>
                  )}
                  {testResult.error && (
                    <p className="text-sm text-red-600 mt-1">
                      Error: {testResult.error}
                    </p>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
