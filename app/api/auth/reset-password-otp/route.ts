import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import * as speakeasy from 'speakeasy';

const resetPasswordSchema = z.object({
  resetToken: z.string().min(1, 'Token là bắt buộc'),
  newPassword: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  twoFactorCode: z.string().optional(), // Chỉ bắt buộc nếu user có 2FA
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
  console.log('🔐 Password reset request started');
  
  try {
    const body = await request.json();
    const { resetToken, newPassword, twoFactorCode } = resetPasswordSchema.parse(body);
    console.log('🔍 Processing password reset with token');

    // Tìm reset token
    const { data: passwordResetToken, error: tokenError } = await supabaseServiceRole
      .from('PasswordResetToken')
      .select('*')
      .eq('token', resetToken)
      .eq('isUsed', false)
      .gte('expiresAt', new Date().toISOString())
      .single();

    if (tokenError || !passwordResetToken) {
      console.log('❌ Invalid or expired reset token');
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    // Tìm user
    const { data: user, error: userError } = await supabaseServiceRole
      .from('User')
      .select('id, email, name, twoFactorEnabled, twoFactorSecret, isActive')
      .eq('id', passwordResetToken.userId)
      .single();

    if (userError || !user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'Người dùng không tồn tại' },
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

    // Kiểm tra 2FA nếu bắt buộc
    if (user.twoFactorEnabled && user.twoFactorSecret) {
      if (!twoFactorCode) {
        console.log('❌ 2FA code required but not provided');
        return NextResponse.json(
          { error: 'Tài khoản có bật 2FA, vui lòng nhập mã xác thực' },
          { status: 400 }
        );
      }

      // Verify 2FA code
      const is2FAValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
        window: 2 // Allow some time drift
      });

      if (!is2FAValid) {
        console.log('❌ Invalid 2FA code');
        
        // Log failed 2FA attempt
        await logSecurityEvent({
          userId: user.id,
          action: 'password_reset_2fa_failed',
          details: {
            email: user.email,
            ip: getClientIP(request),
            userAgent: request.headers.get('user-agent') || 'Unknown'
          }
        });

        return NextResponse.json(
          { error: 'Mã xác thực 2FA không hợp lệ' },
          { status: 400 }
        );
      }

      console.log('✅ 2FA verification passed');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    const { error: updateError } = await supabaseServiceRole
      .from('User')
      .update({
        password: hashedPassword,
        updatedAt: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating password:', updateError);
      throw new Error('Failed to update password');
    }

    // Mark reset token as used
    await supabaseServiceRole
      .from('PasswordResetToken')
      .update({
        isUsed: true,
        updatedAt: new Date().toISOString()
      })
      .eq('id', passwordResetToken.id);

    // Invalidate all refresh tokens (force logout from all devices)
    await supabaseServiceRole
      .from('RefreshToken')
      .update({
        isRevoked: true,
        updatedAt: new Date().toISOString()
      })
      .eq('userId', user.id)
      .eq('isRevoked', false);

    // Log successful password reset
    await logSecurityEvent({
      userId: user.id,
      action: 'password_reset_success',
      details: {
        email: user.email,
        has2FA: user.twoFactorEnabled,
        used2FA: user.twoFactorEnabled && !!twoFactorCode,
        ip: getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'Unknown'
      }
    });

    console.log(`🔐 Password reset completed in: ${Date.now() - startTime}ms`);

    return NextResponse.json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công. Tất cả phiên đăng nhập khác đã được đăng xuất.'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    
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