import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';
import { EmailService } from '@/lib/email-service';
import crypto from 'crypto';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

// Tạo OTP 6 số
function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
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

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('🔐 OTP Forgot password request started');
  
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);
    console.log(`📧 Processing OTP forgot password for: ${email}`);

    // Tìm user với email
    console.log('🔍 Looking up user...');
    const userStartTime = Date.now();
    const { data: user, error: userError } = await supabaseServiceRole
      .from('User')
      .select('id, email, name, twoFactorEnabled, isActive')
      .eq('email', email)
      .single();
    console.log(`🔍 User lookup took: ${Date.now() - userStartTime}ms`);

    if (userError || !user) {
      // Luôn trả về success để tránh email enumeration attack
      console.log('❌ User not found, but returning success for security');
      return NextResponse.json({
        success: true,
        message: 'Nếu email tồn tại, mã OTP đã được gửi đến hộp thư của bạn.'
      });
    }

    // Không cho phép reset password cho tài khoản không active
    if (!user.isActive) {
      console.log('❌ User not active, but returning success for security');
      return NextResponse.json({
        success: true,
        message: 'Nếu email tồn tại, mã OTP đã được gửi đến hộp thư của bạn.'
      });
    }

    // Kiểm tra xem đã có OTP chưa để tránh spam
    const { data: existingOTP } = await supabaseServiceRole
      .from('VerificationCode')
      .select('*')
      .eq('email', email)
      .eq('type', 'PASSWORD_RESET')
      .gte('expiresAt', new Date().toISOString())
      .single();

    if (existingOTP) {
      console.log('⚠️ OTP already exists and still valid');
      return NextResponse.json({
        success: true,
        message: 'Mã OTP đã được gửi trước đó, vui lòng kiểm tra email hoặc chờ 5 phút để gửi lại.'
      });
    }

    // Tạo OTP mới
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    console.log('📝 Creating new OTP...');
    const otpStartTime = Date.now();
    
    // Xóa OTP cũ (nếu có) và tạo mới
    await supabaseServiceRole
      .from('VerificationCode')
      .delete()
      .eq('email', email)
      .eq('type', 'PASSWORD_RESET');

    const { error: otpError } = await supabaseServiceRole
      .from('VerificationCode')
      .insert({
        userId: user.id,
        email: email,
        code: otp,
        type: 'PASSWORD_RESET',
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

    console.log(`📝 OTP creation took: ${Date.now() - otpStartTime}ms`);

    if (otpError) {
      console.error('Error creating OTP:', otpError);
      throw new Error('Failed to create OTP');
    }

    // Gửi OTP qua email
    console.log('📧 Sending OTP email...');
    const emailStartTime = Date.now();
    
    const emailTemplate = {
      subject: 'Mã OTP đặt lại mật khẩu - MarketCode',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; border: 1px solid #e5e7eb;">
            <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 600;">MarketCode</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">Đặt lại mật khẩu</p>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 56px; height: 56px; background: #2563eb; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px;">🔑</span>
              </div>
              <h2 style="color: #1f2937; margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">Xin chào ${user.name || 'khách hàng'},</h2>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6; margin: 0 0 30px 0; text-align: center;">
              Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP sau để tiến hành:
            </p>
            
            <div style="background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px; margin: 0; font-family: monospace;">
                ${otp}
              </div>
              <p style="color: #6b7280; margin: 15px 0 0 0; font-size: 14px;">
                Mã có hiệu lực trong 5 phút
              </p>
            </div>
            
            ${user.twoFactorEnabled ? `
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h4 style="color: #92400e; margin: 0 0 10px 0; display: flex; align-items: center;">
                <span style="margin-right: 8px;">🔐</span> Bảo mật nâng cao
              </h4>
              <p style="color: #92400e; margin: 0; line-height: 1.5;">
                Tài khoản của bạn đã bật xác thực 2 yếu tố. Sau khi nhập OTP, bạn sẽ cần xác thực 2FA để hoàn tất việc đặt lại mật khẩu.
              </p>
            </div>
            ` : ''}
            
            <div style="margin: 30px 0; padding: 20px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #2563eb;">
              <h4 style="color: #1d4ed8; margin: 0 0 10px 0; display: flex; align-items: center;">
                <span style="margin-right: 8px;">🔒</span> Lưu ý bảo mật
              </h4>
              <ul style="color: #1d4ed8; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Không chia sẻ mã OTP với bất kỳ ai</li>
                <li>Mã sẽ hết hiệu lực sau 5 phút</li>
                <li>Nếu bạn không yêu cầu, vui lòng bỏ qua email này</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 5px 0;">
                MarketCode - Nền tảng chia sẻ source code
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} MarketCode. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
Mã OTP đặt lại mật khẩu: ${otp}

Xin chào ${user.name || 'khách hàng'},

Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản MarketCode.
Mã OTP: ${otp}
Mã có hiệu lực trong 5 phút.

${user.twoFactorEnabled ? 'Lưu ý: Tài khoản của bạn có bật 2FA, bạn sẽ cần xác thực thêm sau khi nhập OTP.' : ''}

Không chia sẻ mã này với bất kỳ ai.
Nếu bạn không yêu cầu, vui lòng bỏ qua email này.

© ${new Date().getFullYear()} MarketCode
      `
    };

    const emailResult = await EmailService.sendEmail(user.email, emailTemplate);
    console.log(`📧 Email send took: ${Date.now() - emailStartTime}ms`);
    
    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error);
      throw new Error('Failed to send OTP email');
    }

    // Log security event
    await logSecurityEvent({
      userId: user.id,
      action: 'otp_password_reset_requested',
      details: {
        email: user.email,
        has2FA: user.twoFactorEnabled,
        ip: getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'Unknown',
        otpExpires: expiresAt.toISOString()
      }
    });

    console.log(`🔐 Total OTP forgot password took: ${Date.now() - startTime}ms`);

    return NextResponse.json({
      success: true,
      message: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.',
      expiresIn: 300 // 5 phút = 300 giây
    });

  } catch (error) {
    console.error('OTP Forgot password error:', error);
    
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