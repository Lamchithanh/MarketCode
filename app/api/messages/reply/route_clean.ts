import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { EmailService } from '@/lib/email-service';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, recipientEmail, subject, replyMessage } = body;

    // Validate required fields
    if (!messageId || !recipientEmail || !subject || !replyMessage) {
      return NextResponse.json(
        { error: 'Tất cả các trường là bắt buộc' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get email configuration and support email from database
    const { data: emailConfig, error: configError } = await supabase
      .from('SystemSetting')
      .select('key, value')
      .in('key', ['email_from_name', 'support_email'])
      .then(({ data, error }) => {
        if (error) return { data: null, error };
        
        const config: Record<string, string> = {};
        data?.forEach(setting => {
          config[setting.key] = setting.value;
        });
        
        return { 
          data: {
            senderName: config.email_from_name || 'MarketCode Admin',
            senderEmail: config.support_email || 'thanhlc.dev@gmail.com'
          }, 
          error: null 
        };
      });

    if (configError) {
      console.error('Error fetching email config:', configError);
    }

    const senderName = emailConfig?.senderName || 'MarketCode Admin';
    const senderEmail = emailConfig?.senderEmail || 'thanhlc.dev@gmail.com';

    // Get the original message to verify it exists
    const { data: originalMessage, error: messageError } = await supabase
      .from('ContactMessage')
      .select('*')
      .eq('id', messageId)
      .single();

    if (messageError) {
      return NextResponse.json(
        { error: 'Không tìm thấy tin nhắn gốc' },
        { status: 404 }
      );
    }

    // Create simple, professional email template
    const emailTemplate = {
      subject: subject,
      html: `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phản hồi từ MarketCode</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333333; background-color: #ffffff; margin: 0; padding: 20px;">
    
    <table width="600" cellpadding="0" cellspacing="0" style="margin: 0 auto; background: #ffffff; border: 2px solid #e0e0e0;">
        
        <!-- Header -->
        <tr>
            <td style="background-color: #f5f5f5; padding: 25px; text-align: center; border-bottom: 2px solid #e0e0e0;">
                <h1 style="font-size: 22px; font-weight: bold; margin: 0; color: #333333;">MARKETCODE</h1>
                <p style="font-size: 13px; margin: 5px 0 0 0; color: #666666;">Đội ngũ hỗ trợ khách hàng</p>
            </td>
        </tr>
        
        <!-- Content -->
        <tr>
            <td style="padding: 25px;">
                
                <p style="font-size: 15px; margin: 0 0 18px 0; color: #333333;">
                    <strong>Kính gửi ${originalMessage.name},</strong>
                </p>
                
                <p style="font-size: 14px; margin: 0 0 25px 0; color: #333333; line-height: 1.4;">
                    Chúng tôi đã nhận được tin nhắn của bạn và xin gửi phản hồi như sau:
                </p>
                
                <!-- Original Message Section -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background-color: #f9f9f9; border: 1px solid #ddd;">
                    <tr>
                        <td style="padding: 18px;">
                            <h3 style="color: #333333; font-size: 13px; font-weight: bold; margin: 0 0 12px 0; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 6px;">
                                TIN NHẮN CỦA BẠN
                            </h3>
                            
                            <table width="100%" cellpadding="3" cellspacing="0" style="font-size: 13px; margin-bottom: 12px;">
                                <tr>
                                    <td width="70" style="font-weight: bold; color: #333333; vertical-align: top;">Chủ đề:</td>
                                    <td style="color: #666666;">${originalMessage.subject}</td>
                                </tr>
                                <tr>
                                    <td width="70" style="font-weight: bold; color: #333333; vertical-align: top;">Ngày:</td>
                                    <td style="color: #666666;">${new Date(originalMessage.createdAt).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</td>
                                </tr>
                            </table>
                            
                            <table width="100%" cellpadding="12" cellspacing="0" style="background: #ffffff; border: 1px solid #eee;">
                                <tr>
                                    <td style="font-size: 13px; line-height: 1.4; color: #333333;">
                                        ${originalMessage.message.replace(/\n/g, '<br>')}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                <!-- Reply Section -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background-color: #ffffff; border: 2px solid #333333;">
                    <tr>
                        <td style="padding: 18px;">
                            <h3 style="color: #333333; font-size: 13px; font-weight: bold; margin: 0 0 12px 0; text-transform: uppercase; border-bottom: 2px solid #333333; padding-bottom: 6px;">
                                PHẢN HỒI CỦA CHÚNG TÔI
                            </h3>
                            <div style="font-size: 13px; line-height: 1.5; color: #333333;">
                                ${replyMessage.replace(/\n/g, '<br>')}
                            </div>
                        </td>
                    </tr>
                </table>
                
                <p style="font-size: 13px; margin: 25px 0 18px 0; color: #333333;">
                    Nếu cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi qua email này.
                </p>
                
                <!-- Signature -->
                <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #ddd; margin-top: 25px;">
                    <tr>
                        <td style="padding-top: 18px;">
                            <p style="margin: 0; font-size: 13px; color: #333333; line-height: 1.4;">
                                <strong>Trân trọng,</strong><br>
                                ${senderName}<br>
                                <span style="color: #666666;">Email: ${senderEmail}</span>
                            </p>
                        </td>
                    </tr>
                </table>
                
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background-color: #f5f5f5; padding: 18px; text-align: center; border-top: 2px solid #e0e0e0; font-size: 11px; color: #666666;">
                <p style="margin: 0 0 8px 0;">
                    <strong>MARKETCODE</strong> - Nền tảng thương mại điện tử
                </p>
                <p style="margin: 0 0 4px 0;">
                    Email: ${senderEmail} | Website: https://marketcode.eqpt
                </p>
                <p style="margin: 0; font-size: 10px;">
                    © 2025 MarketCode. Tất cả quyền được bảo lưu.
                </p>
            </td>
        </tr>
        
    </table>
    
</body>
</html>`,
      text: `
═══════════════════════════════════════════════════
                 MARKETCODE
        Đội ngũ hỗ trợ khách hàng
═══════════════════════════════════════════════════

Kính gửi ${originalMessage.name},

Chúng tôi đã nhận được tin nhắn của bạn và xin gửi phản hồi như sau:

┌─────────────────────────────────────────────────┐
│               TIN NHẮN CỦA BẠN                  │
└─────────────────────────────────────────────────┘

• Chủ đề: ${originalMessage.subject}
• Ngày: ${new Date(originalMessage.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
})}

Nội dung:
${originalMessage.message}

┌─────────────────────────────────────────────────┐
│             PHẢN HỒI CỦA CHÚNG TÔI              │
└─────────────────────────────────────────────────┘

${replyMessage}

───────────────────────────────────────────────────

Nếu cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi qua email này.

Trân trọng,
${senderName}
Email: ${senderEmail}

═══════════════════════════════════════════════════
MARKETCODE - Nền tảng thương mại điện tử
Email: ${senderEmail} | Website: https://marketcode.eqpt
© 2025 MarketCode. Tất cả quyền được bảo lưu.
`
    };

    // Send email
    const emailResult = await EmailService.sendEmail(recipientEmail, emailTemplate);

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      return NextResponse.json(
        { error: 'Không thể gửi email phản hồi' },
        { status: 500 }
      );
    }

    // Mark original message as read and save reply content
    await supabase
      .from('ContactMessage')
      .update({ 
        isRead: true,
        replyContent: replyMessage,
        repliedAt: new Date().toISOString(),
        repliedBy: senderName
      })
      .eq('id', messageId);

    // Log the reply for debugging
    console.log('Reply sent successfully:', {
      messageId,
      recipientEmail,
      subject,
      replyMessage,
      sentAt: new Date().toISOString(),
      emailResult: emailResult
    });

    return NextResponse.json({
      success: true,
      message: 'Email phản hồi đã được gửi thành công',
      emailId: emailResult.messageId
    });

  } catch (error) {
    console.error('Error sending reply email:', error);
    return NextResponse.json(
      { error: 'Lỗi máy chủ nội bộ khi gửi email phản hồi' },
      { status: 500 }
    );
  }
}
