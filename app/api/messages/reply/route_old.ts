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

    // Create email template for reply
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
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #374151; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #57534e 0%, #44403c 50%, #292524 100%); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="font-size: 32px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.025em;">MarketCode</h1>
            <p style="font-size: 16px; margin: 0; opacity: 0.9;">Professional Support Team</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <div style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 24px;">
                Xin chào ${originalMessage.name},
            </div>
            
            <p style="color: #6b7280; margin-bottom: 32px; font-size: 16px;">
                Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi đã xem xét tin nhắn của bạn và xin gửi phản hồi chi tiết bên dưới.
            </p>
            
            <!-- Original Message -->
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-left: 4px solid #57534e; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <h3 style="color: #57534e; font-size: 16px; font-weight: 600; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.05em;">
                    Tin nhắn gốc của bạn
                </h3>
                <div style="margin-bottom: 16px;">
                    <div style="margin-bottom: 12px;">
                        <span style="font-weight: 600; color: #374151; display: inline-block; min-width: 100px;">Chủ đề:</span>
                        <span style="color: #6b7280;">${originalMessage.subject}</span>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <span style="font-weight: 600; color: #374151; display: inline-block; min-width: 100px;">Ngày gửi:</span>
                        <span style="color: #6b7280;">${new Date(originalMessage.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                    </div>
                </div>
                <div style="background: white; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap; line-height: 1.7; color: #374151;">
                    ${originalMessage.message}
                </div>
            </div>
            
            <!-- Reply Section -->
            <div style="background: #f0fdf4; border: 1px solid #e5e7eb; border-left: 4px solid #10b981; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <h3 style="color: #059669; font-size: 16px; font-weight: 600; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.05em;">
                    Phản hồi từ đội ngũ hỗ trợ
                </h3>
                <div style="background: white; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap; line-height: 1.7; color: #374151;">
                    ${replyMessage}
                </div>
            </div>
            
            <p style="color: #6b7280; margin: 32px 0; font-size: 16px;">
                Nếu bạn cần hỗ trợ thêm hoặc có bất kỳ câu hỏi nào khác, đừng ngần ngại liên hệ lại với chúng tôi.
            </p>
            
            <!-- Signature -->
            <div style="margin-top: 40px; padding-top: 24px; border-top: 2px solid #f3f4f6;">
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="font-weight: 700; color: #1f2937; font-size: 16px; margin-bottom: 4px;">Trân trọng,</div>
                    <div style="color: #57534e; font-weight: 600; font-size: 14px; margin-bottom: 8px;">${senderName}</div>
                    <div style="color: #6b7280; font-size: 14px;">Email: ${senderEmail}</div>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #1f2937; color: #d1d5db; padding: 32px 30px; text-align: center;">
            <div style="margin-bottom: 20px;">
                <strong>MarketCode</strong> - Your trusted marketplace platform
            </div>
            <div style="margin: 16px 0;">
                <a href="mailto:${senderEmail}" style="color: #57534e; text-decoration: none; font-weight: 500; margin: 0 8px;">Liên hệ hỗ trợ</a>
                <a href="https://marketcode.eqpt" style="color: #57534e; text-decoration: none; font-weight: 500; margin: 0 8px;">Truy cập website</a>
            </div>
            <div style="font-size: 14px; opacity: 0.8; margin-top: 16px;">
                © 2025 MarketCode. Tất cả quyền được bảo lưu.
            </div>
        </div>
        
    </div>
</body>
</html>`,
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
        }
        .email-wrapper {
            background-color: #f8fafc;
            padding: 40px 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .header {
            background: linear-gradient(135deg, #57534e 0%, #44403c 50%, #292524 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
        }
        .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.025em;
            position: relative;
            z-index: 1;
        }
        .header p {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 400;
            position: relative;
            z-index: 1;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 24px;
        }
        .intro-text {
            color: #6b7280;
            margin-bottom: 32px;
            font-size: 16px;
        }
        .message-section {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 24px;
            margin: 24px 0;
        }
        .message-section h3 {
            color: #374151;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .original-message {
            border-left: 4px solid #57534e;
            background: #fafafa;
        }
        .original-message h3 {
            color: #57534e;
        }
        .reply-section {
            border-left: 4px solid #10b981;
            background: #f0fdf4;
        }
        .reply-section h3 {
            color: #059669;
        }
        .message-meta {
            display: grid;
            gap: 12px;
            margin-bottom: 16px;
        }
        .message-meta-item {
            display: flex;
            align-items: flex-start;
        }
        .message-meta-label {
            font-weight: 600;
            color: #374151;
            min-width: 100px;
            margin-right: 12px;
        }
        .message-meta-value {
            color: #6b7280;
            flex: 1;
        }
        .message-content {
            background: white;
            padding: 20px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            white-space: pre-wrap;
            line-height: 1.7;
            color: #374151;
            margin-top: 16px;
        }
        .signature {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 2px solid #f3f4f6;
        }
        .signature-content {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 24px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .signature-name {
            font-weight: 700;
            color: #1f2937;
            font-size: 16px;
            margin-bottom: 4px;
        }
        .signature-title {
            color: #57534e;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .signature-email {
            color: #6b7280;
            font-size: 14px;
        }
        .footer {
            background: #1f2937;
            color: #d1d5db;
            padding: 32px 30px;
            text-align: center;
        }
        .footer-content {
            margin-bottom: 20px;
        }
        .footer-links {
            margin: 16px 0;
        }
        .footer-links a {
            color: #57534e;
            text-decoration: none;
            font-weight: 500;
            margin: 0 8px;
        }
        .footer-links a:hover {
            color: #78716c;
        }
        .footer-copyright {
            font-size: 14px;
            opacity: 0.8;
            margin-top: 16px;
        }
        @media (max-width: 600px) {
            .email-wrapper { padding: 20px 10px; }
            .header { padding: 32px 20px; }
            .header h1 { font-size: 28px; }
            .content { padding: 32px 20px; }
            .footer { padding: 24px 20px; }
            .message-section { padding: 20px; }
            .message-meta-item { flex-direction: column; }
            .message-meta-label { min-width: auto; margin-bottom: 4px; }
        }
    </style>
        .original-message p {
            margin: 5px 0;
            font-size: 14px;
            color: #6c757d;
        }
        .reply-content {
            background-color: #ffffff;
            padding: 20px;
            margin: 20px 0;
            border: 1px solid #e9ecef;
            border-radius: 4px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e9ecef;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <div class="header">
                <h1>MarketCode</h1>
                <p>Professional Support Team</p>
            </div>
            
            <div class="content">
                <div class="greeting">Xin chào ${originalMessage.name},</div>
                
                <p class="intro-text">
                    Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi đã xem xét tin nhắn của bạn và xin gửi phản hồi chi tiết bên dưới.
                </p>
                
                <div class="message-section original-message">
                    <h3>Tin nhắn gốc của bạn</h3>
                    <div class="message-meta">
                        <div class="message-meta-item">
                            <span class="message-meta-label">Chủ đề:</span>
                            <span class="message-meta-value">${originalMessage.subject}</span>
                        </div>
                        <div class="message-meta-item">
                            <span class="message-meta-label">Ngày gửi:</span>
                            <span class="message-meta-value">${new Date(originalMessage.createdAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                        </div>
                    </div>
                    <div class="message-content">${originalMessage.message}</div>
                </div>
                
                <div class="message-section reply-section">
                    <h3>Phản hồi từ đội ngũ hỗ trợ</h3>
                    <div class="message-content">${replyMessage}</div>
                </div>
                
                <p class="intro-text">
                    Nếu bạn cần hỗ trợ thêm hoặc có bất kỳ câu hỏi nào khác, đừng ngần ngại liên hệ lại với chúng tôi.
                </p>
                
                <div class="signature">
                    <div class="signature-content">
                        <div class="signature-name">Trân trọng,</div>
                        <div class="signature-title">${senderName}</div>
                        <div class="signature-email">Email: ${senderEmail}</div>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-content">
                    <strong>MarketCode</strong> - Your trusted marketplace platform
                </div>
                <div class="footer-links">
                    <a href="mailto:${senderEmail}">Liên hệ hỗ trợ</a>
                    <a href="https://marketcode.eqpt">Truy cập website</a>
                </div>
                <div class="footer-copyright">
                    © 2025 MarketCode. Tất cả quyền được bảo lưu.
                </div>
            </div>
        </div>
    </div>
</body>
</html>`,
      text: `
════════════════════════════════════════════════════
                    MARKETCODE
            Professional Support Team
════════════════════════════════════════════════════

Xin chào ${originalMessage.name},

Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi đã xem xét tin nhắn của bạn và xin gửi phản hồi chi tiết bên dưới.

┌─────────────────────────────────────────────────────┐
│                TIN NHẮN GỐC CỦA BẠN                 │
└─────────────────────────────────────────────────────┘

• Chủ đề: ${originalMessage.subject}
• Ngày gửi: ${new Date(originalMessage.createdAt).toLocaleDateString('vi-VN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

Nội dung:
${originalMessage.message}

┌─────────────────────────────────────────────────────┐
│             PHẢN HỒI TỪ ĐỘI NGŨ HỖ TRỢ              │
└─────────────────────────────────────────────────────┘

${replyMessage}

────────────────────────────────────────────────────────

Nếu bạn cần hỗ trợ thêm hoặc có bất kỳ câu hỏi nào khác, đừng ngần ngại liên hệ lại với chúng tôi.

Trân trọng,
${senderName}
Email: ${senderEmail}

════════════════════════════════════════════════════
                    MARKETCODE
        Your trusted marketplace platform
════════════════════════════════════════════════════

📧 Liên hệ hỗ trợ: ${senderEmail}
🌐 Website: https://marketcode.eqpt

© 2025 MarketCode. Tất cả quyền được bảo lưu.
`
    };

    // Send email
    const emailResult = await EmailService.sendEmail(recipientEmail, emailTemplate);

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Không thể gửi email phản hồi', details: emailResult.error },
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
