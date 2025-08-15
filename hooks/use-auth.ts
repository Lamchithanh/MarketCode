import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { LoginFormData, RegisterFormData } from "@/lib/validations/auth";
import { toast, toastMessages } from "@/components/ui/toast";

interface AuthState {
  error: string;
  success: string;
  isLoading: boolean;
}

interface UseAuthReturn {
  authState: AuthState;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  clearMessages: () => void;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
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
      
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        const errorMessage = "Email hoặc mật khẩu không chính xác";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      if (result?.ok) {
        const successMessage = "Đăng nhập thành công!";
        setSuccess(successMessage);
        toast.success(toastMessages.auth.loginSuccess);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = "Đã xảy ra lỗi khi đăng nhập";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [router, setError, setSuccess]);

  const register = useCallback(async (data: RegisterFormData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: "", success: "" }));

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || "Đã xảy ra lỗi khi đăng ký";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const successMessage = "Tài khoản đã được tạo thành công!";
      setSuccess(successMessage);
      toast.success(successMessage);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = "Đã xảy ra lỗi khi đăng ký";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [setError, setSuccess]);

  return {
    authState,
    login,
    register,
    clearMessages,
    setError,
    setSuccess,
  };
}
