'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface ForgotPasswordOTPProps {
  onSuccess?: () => void;
}

type Step = 'email' | 'otp' | 'password';

interface FormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorCode?: string;
}

interface APIResponse {
  success: boolean;
  message?: string;
  error?: string;
  resetToken?: string;
  requires2FA?: boolean;
  expiresIn?: number;
  tokenExpiresIn?: number;
}

export default function ForgotPasswordOTP({ onSuccess }: ForgotPasswordOTPProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [requires2FA, setRequires2FA] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorCode: ''
  });

  // Countdown timer cho resend OTP
  const startCountdown = (seconds: number) => {
    setCountdown(seconds);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Bước 1: Gửi OTP đến email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/forgot-password-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data: APIResponse = await response.json();

      if (data.success) {
        setSuccess(data.message || 'OTP đã được gửi đến email của bạn');
        setCurrentStep('otp');
        if (data.expiresIn) {
          startCountdown(data.expiresIn);
        }
      } else {
        setError(data.error || 'Đã xảy ra lỗi');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác thực OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: formData.otp 
        })
      });

      const data: APIResponse = await response.json();

      if (data.success && data.resetToken) {
        setSuccess(data.message || 'OTP xác thực thành công');
        setResetToken(data.resetToken);
        setRequires2FA(data.requires2FA || false);
        setCurrentStep('password');
      } else {
        setError(data.error || 'OTP không hợp lệ');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  // Bước 3: Đặt lại mật khẩu
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword) return;

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    if (requires2FA && !formData.twoFactorCode) {
      setError('Vui lòng nhập mã xác thực 2FA');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/reset-password-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken,
          newPassword: formData.newPassword,
          twoFactorCode: requires2FA ? formData.twoFactorCode : undefined
        })
      });

      const data: APIResponse = await response.json();

      if (data.success) {
        setSuccess(data.message || 'Mật khẩu đã được đặt lại thành công');
        
        // Redirect sau 2 giây
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/login');
          }
        }, 2000);
      } else {
        setError(data.error || 'Đã xảy ra lỗi');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  // Gửi lại OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleSendOTP({ preventDefault: () => {} } as React.FormEvent);
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {currentStep === 'email' && 'Quên mật khẩu'}
          {currentStep === 'otp' && 'Xác thực OTP'}
          {currentStep === 'password' && 'Đặt lại mật khẩu'}
        </CardTitle>
        <CardDescription>
          {currentStep === 'email' && 'Nhập email để nhận mã OTP'}
          {currentStep === 'otp' && 'Nhập mã OTP đã được gửi đến email'}
          {currentStep === 'password' && 'Tạo mật khẩu mới cho tài khoản'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Bước 1: Nhập Email */}
        {currentStep === 'email' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập địa chỉ email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="mr-2 inline-block animate-spin">⏳</span>
                  Đang gửi...
                </>
              ) : (
                'Gửi mã OTP'
              )}
            </Button>
          </form>
        )}

        {/* Bước 2: Nhập OTP */}
        {currentStep === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="text-sm text-gray-600 text-center">
              Mã OTP đã được gửi đến: <strong>{formData.email}</strong>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otp">Mã OTP (6 số)</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={formData.otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  updateFormData('otp', value);
                }}
                disabled={loading}
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>

            {countdown > 0 && (
              <div className="text-sm text-gray-500 text-center">
                Gửi lại OTP sau {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleResendOTP}
                disabled={loading || countdown > 0}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <span className="mr-2 inline-block animate-spin">⏳</span>
                    Đang gửi...
                  </>
                ) : (
                  'Gửi lại'
                )}
              </Button>
              <Button type="submit" disabled={loading || !formData.otp} className="flex-1">
                {loading ? (
                  <>
                    <span className="mr-2 inline-block animate-spin">⏳</span>
                    Đang xác thực...
                  </>
                ) : (
                  'Xác thực'
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Bước 3: Đặt lại mật khẩu */}
        {currentStep === 'password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                value={formData.newPassword}
                onChange={(e) => updateFormData('newPassword', e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {requires2FA && (
              <div className="space-y-2">
                <Label htmlFor="twoFactorCode">Mã xác thực 2FA</Label>
                <Input
                  id="twoFactorCode"
                  type="text"
                  placeholder="Nhập mã từ ứng dụng xác thực"
                  value={formData.twoFactorCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    updateFormData('twoFactorCode', value);
                  }}
                  disabled={loading}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
                <div className="text-sm text-blue-600">
                  🔐 Tài khoản có bật 2FA, vui lòng nhập mã từ ứng dụng xác thực
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="mr-2 inline-block animate-spin">⏳</span>
                  Đang đặt lại...
                </>
              ) : (
                'Đặt lại mật khẩu'
              )}
            </Button>
          </form>
        )}

        {/* Navigation */}
        <div className="flex justify-between text-sm">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:underline"
            disabled={loading}
          >
            ← Quay lại đăng nhập
          </button>

          {currentStep !== 'email' && (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 'otp') setCurrentStep('email');
                if (currentStep === 'password') setCurrentStep('otp');
                setError('');
                setSuccess('');
              }}
              className="text-gray-600 hover:underline"
              disabled={loading}
            >
              Quay lại
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}