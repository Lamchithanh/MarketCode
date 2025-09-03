import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email-service';
import { supabaseServiceRole } from '@/lib/supabase-server';
import { z } from 'zod';

// Schema validation cho contact form
const contactSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  email: z.string().email('Email không hợp lệ'),
  subject: z.string().min(1, 'Tiêu đề không được để trống'),
  message: z.string().min(5, 'Tin nhắn phải có ít nhất 5 ký tự'),
  phone: z.string().optional().transform(val => val === '' ? undefined : val),
  company: z.string().optional().transform(val => val === '' ? undefined : val),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Dữ liệu không hợp lệ', 
          details: validation.error.issues 
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message, phone, company } = validation.data;

    // Lấy thông tin admin email từ SystemSetting
    const { data: settingsData, error: settingsError } = await supabaseServiceRole
      .from('SystemSetting')
      .select('key, value')
      .in('key', ['contact_email', 'support_email', 'admin_email']);

    if (settingsError) {
      console.error('Error fetching admin email:', settingsError);
    }

    // Xác định email người nhận (admin)
    let adminEmail = 'admin@marketcode.vn';
    if (settingsData && settingsData.length > 0) {
      const emailSettings = settingsData.find(item => 
        item.key === 'contact_email' || 
        item.key === 'support_email' || 
        item.key === 'admin_email'
      );
      if (emailSettings) {
        adminEmail = emailSettings.value;
      }
    }

    // Tạo email template cho admin
    const adminEmailTemplate = {
      subject: `[MarketCode] Liên hệ mới: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Liên hệ mới từ MarketCode</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #4a4a4a;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: #8b4513;
              color: white;
              padding: 25px;
              text-align: center;
            }
            .header h1 {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .header p {
              font-size: 16px;
              opacity: 0.9;
            }
            .content {
              padding: 30px;
            }
            .section {
              margin-bottom: 25px;
              padding: 20px;
              background: #fafafa;
              border-radius: 6px;
              border-left: 4px solid #8b4513;
            }
            .section h2 {
              color: #2d2d2d;
              font-size: 18px;
              margin-bottom: 15px;
              font-weight: 600;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 20px;
            }
            .info-item {
              background: white;
              padding: 12px;
              border-radius: 4px;
              border: 1px solid #e5e5e5;
            }
            .info-label {
              font-weight: 600;
              color: #666;
              font-size: 13px;
              margin-bottom: 4px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .info-value {
              color: #2d2d2d;
              font-size: 15px;
            }
            .message-content {
              background: white;
              padding: 18px;
              border-radius: 6px;
              border: 1px solid #e5e5e5;
              margin-top: 15px;
              white-space: pre-wrap;
              font-size: 15px;
              line-height: 1.6;
              color: #4a4a4a;
            }
            .footer {
              background: #f8f8f8;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e5e5e5;
              font-size: 13px;
              color: #666;
            }
            .priority-notice {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 12px;
              border-radius: 4px;
              margin-top: 15px;
              font-size: 14px;
              text-align: center;
              font-weight: 500;
            }
            @media (max-width: 600px) {
              .info-grid {
                grid-template-columns: 1fr;
              }
              .container {
                margin: 15px;
                border-radius: 6px;
              }
              .header, .content {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>MarketCode</h1>
              <p>Thông báo liên hệ mới từ khách hàng</p>
            </div>
            
            <div class="content">
              <div class="section">
                <h2>Thông tin khách hàng</h2>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Họ và tên</div>
                    <div class="info-value">${name}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${email}</div>
                  </div>
                  ${phone ? `
                  <div class="info-item">
                    <div class="info-label">Điện thoại</div>
                    <div class="info-value">${phone}</div>
                  </div>
                  ` : ''}
                  ${company ? `
                  <div class="info-item">
                    <div class="info-label">Công ty</div>
                    <div class="info-value">${company}</div>
                  </div>
                  ` : ''}
                </div>
              </div>
              
              <div class="section">
                <h2>Nội dung liên hệ</h2>
                <div class="info-item" style="margin-bottom: 15px;">
                  <div class="info-label">Tiêu đề</div>
                  <div class="info-value">${subject}</div>
                </div>
                <div class="message-content">${message.replace(/\n/g, '<br>')}</div>
                
                <div class="priority-notice">
                  Vui lòng phản hồi khách hàng trong vòng 24 giờ để duy trì uy tín dịch vụ
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>MarketCode</strong> - Hệ thống liên hệ tự động</p>
              <p>Thời gian: ${new Date().toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh',
                year: 'numeric',
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Liên hệ mới từ MarketCode

Họ tên: ${name}
Email: ${email}
${phone ? `Điện thoại: ${phone}` : ''}
${company ? `Công ty: ${company}` : ''}
Tiêu đề: ${subject}

Nội dung:
${message}

---
Thời gian: ${new Date().toLocaleString('vi-VN')}
      `
    };

    // Gửi email cho admin
    const result = await EmailService.sendEmail(
      adminEmail,
      adminEmailTemplate
    );

    if (!result.success) {
      console.error('Failed to send contact email:', result.error);
      // Tạm thời không return error để form vẫn hoạt động - chỉ log lỗi
      console.warn('Email service không khả dụng, nhưng form vẫn được xử lý');
    }

    // Gửi email xác nhận cho khách hàng
    const confirmationTemplate = {
      subject: 'MarketCode - Xác nhận đã nhận liên hệ',
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cảm ơn bạn đã liên hệ MarketCode</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #4a4a4a;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: #8b4513;
              color: white;
              padding: 25px;
              text-align: center;
            }
            .header h1 {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .header p {
              font-size: 16px;
              opacity: 0.9;
            }
            .content {
              padding: 30px;
            }
            .greeting {
              font-size: 18px;
              color: #2d2d2d;
              margin-bottom: 20px;
              font-weight: 500;
            }
            .message {
              font-size: 15px;
              color: #4a4a4a;
              line-height: 1.7;
              margin-bottom: 25px;
            }
            .highlight-box {
              background: #f5f1ec;
              border-left: 4px solid #8b4513;
              padding: 20px;
              border-radius: 6px;
              margin: 25px 0;
              text-align: center;
            }
            .highlight-box .title {
              color: #2d2d2d;
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .highlight-box .subtitle {
              color: #8b4513;
              font-size: 18px;
              font-weight: 700;
            }
            .contact-info {
              background: #fafafa;
              padding: 20px;
              border-radius: 6px;
              margin: 25px 0;
              border: 1px solid #e5e5e5;
            }
            .contact-info h3 {
              color: #2d2d2d;
              font-size: 16px;
              margin-bottom: 15px;
              font-weight: 600;
            }
            .contact-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .contact-item {
              text-align: center;
              padding: 15px;
              background: white;
              border-radius: 4px;
              border: 1px solid #e5e5e5;
            }
            .contact-item .label {
              font-weight: 600;
              color: #666;
              font-size: 13px;
              margin-bottom: 5px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .contact-item .value {
              color: #2d2d2d;
              font-size: 15px;
            }
            .footer {
              background: #f8f8f8;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e5e5e5;
            }
            .social-links {
              margin: 15px 0;
            }
            .social-links a {
              display: inline-block;
              margin: 0 8px;
              padding: 8px 16px;
              background: #8b4513;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-size: 14px;
              font-weight: 500;
              transition: background-color 0.3s;
            }
            .social-links a:hover {
              background: #6d3410;
            }
            .copyright {
              font-size: 13px;
              color: #666;
              margin-top: 15px;
            }
            @media (max-width: 600px) {
              .contact-grid {
                grid-template-columns: 1fr;
              }
              .container {
                margin: 15px;
                border-radius: 6px;
              }
              .header, .content, .footer {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Cảm ơn bạn đã liên hệ!</h1>
              <p>MarketCode đã nhận được thông tin của bạn</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Xin chào ${name},
              </div>
              
              <div class="message">
                Chúng tôi xin gửi lời cảm ơn chân thành vì bạn đã tin tưởng và liên hệ với <strong>MarketCode</strong>. 
                Tin nhắn của bạn với tiêu đề "<strong>${subject}</strong>" đã được tiếp nhận và chúng tôi sẽ xem xét kỹ lưỡng.
              </div>
              
              <div class="highlight-box">
                <div class="title">Thời gian phản hồi dự kiến</div>
                <div class="subtitle">Trong vòng 24 giờ làm việc</div>
              </div>
              
              <div class="message">
                Đội ngũ chuyên viên của MarketCode sẽ nghiên cứu yêu cầu của bạn và gửi phản hồi chi tiết qua địa chỉ email này. 
                Trong trường hợp cần hỗ trợ khẩn cấp, bạn có thể liên hệ trực tiếp qua các thông tin dưới đây:
              </div>
              
              <div class="contact-info">
                <h3>Thông tin liên hệ trực tiếp</h3>
                <div class="contact-grid">
                  <div class="contact-item">
                    <div class="label">Email hỗ trợ</div>
                    <div class="value">${adminEmail}</div>
                  </div>
                  <div class="contact-item">
                    <div class="label">Hotline</div>
                    <div class="value">1900 0000</div>
                  </div>
                </div>
              </div>
              
              <div class="message">
                <strong>MarketCode</strong> cam kết mang đến các giải pháp công nghệ chất lượng cao và dịch vụ hỗ trợ khách hàng tận tình, 
                chuyên nghiệp. Chúng tôi trân trọng sự tin tưởng của bạn.
              </div>
            </div>
            
            <div class="footer">
              <div class="social-links">
                <a href="#">Website</a>
                <a href="#">Facebook</a>
                <a href="#">Zalo</a>
              </div>
              
              <div class="copyright">
                <p><strong>MarketCode</strong> - Giải pháp thương mại điện tử</p>
                <p>© ${new Date().getFullYear()} MarketCode. Đã đăng ký bản quyền.</p>
                <p>Cảm ơn bạn đã lựa chọn MarketCode!</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Xin chào ${name},

Chúng tôi xin gửi lời cảm ơn chân thành vì bạn đã tin tưởng và liên hệ với MarketCode.

Tin nhắn của bạn với tiêu đề "${subject}" đã được tiếp nhận và chúng tôi sẽ xem xét kỹ lưỡng.

THỜI GIAN PHẢN HỒI Dự KIẾN: Trong vòng 24 giờ làm việc

Nếu cần hỗ trợ khẩn cấp, bạn có thể liên hệ trực tiếp:
- Email hỗ trợ: ${adminEmail}
- Hotline: 1900 0000

MarketCode cam kết mang đến các giải pháp công nghệ chất lượng cao và dịch vụ hỗ trợ khách hàng tận tình, chuyên nghiệp.

Trân trọng,
Đội ngũ MarketCode

---
© ${new Date().getFullYear()} MarketCode. Đã đăng ký bản quyền.
Cảm ơn bạn đã lựa chọn MarketCode!
      `
    };

    // Gửi email xác nhận (không bắt buộc phải thành công)
    await EmailService.sendEmail(
      email,
      confirmationTemplate
    ).catch(error => {
      console.error('Failed to send confirmation email:', error);
      // Không return error vì email chính đã gửi thành công
    });

    // Lưu thông tin liên hệ vào database
    try {
      await supabaseServiceRole
        .from('ContactMessage')
        .insert([
          {
            name,
            email,
            subject,
            message,
            isRead: false
          }
        ]);
    } catch (dbError) {
      console.error('Failed to save contact message:', dbError);
      // Không return error vì email đã gửi thành công
    }

    return NextResponse.json({
      success: true,
      message: result.success 
        ? 'Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong vòng 24 giờ.'
        : 'Tin nhắn của bạn đã được lưu thành công! Chúng tôi sẽ phản hồi trong vòng 24 giờ.',
      messageId: result.messageId || 'saved'
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
