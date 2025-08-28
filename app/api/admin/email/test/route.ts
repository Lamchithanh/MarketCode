import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Test email connection
export async function GET() {
  try {
    const result = await EmailService.testConnection();
    
    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Email service connection successful' : 'Email service connection failed',
      error: result.error
    });
  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test email service' 
      },
      { status: 500 }
    );
  }
}

// Send test email
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Chỉ admin mới có thể test email
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { to, subject, message } = await request.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to, subject, message' },
        { status: 400 }
      );
    }

    const template = {
      subject,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">MarketCode</h1>
            <p style="color: #666; margin-top: 5px;">Test Email</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
            <div style="white-space: pre-wrap; color: #333; line-height: 1.6;">
              ${message}
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>MarketCode Email Service Test</p>
            <p>Sent at: ${new Date().toLocaleString('vi-VN')}</p>
          </div>
        </div>
      `
    };

    const result = await EmailService.sendEmail(to, template);

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      error: result.error
    });

  } catch (error) {
    console.error('Send test email error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send test email' 
      },
      { status: 500 }
    );
  }
}
