import nodemailer from 'nodemailer';
import { supabaseServiceRole } from '@/lib/supabase-server';

export interface EmailConfig {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  smtp_secure: boolean;
  from_name: string;
  from_address: string;
  service_enabled: boolean;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;
  private static config: EmailConfig | null = null;

  /**
   * Lấy cấu hình email từ database
   */
  private static async getEmailConfig(): Promise<EmailConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      const { data, error } = await supabaseServiceRole
        .from('SystemSetting')
        .select('key, value')
        .in('key', [
          'email_smtp_host',
          'email_smtp_port', 
          'email_smtp_user',
          'email_smtp_password',
          'email_smtp_secure',
          'email_from_name',
          'email_from_address',
          'email_service_enabled'
        ]);

      if (error) {
        console.error('Error fetching email config:', error);
        throw new Error('Failed to fetch email configuration');
      }

      // Chuyển đổi array thành object
      const configObj: Record<string, string> = {};
      data?.forEach(item => {
        configObj[item.key] = item.value;
      });

      this.config = {
        smtp_host: configObj['email_smtp_host'] || 'smtp.gmail.com',
        smtp_port: parseInt(configObj['email_smtp_port'] || '587'),
        smtp_user: configObj['email_smtp_user'] || 'thanhlc.dev@gmail.com',
        smtp_password: configObj['email_smtp_password'] || 'ncgq pvim bcve smal',
        smtp_secure: configObj['email_smtp_secure'] === 'true',
        from_name: configObj['email_from_name'] || 'MarketCode Team',
        from_address: configObj['email_from_address'] || 'thanhlc.dev@gmail.com',
        service_enabled: configObj['email_service_enabled'] !== 'false'
      };

      return this.config;
    } catch (error) {
      console.error('Email config error:', error);
      // Fallback configuration
      return {
        smtp_host: 'smtp.gmail.com',
        smtp_port: 587,
        smtp_user: 'thanhlc.dev@gmail.com',
        smtp_password: 'ncgq pvim bcve smal',
        smtp_secure: false,
        from_name: 'MarketCode Team',
        from_address: 'thanhlc.dev@gmail.com',
        service_enabled: true
      };
    }
  }

  /**
   * Tạo transporter với cấu hình từ database
   */
  private static async createTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) {
      return this.transporter;
    }

    const config = await this.getEmailConfig();

    this.transporter = nodemailer.createTransport({
      host: config.smtp_host,
      port: config.smtp_port,
      secure: config.smtp_secure, // false cho TLS/STARTTLS
      auth: {
        user: config.smtp_user,
        pass: config.smtp_password,
      },
      tls: {
        rejectUnauthorized: false, // Cho phép self-signed certificates
      },
    });

    return this.transporter;
  }

  /**
   * Gửi email
   */
  static async sendEmail(
    to: string | string[],
    template: EmailTemplate,
    options?: {
      cc?: string | string[];
      bcc?: string | string[];
      attachments?: Array<{
        filename?: string;
        content?: Buffer | string;
        path?: string;
        contentType?: string;
      }>;
    }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const config = await this.getEmailConfig();

      if (!config.service_enabled) {
        return {
          success: false,
          error: 'Email service is disabled'
        };
      }

      const transporter = await this.createTransporter();

      const mailOptions = {
        from: `${config.from_name} <${config.from_address}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: template.subject,
        html: template.html,
        text: template.text || template.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
        ...options
      };

      const info = await transporter.sendMail(mailOptions);

      console.log('Email sent successfully:', {
        messageId: info.messageId,
        to: mailOptions.to,
        subject: mailOptions.subject
      });

      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Template cho 2FA code
   */
  static create2FATemplate(code: string, userName: string): EmailTemplate {
    return {
      subject: 'MarketCode - Mã xác thực 2FA',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">MarketCode</h1>
            <p style="color: #666; margin-top: 5px;">Mã xác thực hai yếu tố</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Chào ${userName},</h2>
            <p style="color: #666; margin-bottom: 30px;">
              Mã xác thực 2FA của bạn là:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #007bff;">
                ${code}
              </span>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 20px;">
              Mã này có hiệu lực trong <strong>5 phút</strong>.<br>
              Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>MarketCode - Nền tảng chia sẻ source code</p>
            <p>Email này được gửi tự động, vui lòng không phản hồi.</p>
          </div>
        </div>
      `
    };
  }

  /**
   * Template cho welcome email
   */
  static createWelcomeTemplate(userName: string): EmailTemplate {
    return {
      subject: 'Chào mừng bạn đến với MarketCode!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">MarketCode</h1>
            <p style="color: #666; margin-top: 5px;">Nền tảng chia sẻ source code</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Chào mừng ${userName}!</h2>
            <p style="color: #666; margin-bottom: 20px;">
              Cảm ơn bạn đã đăng ký tài khoản MarketCode. Chúng tôi rất vui mừng có bạn trong cộng đồng!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" 
                 style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Bắt đầu khám phá
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>MarketCode Team</p>
            <p>Email: thanhlc.dev@gmail.com</p>
          </div>
        </div>
      `
    };
  }

  /**
   * Template cho password reset
   */
  static createPasswordResetTemplate(userName: string, resetLink: string): EmailTemplate {
    return {
      subject: 'MarketCode - Đặt lại mật khẩu',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">MarketCode</h1>
            <p style="color: #666; margin-top: 5px;">Đặt lại mật khẩu</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Chào ${userName},</h2>
            <p style="color: #666; margin-bottom: 20px;">
              Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Đặt lại mật khẩu
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Link này có hiệu lực trong <strong>1 giờ</strong>.<br>
              Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>MarketCode Team</p>
            <p>Vì lý do bảo mật, link sẽ hết hạn sau 1 giờ.</p>
          </div>
        </div>
      `
    };
  }

  /**
   * Test email connection
   */
  static async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const transporter = await this.createTransporter();
      await transporter.verify();
      return { success: true };
    } catch (error) {
      console.error('Email connection test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  /**
   * Refresh configuration (clear cache)
   */
  static refreshConfig(): void {
    this.config = null;
    this.transporter = null;
  }
}
