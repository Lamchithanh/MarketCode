import { supabase, supabaseAdmin } from "./supabase";
import { CacheService } from "./cache";
import { DatabasePerformanceMonitor } from "./performance-monitor";
import bcrypt from "bcryptjs";
import type { LoginFormData, RegisterFormData } from "@/lib/validations/auth";

export interface AuthResult<T = unknown> {
  success: boolean;
  data?: T;
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

export class OptimizedAuthService {
  /**
   * Register a new user with performance monitoring
   */
  static async register(data: RegisterFormData): Promise<AuthResult> {
    return DatabasePerformanceMonitor.monitorQuery('user_register', async () => {
      try {
        // Check if user already exists (with caching)
        const existingUser = await this.checkUserExists(data.email);
        if (existingUser) {
          return {
            success: false,
            error: "Email đã được sử dụng bởi tài khoản khác",
          };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 12);

        // Create user with optimized query
        const { data: newUser, error: createError } = await supabase
          .from("User")
          .insert({
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            password: hashedPassword,
            role: "USER",
            isActive: true,
          })
          .select("id, name, email, role, avatar, isActive, emailVerified, createdAt")
          .single();

        if (createError) {
          console.error("User creation error:", createError);
          return {
            success: false,
            error: "Không thể tạo tài khoản. Vui lòng thử lại.",
          };
        }

        // Cache the new user
        await CacheService.cacheUser(newUser.id, newUser);

        return {
          success: true,
          data: newUser,
        };
      } catch (error) {
        console.error("Registration error:", error);
        return {
          success: false,
          error: "Đã xảy ra lỗi khi đăng ký",
        };
      }
    });
  }

  /**
   * Authenticate user login with caching
   */
  static async login(data: LoginFormData): Promise<AuthResult> {
    return DatabasePerformanceMonitor.monitorQuery('user_login', async () => {
      try {
        // Try cache first
        const cacheKey = `user_by_email:${data.email}`;
        let user = await CacheService.get<UserData & { password: string }>(cacheKey);

        if (!user) {
          // Database query with optimized field selection
          const { data: dbUser, error: findError } = await supabase
            .from("User")
            .select("id, name, email, password, role, avatar, isActive, lastLoginAt, emailVerified, createdAt")
            .eq("email", data.email)
            .eq("isActive", true)
            .single();

          if (findError || !dbUser) {
            return {
              success: false,
              error: "Email hoặc mật khẩu không chính xác",
            };
          }

          user = dbUser;
          
          // Cache user data (without password)
          const { password, ...userWithoutPassword } = user;
          await CacheService.set(cacheKey, userWithoutPassword, 1000 * 60 * 5); // 5 minutes
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
          return {
            success: false,
            error: "Email hoặc mật khẩu không chính xác",
          };
        }

        // Update last login (async, don't wait)
        this.updateLastLogin(user.id).catch(console.error);

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
    });
  }

  /**
   * Get user by ID with caching
   */
  static async getUserById(userId: string): Promise<AuthResult> {
    return DatabasePerformanceMonitor.monitorQuery('get_user_by_id', async () => {
      try {
        // Try cache first
        const cachedUser = await CacheService.get(`user:${userId}`);
        if (cachedUser) {
          return { success: true, data: cachedUser };
        }

        // Database query with optimized field selection
        const { data: user, error } = await supabase
          .from("User")
          .select("id, name, email, role, avatar, isActive, emailVerified, createdAt, lastLoginAt")
          .eq("id", userId)
          .eq("isActive", true)
          .single();

        if (error || !user) {
          return {
            success: false,
            error: "Không tìm thấy người dùng",
          };
        }

        // Cache the user
        await CacheService.cacheUser(userId, user);

        return {
          success: true,
          data: user,
        };
      } catch (error) {
        console.error("Get user error:", error);
        return {
          success: false,
          error: "Không thể lấy thông tin người dùng",
        };
      }
    });
  }

  /**
   * Update user profile with cache invalidation
   */
  static async updateProfile(
    userId: string,
    updates: Partial<Pick<UserData, "name" | "avatar">>
  ): Promise<AuthResult> {
    return DatabasePerformanceMonitor.monitorQuery('update_user_profile', async () => {
      try {
        const { data: updatedUser, error } = await supabase
          .from("User")
          .update({
            ...updates,
            updatedAt: new Date().toISOString(),
          })
          .eq("id", userId)
          .select("id, name, email, role, avatar, isActive, emailVerified, createdAt, lastLoginAt")
          .single();

        if (error) {
          console.error("Profile update error:", error);
          return {
            success: false,
            error: "Không thể cập nhật thông tin",
          };
        }

        // Invalidate and update cache
        await CacheService.invalidateUserCache(userId);
        await CacheService.cacheUser(userId, updatedUser);

        return {
          success: true,
          data: updatedUser,
        };
      } catch (error) {
        console.error("Profile update error:", error);
        return {
          success: false,
          error: "Đã xảy ra lỗi khi cập nhật thông tin",
        };
      }
    });
  }

  /**
   * Change user password with cache invalidation
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<AuthResult> {
    return DatabasePerformanceMonitor.monitorQuery('change_user_password', async () => {
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

        // Invalidate cache
        await CacheService.invalidateUserCache(userId);

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
    });
  }

  /**
   * Check if user exists (with caching)
   */
  private static async checkUserExists(email: string): Promise<boolean> {
    const cacheKey = `user_exists:${email}`;
    
    // Try cache first
    const cached = await CacheService.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    // Database query
    const { data: existingUser, error: checkError } = await supabase
      .from("User")
      .select("id")
      .eq("email", email)
      .single();

    const exists = existingUser !== null && !checkError;
    
    // Cache the result (negative caching for non-existent users)
    await CacheService.set(cacheKey, exists, 1000 * 60 * 10); // 10 minutes
    
    return exists;
  }

  /**
   * Update last login timestamp (async)
   */
  private static async updateLastLogin(userId: string): Promise<void> {
    try {
      await supabase
        .from("User")
        .update({ lastLoginAt: new Date().toISOString() })
        .eq("id", userId);
    } catch (error) {
      console.error("Failed to update last login:", error);
    }
  }

  /**
   * Bulk get users with caching
   */
  static async getUsersByIds(userIds: string[]): Promise<Record<string, UserData>> {
    return DatabasePerformanceMonitor.monitorQuery('bulk_get_users', async () => {
      const result: Record<string, UserData> = {};
      const uncachedIds: string[] = [];

      // Check cache first
      for (const userId of userIds) {
        const cached = await CacheService.get<UserData>(`user:${userId}`);
        if (cached) {
          result[userId] = cached;
        } else {
          uncachedIds.push(userId);
        }
      }

      // Fetch uncached users
      if (uncachedIds.length > 0) {
        const { data: users, error } = await supabase
          .from("User")
          .select("id, name, email, role, avatar, isActive, emailVerified, createdAt, lastLoginAt")
          .in("id", uncachedIds)
          .eq("isActive", true);

        if (!error && users) {
          for (const user of users) {
            result[user.id] = user;
            // Cache each user
            await CacheService.cacheUser(user.id, user);
          }
        }
      }

      return result;
    });
  }

  /**
   * Search users with caching
   */
  static async searchUsers(query: string, limit: number = 10): Promise<AuthResult> {
    return DatabasePerformanceMonitor.monitorQuery('search_users', async () => {
      try {
        // Try cache first
        const cacheKey = `user_search:${query}:${limit}`;
        const cached = await CacheService.get(cacheKey);
        if (cached) {
          return { success: true, data: cached };
        }

        // Database search
        const { data: users, error } = await supabase
          .from("User")
          .select("id, name, email, role, avatar, isActive, createdAt")
          .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
          .eq("isActive", true)
          .limit(limit)
          .order("createdAt", { ascending: false });

        if (error) {
          return {
            success: false,
            error: "Không thể tìm kiếm người dùng",
          };
        }

        // Cache search results
        await CacheService.set(cacheKey, users, 1000 * 60 * 5); // 5 minutes

        return {
          success: true,
          data: users,
        };
      } catch (error) {
        console.error("User search error:", error);
        return {
          success: false,
          error: "Đã xảy ra lỗi khi tìm kiếm",
        };
      }
    });
  }

  /**
   * Get cache statistics
   */
  static getCacheStats() {
    return CacheService.getStats();
  }

  /**
   * Clear user cache
   */
  static async clearUserCache(userId: string): Promise<void> {
    await CacheService.invalidateUserCache(userId);
  }

  /**
   * Clear all auth cache
   */
  static async clearAllCache(): Promise<void> {
    await CacheService.clear();
  }
}
