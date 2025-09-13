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
  private static configTimestamp: number = 0;
  private static readonly CONFIG_CACHE_DURATION = 5 * 60 * 1000; // 5 phút cache

  /**
   * Clear cache và force reload cấu hình
   */
  static clearCache() {
    console.log('📧 Clearing email service cache');
    this.config = null;
    this.transporter = null;
    this.configTimestamp = 0;
  }

  /**
   * Kiểm tra xem cache có expired không
   */
  private static isCacheExpired(): boolean {
    return Date.now() - this.configTimestamp > this.CONFIG_CACHE_DURATION;
  }

  /**
   * Lấy cấu hình email từ database với caching
   */
  private static async getEmailConfig(): Promise<EmailConfig> {
    if (this.config && !this.isCacheExpired()) {
      console.log('📧 Using cached email config');
      return this.config;
    }

    console.log('📧 Fetching email config from database...');
    const configStartTime = Date.now();

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

      console.log(`📧 Database config query took: ${Date.now() - configStartTime}ms`);

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
        smtp_password: configObj['email_smtp_password'] || 'hmsb wmkr kjxj wsbx',
        smtp_secure: configObj['email_smtp_secure'] === 'true',
        from_name: configObj['email_from_name'] || 'MarketCode Team',
        from_address: configObj['email_from_address'] || 'thanhlc.dev@gmail.com',
        service_enabled: configObj['email_service_enabled'] !== 'false'
      };

      // Cập nhật cache timestamp  
      this.configTimestamp = Date.now();
      console.log('📧 Email config cached successfully');

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
      console.log('📧 Using cached transporter');
      return this.transporter;
    }

    console.log('📧 Creating new transporter...');
    const transporterStartTime = Date.now();
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
      // Tối ưu performance
      pool: true, // Sử dụng connection pooling
      maxConnections: 5, // Tối đa 5 connections đồng thời
      maxMessages: 100, // Tối đa 100 emails per connection
      rateDelta: 20000, // 20 giây
      rateLimit: 5, // Tối đa 5 emails per rateDelta
      connectionTimeout: 10000, // 10 giây timeout cho connection
      greetingTimeout: 5000, // 5 giây timeout cho greeting
      socketTimeout: 30000, // 30 giây timeout cho socket
    });

    console.log(`📧 Transporter created in: ${Date.now() - transporterStartTime}ms`);
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
    const sendStartTime = Date.now();
    console.log('📧 Starting email send process...');
    
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

      console.log('📧 Sending email via SMTP...');
      const smtpStartTime = Date.now();
      const info = await transporter.sendMail(mailOptions);
      console.log(`📧 SMTP send took: ${Date.now() - smtpStartTime}ms`);

      console.log(`📧 Total email send process took: ${Date.now() - sendStartTime}ms`);
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
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
            <h1 style="color: #1f2937; margin: 0; font-size: 24px; font-weight: 600;">MarketCode</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Mã xác thực hai yếu tố</p>
          </div>
          
          <!-- Main Content -->
          <div style="background: #ffffff; padding: 30px; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb; border-left: 4px solid #2563eb;">
            <div style="margin-bottom: 20px;">
              <div style="width: 48px; height: 48px; background: #2563eb; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="color: #ffffff; font-size: 24px;">🔐</span>
              </div>
              <h2 style="color: #1f2937; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">Chào ${userName}</h2>
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                Mã xác thực 2FA của bạn là:
              </p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; font-family: monospace;">
                ${code}
              </span>
            </div>
            
            <div style="background: #f9fafb; padding: 16px; border-radius: 6px; margin-top: 20px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5;">
                Mã này có hiệu lực trong <strong style="color: #1f2937;">5 phút</strong><br>
                Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              MarketCode - Nền tảng chia sẻ source code<br>
              Email này được gửi tự động, vui lòng không phản hồi
            </p>
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
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
            <h1 style="color: #1f2937; margin: 0; font-size: 24px; font-weight: 600;">MarketCode</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Nền tảng chia sẻ source code</p>
          </div>
          
          <!-- Welcome Message -->
          <div style="background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb; border-left: 4px solid #2563eb;">
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="width: 56px; height: 56px; background: #2563eb; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 28px;">✓</span>
              </div>
              <h2 style="color: #1f2937; margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">Chào mừng ${userName}!</h2>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <p style="color: #1f2937; margin: 0; line-height: 1.6; text-align: center;">
                Cảm ơn bạn đã đăng ký tài khoản MarketCode<br>
                Chúng tôi rất vui mừng có bạn trong cộng đồng!
              </p>
            </div>
            
            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" 
                 style="background: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Bắt đầu khám phá
              </a>
            </div>
            
            <div style="text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              MarketCode Team<br>
              Email: thanhlc.dev@gmail.com
            </p>
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
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #ffffff;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid hsl(var(--border, 0 0% 89.8%));">
            <h1 style="color: hsl(var(--foreground, 0 0% 3.9%)); margin: 0; font-size: 24px; font-weight: 600;">MarketCode</h1>
            <p style="color: hsl(var(--muted-foreground, 0 0% 45.1%)); margin: 5px 0 0 0; font-size: 14px;">Đặt lại mật khẩu</p>
          </div>
          
          <!-- Main Content -->
          <div style="background: hsl(var(--card, 0 0% 100%)); padding: 30px; border-radius: 8px; border: 1px solid hsl(var(--border)); border-left: 4px solid #ef4444;">
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px;">🔑</span>
              </div>
              <h2 style="color: hsl(var(--foreground)); margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">Chào ${userName}</h2>
            </div>
            
            <div style="background: hsl(var(--muted, 0 0% 96.1%)); padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <p style="color: hsl(var(--foreground)); margin: 0; line-height: 1.6; text-align: center;">
                🔐 Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                🔓 Đặt lại mật khẩu
              </a>
            </div>
            
            <div style="background: #fef2f2; padding: 16px; border-radius: 6px; border-left: 3px solid #ef4444;">
              <p style="color: hsl(var(--muted-foreground)); font-size: 12px; margin: 0; line-height: 1.5;">
                ⏰ Link này có hiệu lực trong <strong style="color: hsl(var(--foreground));">1 giờ</strong><br>
                🛡️ Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid hsl(var(--border));">
            <p style="color: hsl(var(--muted-foreground)); font-size: 12px; margin: 0;">
              MarketCode Team<br>
              🔒 Vì lý do bảo mật, link sẽ hết hạn sau 1 giờ
            </p>
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
