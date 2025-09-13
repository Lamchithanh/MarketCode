import { supabase, supabaseAdmin } from "./supabase";
import bcrypt from "bcryptjs";
import type { LoginFormData, RegisterFormData } from "@/lib/validations/auth";

export interface AuthResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  avatar?: string;
  isActive: boolean;
  emailVerified?: string;
  createdAt: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterFormData): Promise<AuthResult> {
    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("User")
        .select("id")
        .eq("email", data.email)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: "Email đã được sử dụng bởi tài khoản khác",
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create user
      const { data: newUser, error: createError } = await supabase
        .from("User")
        .insert({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: hashedPassword,
          role: "USER",
          isActive: true,
        })
        .select()
        .single();

      if (createError) {
        console.error("User creation error:", createError);
        return {
          success: false,
          error: "Không thể tạo tài khoản. Vui lòng thử lại.",
        };
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;

      return {
        success: true,
        data: userWithoutPassword,
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: "Đã xảy ra lỗi khi đăng ký",
      };
    }
  }

  /**
   * Authenticate user login
   */
  static async login(data: LoginFormData): Promise<AuthResult> {
    try {
      // Find user by email
      const { data: user, error: findError } = await supabase
        .from("User")
        .select("*")
        .eq("email", data.email)
        .eq("isActive", true)
        .single();

      if (findError || !user) {
        return {
          success: false,
          error: "Email hoặc mật khẩu không chính xác",
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: "Email hoặc mật khẩu không chính xác",
        };
      }

      // Update last login
      await supabase
        .from("User")
        .update({ lastLoginAt: new Date().toISOString() })
        .eq("id", user.id);

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        data: userWithoutPassword,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Đã xảy ra lỗi khi đăng nhập",
      };
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<AuthResult> {
    try {
      const { data: user, error } = await supabase
        .from("User")
        .select("*")
        .eq("id", userId)
        .eq("isActive", true)
        .single();

      if (error || !user) {
        return {
          success: false,
          error: "Không tìm thấy người dùng",
        };
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        data: userWithoutPassword,
      };
    } catch (error) {
      console.error("Get user error:", error);
      return {
        success: false,
        error: "Không thể lấy thông tin người dùng",
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updates: Partial<Pick<UserData, "name" | "avatar">>
  ): Promise<AuthResult> {
    try {
      const { data: updatedUser, error } = await supabase
        .from("User")
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Profile update error:", error);
        return {
          success: false,
          error: "Không thể cập nhật thông tin",
        };
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;

      return {
        success: true,
        data: userWithoutPassword,
      };
    } catch (error) {
      console.error("Profile update error:", error);
      return {
        success: false,
        error: "Đã xảy ra lỗi khi cập nhật thông tin",
      };
    }
  }

  /**
   * Change user password
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<AuthResult> {
    try {
      // Get current user to verify password
      const { data: user, error: findError } = await supabase
        .from("User")
        .select("password")
        .eq("id", userId)
        .single();

      if (findError || !user) {
        return {
          success: false,
          error: "Không tìm thấy người dùng",
        };
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          error: "Mật khẩu hiện tại không chính xác",
        };
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      const { error: updateError } = await supabase
        .from("User")
        .update({
          password: hashedNewPassword,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Password update error:", updateError);
        return {
          success: false,
          error: "Không thể thay đổi mật khẩu",
        };
      }

      return {
        success: true,
        data: { message: "Mật khẩu đã được thay đổi thành công" },
      };
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        error: "Đã xảy ra lỗi khi thay đổi mật khẩu",
      };
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<AuthResult> {
    try {
      // Check if user exists
      const { data: user, error: findError } = await supabase
        .from("User")
        .select("id, name")
        .eq("email", email)
        .eq("isActive", true)
        .single();

      if (findError || !user) {
        // Don't reveal if email exists or not for security
        return {
          success: true,
          data: { message: "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu" },
        };
      }

      // Generate reset token (you can implement your own token generation logic)
      const resetToken = await this.generateResetToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store reset token in VerificationCode table
      const { error: tokenError } = await supabase
        .from("VerificationCode")
        .insert({
          userId: user.id,
          code: resetToken,
          type: "PASSWORD_RESET",
          expiresAt: expiresAt.toISOString(),
        });

      if (tokenError) {
        console.error("Token creation error:", tokenError);
        return {
          success: false,
          error: "Không thể tạo mã đặt lại mật khẩu",
        };
      }

      // TODO: Send email with reset token
      // For now, just return success
      return {
        success: true,
        data: { message: "Mã đặt lại mật khẩu đã được gửi đến email của bạn" },
      };
    } catch (error) {
      console.error("Password reset request error:", error);
      return {
        success: false,
        error: "Đã xảy ra lỗi khi yêu cầu đặt lại mật khẩu",
      };
    }
  }

  /**
   * Generate a random reset token
   */
  private static async generateResetToken(): Promise<string> {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Verify email verification code
   */
  static async verifyEmail(
    userId: string,
    verificationCode: string
  ): Promise<AuthResult> {
    try {
      // Find verification code
      const { data: code, error: findError } = await supabase
        .from("VerificationCode")
        .select("*")
        .eq("userId", userId)
        .eq("code", verificationCode)
        .eq("type", "EMAIL_VERIFICATION")
        .gte("expiresAt", new Date().toISOString())
        .single();

      if (findError || !code) {
        return {
          success: false,
          error: "Mã xác thực không hợp lệ hoặc đã hết hạn",
        };
      }

      // Update user email verification status
      const { error: updateError } = await supabase
        .from("User")
        .update({
          emailVerified: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Email verification error:", updateError);
        return {
          success: false,
          error: "Không thể xác thực email",
        };
      }

      // Delete used verification code
      await supabase
        .from("VerificationCode")
        .delete()
        .eq("id", code.id);

      return {
        success: true,
        data: { message: "Email đã được xác thực thành công" },
      };
    } catch (error) {
      console.error("Email verification error:", error);
      return {
        success: false,
        error: "Đã xảy ra lỗi khi xác thực email",
      };
    }
  }

  /**
   * Deactivate user account
   */
  static async deactivateAccount(userId: string): Promise<AuthResult> {
    try {
      const { error } = await supabase
        .from("User")
        .update({
          isActive: false,
          deletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Account deactivation error:", error);
        return {
          success: false,
          error: "Không thể vô hiệu hóa tài khoản",
        };
      }

      return {
        success: true,
        data: { message: "Tài khoản đã được vô hiệu hóa" },
      };
    } catch (error) {
      console.error("Account deactivation error:", error);
      return {
        success: false,
        error: "Đã xảy ra lỗi khi vô hiệu hóa tài khoản",
      };
    }
  }
}
