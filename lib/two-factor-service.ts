import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';
import { supabaseServiceRole } from '@/lib/supabase-server';
import { EmailService } from './email-service';

export interface TwoFactorSetupResult {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
  manualEntryKey: string;
}

export interface TwoFactorVerifyResult {
  success: boolean;
  error?: string;
}

export interface TwoFactorStatus {
  enabled: boolean;
  lastVerifiedAt?: string;
}

export class TwoFactorService {
  private static readonly CODE_LENGTH = 6;
  
  /**
   * Lấy setting từ database
   */
  private static async getSetting(key: string, defaultValue: string): Promise<string> {
    try {
      const { data, error } = await supabaseServiceRole
        .from('SystemSetting')
        .select('value')
        .eq('key', key)
        .single();

      if (error || !data) {
        return defaultValue;
      }

      return data.value;
    } catch (error) {
      console.error(`Error getting setting ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Lấy setting number từ database
   */
  private static async getNumberSetting(key: string, defaultValue: number): Promise<number> {
    const value = await this.getSetting(key, defaultValue.toString());
    return parseInt(value) || defaultValue;
  }

  /**
   * Lấy setting boolean từ database
   */
  private static async getBooleanSetting(key: string, defaultValue: boolean): Promise<boolean> {
    const value = await this.getSetting(key, defaultValue.toString());
    return value === 'true';
  }
  
  /**
   * Kiểm tra xem 2FA có được bật cho user thông thường không
   */
  static async is2FAEnabledForUsers(): Promise<boolean> {
    return await this.getBooleanSetting('user_2fa_enabled', true);
  }

  /**
   * Kiểm tra xem user có được phép tắt 2FA không
   */
  static async canUserDisable2FA(): Promise<boolean> {
    return await this.getBooleanSetting('user_can_disable_2fa', true);
  }

  /**
   * Kiểm tra xem có bắt buộc 2FA cho admin khi đăng nhập không
   */
  static async requiresLoginTwoFactorForAdmin(): Promise<boolean> {
    return await this.getBooleanSetting('login_require_2fa_for_admin', false);
  }

  /**
   * Kiểm tra xem có bắt buộc 2FA cho user khi đăng nhập không
   */
  static async requiresLoginTwoFactorForUser(): Promise<boolean> {
    return await this.getBooleanSetting('login_require_2fa_for_user', false);
  }

  /**
   * Kiểm tra xem có gửi email setup 2FA không
   */
  static async is2FASetupEmailEnabled(): Promise<boolean> {
    return await this.getBooleanSetting('2fa_setup_email_enabled', true);
  }

  /**
   * Kiểm tra xem 2FA có được bật cho hệ thống không
   */
  static async is2FAEnabledForSystem(): Promise<boolean> {
    try {
      const { data, error } = await supabaseServiceRole
        .from('SystemSetting')
        .select('value')
        .eq('key', 'admin_2fa_enabled')
        .single();

      if (error) {
        console.error('Error checking 2FA system setting:', error);
        return false;
      }

      return data?.value === 'true';
    } catch (error) {
      console.error('Error in is2FAEnabledForSystem:', error);
      return false;
    }
  }

  /**
   * Bật/tắt 2FA cho toàn hệ thống
   */
  static async toggle2FAForSystem(enabled: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabaseServiceRole
        .from('SystemSetting')
        .update({ 
          value: enabled.toString(),
          updatedAt: new Date().toISOString()
        })
        .eq('key', 'admin_2fa_enabled');

      if (error) {
        console.error('Error updating 2FA system setting:', error);
        return { success: false, error: 'Failed to update system setting' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in toggle2FAForSystem:', error);
      return { success: false, error: 'System error occurred' };
    }
  }

  /**
   * Tạo secret key và QR code cho user
   */
  static async setupTwoFactor(userId: string): Promise<TwoFactorSetupResult | null> {
    try {
      // Lấy thông tin user
      const { data: user, error: userError } = await supabaseServiceRole
        .from('User')
        .select('name, email, role')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        console.error('User not found:', userError);
        return null;
      }

      // Chỉ cho phép admin sử dụng 2FA
      if (user.role !== 'ADMIN') {
        console.error('2FA is only available for admin users');
        return null;
      }

      // Lấy issuer name từ settings
      const { data: settingData } = await supabaseServiceRole
        .from('SystemSetting')
        .select('value')
        .eq('key', '2fa_issuer_name')
        .single();

      const issuerName = settingData?.value || 'MarketCode Admin';

      // Tạo secret
      const secret = speakeasy.generateSecret({
        name: `${user.email}`,
        issuer: issuerName,
        length: 32,
      });

      // Tạo backup codes
      const backupCodes = await this.generateBackupCodes();

      // Tạo QR code URL
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

      return {
        secret: secret.base32!,
        qrCodeUrl,
        backupCodes,
        manualEntryKey: secret.base32!
      };
    } catch (error) {
      console.error('Error in setupTwoFactor:', error);
      return null;
    }
  }

  /**
   * Xác nhận và kích hoạt 2FA cho user
   */
  static async enableTwoFactor(
    userId: string, 
    secret: string, 
    token: string,
    backupCodes: string[]
  ): Promise<TwoFactorVerifyResult> {
    try {
      // Verify token
      const windowSize = await this.getNumberSetting('2fa_token_window', 1);
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: windowSize
      });

      if (!verified) {
        return { success: false, error: 'Mã xác thực không chính xác' };
      }

      // Lưu secret và backup codes vào database
      const { error } = await supabaseServiceRole
        .from('User')
        .update({
          twoFactorEnabled: true,
          twoFactorSecret: secret,
          twoFactorBackupCodes: backupCodes,
          lastTwoFactorAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error enabling 2FA:', error);
        return { success: false, error: 'Không thể kích hoạt 2FA' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in enableTwoFactor:', error);
      return { success: false, error: 'Đã xảy ra lỗi khi kích hoạt 2FA' };
    }
  }

  /**
   * Tắt 2FA cho user
   */
  static async disableTwoFactor(userId: string, currentPassword: string): Promise<TwoFactorVerifyResult> {
    try {
      // Verify current password
      const { data: user, error: userError } = await supabaseServiceRole
        .from('User')
        .select('password')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return { success: false, error: 'Không tìm thấy người dùng' };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return { success: false, error: 'Mật khẩu không chính xác' };
      }

      // Disable 2FA
      const { error } = await supabaseServiceRole
        .from('User')
        .update({
          twoFactorEnabled: false,
          twoFactorSecret: null,
          twoFactorBackupCodes: null,
          updatedAt: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error disabling 2FA:', error);
        return { success: false, error: 'Không thể tắt 2FA' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in disableTwoFactor:', error);
      return { success: false, error: 'Đã xảy ra lỗi khi tắt 2FA' };
    }
  }

  /**
   * Xác thực 2FA token
   */
  static async verifyTwoFactor(userId: string, token: string): Promise<TwoFactorVerifyResult> {
    try {
      const { data: user, error: userError } = await supabaseServiceRole
        .from('User')
        .select('twoFactorEnabled, twoFactorSecret, twoFactorBackupCodes')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return { success: false, error: 'Không tìm thấy người dùng' };
      }

      if (!user.twoFactorEnabled || !user.twoFactorSecret) {
        return { success: false, error: '2FA chưa được kích hoạt' };
      }

      // Kiểm tra xem có phải backup code không
      if (user.twoFactorBackupCodes && Array.isArray(user.twoFactorBackupCodes)) {
        const backupCodes = user.twoFactorBackupCodes as string[];
        if (backupCodes.includes(token)) {
          // Xóa backup code đã sử dụng
          const updatedBackupCodes = backupCodes.filter(code => code !== token);
          
          await supabaseServiceRole
            .from('User')
            .update({
              twoFactorBackupCodes: updatedBackupCodes,
              lastTwoFactorAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
            .eq('id', userId);

          return { success: true };
        }
      }

      // Verify TOTP token
      const windowSize = await this.getNumberSetting('2fa_token_window', 1);
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
        window: windowSize
      });

      if (verified) {
        // Cập nhật last verification time
        await supabaseServiceRole
          .from('User')
          .update({
            lastTwoFactorAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          .eq('id', userId);

        return { success: true };
      }

      return { success: false, error: 'Mã xác thực không chính xác' };
    } catch (error) {
      console.error('Error in verifyTwoFactor:', error);
      return { success: false, error: 'Đã xảy ra lỗi khi xác thực' };
    }
  }

  /**
   * Kiểm tra trạng thái 2FA của user
   */
  static async getTwoFactorStatus(userId: string): Promise<TwoFactorStatus | null> {
    try {
      const { data: user, error } = await supabaseServiceRole
        .from('User')
        .select('twoFactorEnabled, lastTwoFactorAt')
        .eq('id', userId)
        .single();

      if (error || !user) {
        console.error('Error getting 2FA status:', error);
        return null;
      }

      return {
        enabled: user.twoFactorEnabled || false,
        lastVerifiedAt: user.lastTwoFactorAt
      };
    } catch (error) {
      console.error('Error in getTwoFactorStatus:', error);
      return null;
    }
  }

  /**
   * Gửi 2FA code qua email (alternative method)
   */
  static async sendTwoFactorCodeByEmail(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: user, error: userError } = await supabaseServiceRole
        .from('User')
        .select('name, email, twoFactorEnabled')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return { success: false, error: 'Không tìm thấy người dùng' };
      }

      if (!user.twoFactorEnabled) {
        return { success: false, error: '2FA chưa được kích hoạt' };
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Lưu code vào database (có thể dùng bảng VerificationCode)
      await supabaseServiceRole
        .from('VerificationCode')
        .insert({
          userId,
          code,
          type: 'EMAIL_VERIFICATION', // hoặc tạo type mới '2FA_EMAIL'
          expiresAt: expiresAt.toISOString()
        });

      // Gửi email
      const template = EmailService.create2FATemplate(code, user.name);
      const result = await EmailService.sendEmail(user.email, template);

      if (!result.success) {
        return { success: false, error: 'Không thể gửi email' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in sendTwoFactorCodeByEmail:', error);
      return { success: false, error: 'Đã xảy ra lỗi khi gửi email' };
    }
  }

  /**
   * Tạo backup codes
   */
  private static async generateBackupCodes(): Promise<string[]> {
    const backupCodesCount = await this.getNumberSetting('2fa_backup_codes_count', 8);
    const codes: string[] = [];
    for (let i = 0; i < backupCodesCount; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Kiểm tra xem user có phải admin và có yêu cầu 2FA không
   */
  static async requiresTwoFactor(userId: string): Promise<boolean> {
    try {
      // Kiểm tra 2FA có được bật hệ thống không
      const systemEnabled = await this.is2FAEnabledForSystem();
      if (!systemEnabled) {
        return false;
      }

      const { data: user, error } = await supabaseServiceRole
        .from('User')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || !user) {
        return false;
      }

      // Chỉ admin mới yêu cầu 2FA
      return user.role === 'ADMIN';
    } catch (error) {
      console.error('Error in requiresTwoFactor:', error);
      return false;
    }
  }

  /**
   * Regenerate backup codes
   */
  static async regenerateBackupCodes(userId: string): Promise<{ success: boolean; codes?: string[]; error?: string }> {
    try {
      const { data: user, error: userError } = await supabaseServiceRole
        .from('User')
        .select('twoFactorEnabled')
        .eq('id', userId)
        .single();

      if (userError || !user || !user.twoFactorEnabled) {
        return { success: false, error: '2FA chưa được kích hoạt' };
      }

      const newBackupCodes = await this.generateBackupCodes();

      const { error } = await supabaseServiceRole
        .from('User')
        .update({
          twoFactorBackupCodes: newBackupCodes,
          updatedAt: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error regenerating backup codes:', error);
        return { success: false, error: 'Không thể tạo mã backup mới' };
      }

      return { success: true, codes: newBackupCodes };
    } catch (error) {
      console.error('Error in regenerateBackupCodes:', error);
      return { success: false, error: 'Đã xảy ra lỗi' };
    }
  }

  /**
   * Setup 2FA cho user thường (không phân biệt role)
   */
  static async setupTwoFactorForUser(userId: string): Promise<TwoFactorSetupResult | null> {
    try {
      // Lấy thông tin user
      const { data: user, error: userError } = await supabaseServiceRole
        .from('User')
        .select('name, email, role')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        console.error('User not found:', userError);
        return null;
      }

      // Lấy issuer name từ settings (fallback cho user)
      const { data: settingData } = await supabaseServiceRole
        .from('SystemSetting')
        .select('value')
        .eq('key', '2fa_issuer_name')
        .single();

      const issuerName = settingData?.value || 'MarketCode';

      // Tạo secret
      const secret = speakeasy.generateSecret({
        name: `${user.email}`,
        issuer: issuerName,
        length: 32,
      });

      // Tạo backup codes
      const backupCodes = await this.generateBackupCodes();

      // Tạo QR code URL
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

      return {
        secret: secret.base32!,
        qrCodeUrl,
        backupCodes,
        manualEntryKey: secret.base32!
      };
    } catch (error) {
      console.error('Error in setupTwoFactorForUser:', error);
      return null;
    }
  }
}
