import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthService, type AuthResult, type UserData } from "@/lib/auth-service";
import type { LoginFormData, RegisterFormData } from "@/lib/validations/auth";
import { toast, toastMessages } from "@/components/ui/toast";

interface AuthState {
  user: UserData | null;
  error: string;
  success: string;
  isLoading: boolean;
}

interface UseAuthServiceReturn {
  authState: AuthState;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  getUser: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<Pick<UserData, "name" | "avatar">>) => Promise<void>;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (email: string, resetToken: string, newPassword: string) => Promise<void>;
  clearMessages: () => void;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
}

export function useAuthService(): UseAuthServiceReturn {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    error: "",
    success: "",
    isLoading: false,
  });

  const setError = useCallback((error: string) => {
    setAuthState(prev => ({ ...prev, error, success: "" }));
  }, []);

  const setSuccess = useCallback((success: string) => {
    setAuthState(prev => ({ ...prev, success, error: "" }));
  }, []);

  const clearMessages = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: "", success: "" }));
  }, []);

  const login = useCallback(async (data: LoginFormData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: "" }));
      
      const result: AuthResult = await AuthService.login(data);

      if (!result.success) {
        const errorMessage = result.error || "Đăng nhập thất bại";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      // Store user data in state
      setAuthState(prev => ({ 
        ...prev, 
        user: result.data, 
        success: "Đăng nhập thành công!",
        isLoading: false 
      }));

      // Show success toast
      toast.success(toastMessages.auth.loginSuccess);

      // Redirect to home page
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = "Đã xảy ra lỗi khi đăng nhập";
      setError(errorMessage);
      toast.error(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [router, setError, setSuccess]);

  const register = useCallback(async (data: RegisterFormData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: "", success: "" }));

      const result: AuthResult = await AuthService.register(data);

      if (!result.success) {
        const errorMessage = result.error || "Đăng ký thất bại";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const successMessage = "Tài khoản đã được tạo thành công!";
      setSuccess(successMessage);
      toast.success(successMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = "Đã xảy ra lỗi khi đăng ký";
      setError(errorMessage);
      toast.error(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [setError, setSuccess]);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      error: "",
      success: "",
      isLoading: false,
    });
    router.push("/login");
  }, [router]);

  const getUser = useCallback(async (userId: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: "" }));
      
      const result: AuthResult = await AuthService.getUserById(userId);

      if (!result.success) {
        setError(result.error || "Không thể lấy thông tin người dùng");
        return;
      }

      setAuthState(prev => ({ 
        ...prev, 
        user: result.data, 
        isLoading: false 
      }));
    } catch (error) {
      console.error("Get user error:", error);
      setError("Đã xảy ra lỗi khi lấy thông tin người dùng");
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [setError]);

  const updateProfile = useCallback(async (
    userId: string, 
    updates: Partial<Pick<UserData, "name" | "avatar">>
  ) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: "" }));
      
      const result: AuthResult = await AuthService.updateProfile(userId, updates);

      if (!result.success) {
        const errorMessage = result.error || "Không thể cập nhật thông tin";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const successMessage = "Thông tin đã được cập nhật thành công!";
      setAuthState(prev => ({ 
        ...prev, 
        user: result.data, 
        success: successMessage,
        isLoading: false 
      }));
      toast.success(successMessage);
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage = "Đã xảy ra lỗi khi cập nhật thông tin";
      setError(errorMessage);
      toast.error(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [setError, setSuccess]);

  const changePassword = useCallback(async (
    userId: string, 
    currentPassword: string, 
    newPassword: string
  ) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: "" }));
      
      const result: AuthResult = await AuthService.changePassword(userId, currentPassword, newPassword);

      if (!result.success) {
        const errorMessage = result.error || "Không thể thay đổi mật khẩu";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const successMessage = "Mật khẩu đã được thay đổi thành công!";
      setSuccess(successMessage);
      toast.success(successMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error("Change password error:", error);
      const errorMessage = "Đã xảy ra lỗi khi thay đổi mật khẩu";
      setError(errorMessage);
      toast.error(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [setError, setSuccess]);

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: "" }));
      
      const result: AuthResult = await AuthService.requestPasswordReset(email);

      if (!result.success) {
        setError(result.error || "Không thể yêu cầu đặt lại mật khẩu");
        return;
      }

      setSuccess(result.data?.message || "Yêu cầu đặt lại mật khẩu đã được gửi");
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error("Password reset request error:", error);
      setError("Đã xảy ra lỗi khi yêu cầu đặt lại mật khẩu");
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [setError, setSuccess]);

  const resetPassword = useCallback(async (
    email: string, 
    resetToken: string, 
    newPassword: string
  ) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: "" }));
      
      const result: AuthResult = await AuthService.resetPassword(email, resetToken, newPassword);

      if (!result.success) {
        setError(result.error || "Không thể đặt lại mật khẩu");
        return;
      }

      setSuccess("Mật khẩu đã được đặt lại thành công!");
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Đã xảy ra lỗi khi đặt lại mật khẩu");
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [setError, setSuccess]);

  return {
    authState,
    login,
    register,
    logout,
    getUser,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    clearMessages,
    setError,
    setSuccess,
  };
}
