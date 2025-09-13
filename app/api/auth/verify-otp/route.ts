import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';
import { z } from 'zod';

const verifyOTPSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  otp: z.string().min(6, 'OTP phải có 6 số').max(6, 'OTP phải có 6 số'),
});

// Get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

// Tạo security log
async function logSecurityEvent(data: {
  userId?: string;
  action: string;
  details: Record<string, unknown>;
}) {
  try {
    await supabaseServiceRole
      .from('SecurityLog')
      .insert({
        userId: data.userId || null,
        action: data.action,
        details: data.details,
        createdAt: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('🔐 OTP verification request started');
  
  try {
    const body = await request.json();
    const { email, otp } = verifyOTPSchema.parse(body);
    console.log(`📧 Verifying OTP for: ${email}`);

    // Tìm user với email
    const { data: user, error: userError } = await supabaseServiceRole
      .from('User')
      .select('id, email, name, twoFactorEnabled, isActive')
      .eq('email', email)
      .single();

    if (userError || !user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'Email không tồn tại trong hệ thống' },
        { status: 400 }
      );
    }

    if (!user.isActive) {
      console.log('❌ User not active');
      return NextResponse.json(
        { error: 'Tài khoản đã bị vô hiệu hóa' },
        { status: 400 }
      );
    }

    // Tìm OTP
    const { data: verificationCode, error: otpError } = await supabaseServiceRole
      .from('VerificationCode')
      .select('*')
      .eq('email', email)
      .eq('type', 'PASSWORD_RESET')
      .eq('code', otp)
      .gte('expiresAt', new Date().toISOString())
      .single();

    if (otpError || !verificationCode) {
      console.log('❌ OTP not found or expired');
      
      // Log failed attempt
      await logSecurityEvent({
        userId: user.id,
        action: 'otp_verification_failed',
        details: {
          email: user.email,
          reason: 'invalid_or_expired_otp',
          ip: getClientIP(request),
          userAgent: request.headers.get('user-agent') || 'Unknown'
        }
      });

      return NextResponse.json(
        { error: 'OTP không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    // OTP hợp lệ, tạo temporary token để reset password
    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    // Lưu reset token (hoặc update bảng PasswordResetToken)
    const { error: tokenError } = await supabaseServiceRole
      .from('PasswordResetToken')
      .upsert({
        userId: user.id,
        token: resetToken,
        expiresAt: tokenExpiresAt.toISOString(),
        isUsed: false,
        attempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, {
        onConflict: 'userId'
      });

    if (tokenError) {
      console.error('Error creating reset token:', tokenError);
      throw new Error('Failed to create reset token');
    }

    // Xóa OTP đã sử dụng
    await supabaseServiceRole
      .from('VerificationCode')
      .delete()
      .eq('id', verificationCode.id);

    // Log successful verification
    await logSecurityEvent({
      userId: user.id,
      action: 'otp_verification_success',
      details: {
        email: user.email,
        has2FA: user.twoFactorEnabled,
        ip: getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'Unknown'
      }
    });

    console.log(`🔐 OTP verification completed in: ${Date.now() - startTime}ms`);

    return NextResponse.json({
      success: true,
      message: 'OTP xác thực thành công',
      resetToken,
      requires2FA: user.twoFactorEnabled,
      tokenExpiresIn: 900 // 15 phút = 900 giây
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Đã xảy ra lỗi, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}