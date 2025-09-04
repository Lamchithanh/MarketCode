import { NextResponse } from 'next/server';
import { EmailService } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const { testEmail } = await request.json();

    if (!testEmail) {
      return NextResponse.json(
        { error: 'Email test address is required' },
        { status: 400 }
      );
    }

    console.log('🧪 Testing email sending to:', testEmail);

    // Tạo email test đơn giản
    const testTemplate = {
      subject: '[TEST] MarketCode Email System Debug',
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Test</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px;">🧪 EMAIL TEST</h1>
                <p style="margin: 10px 0 0; font-size: 16px;">MarketCode Email System Debug</p>
            </div>
            
            <div style="padding: 30px 0;">
                <h2 style="color: #333;">Test Email thành công!</h2>
                <p style="color: #666; line-height: 1.6;">
                    Nếu bạn nhận được email này, có nghĩa là hệ thống email của MarketCode đang hoạt động bình thường.
                </p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                    <h3 style="margin: 0 0 15px; color: #333;">Thông tin debug:</h3>
                    <ul style="color: #666; margin: 0; padding-left: 20px;">
                        <li><strong>Thời gian gửi:</strong> ${new Date().toLocaleString('vi-VN')}</li>
                        <li><strong>From domain:</strong> marketcode.eqpt</li>
                        <li><strong>SMTP server:</strong> Gmail SMTP</li>
                        <li><strong>Test ID:</strong> ${Date.now()}</li>
                    </ul>
                </div>
                
                <p style="color: #666;">
                    Nếu email reply vẫn không đến được khách hàng, có thể do:
                    <br>• Email bị lọc spam
                    <br>• Domain reputation thấp  
                    <br>• Thiếu SPF/DKIM records
                    <br>• ISP blocking
                </p>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #999;">
                <p style="margin: 0;">© 2025 MarketCode.eqpt - Email System Test</p>
            </div>
        </body>
        </html>
      `,
      text: `
        EMAIL TEST - MarketCode System Debug
        
        Nếu bạn nhận được email này, hệ thống email đang hoạt động bình thường.
        
        Thông tin debug:
        - Thời gian: ${new Date().toLocaleString('vi-VN')}
        - From: support@marketcode.eqpt
        - Test ID: ${Date.now()}
        
        MarketCode Email System
      `
    };

    // Log chi tiết
    console.log('📧 Email template prepared');
    console.log('📋 Subject:', testTemplate.subject);
    console.log('🎯 To:', testEmail);

    const result = await EmailService.sendEmail(testEmail, testTemplate);

    console.log('📬 Email send result:', result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        details: {
          to: testEmail,
          subject: testTemplate.subject,
          sentAt: new Date().toISOString(),
          emailId: result.emailId || 'N/A'
        }
      });
    } else {
      console.error('❌ Email send failed:', result.error);
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email',
        error: result.error,
        details: {
          to: testEmail,
          attemptedAt: new Date().toISOString()
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('🚨 Debug email API error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
