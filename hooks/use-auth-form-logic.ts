import { useEffect } from "react";
import { useAuthService } from "./use-auth-service";
import { useAuthForm } from "./use-auth-form";
import { useAuthMode } from "./use-auth-mode";
import { AUTH_CONSTANTS } from "@/lib/auth-utils";
import type { LoginFormData, RegisterFormData } from "@/lib/validations/auth";

interface UseAuthFormLogicProps {
  initialMode?: "login" | "register";
  onModeChange?: (mode: "login" | "register") => void;
}

export function useAuthFormLogic({ initialMode, onModeChange }: UseAuthFormLogicProps = {}) {
  const { authState, login, register, clearMessages } = useAuthService();
  const { mode, loginForm, registerForm, switchMode, resetForms } = useAuthForm({
    initialMode,
    onModeChange,
  });
  const { isTransitioning } = useAuthMode(mode);

  // Clear messages when mode changes
  useEffect(() => {
    clearMessages();
  }, [mode, clearMessages]);

  // Auto-switch to login after successful registration
  useEffect(() => {
    if (authState.success && mode === "register") {
      const timer = setTimeout(() => {
        switchMode("login");
        clearMessages();
      }, AUTH_CONSTANTS.AUTO_SWITCH_DELAY);
      return () => clearTimeout(timer);
    }
  }, [authState.success, mode, switchMode, clearMessages]);

  const handleModeSwitch = (newMode: "login" | "register") => {
    if (mode === newMode) return;
    
    clearMessages();
    resetForms();
    switchMode(newMode);
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    await register(data);
  };

  return {
    // State
    mode,
    isTransitioning,
    authState,
    
    // Forms
    loginForm,
    registerForm,
    
    // Actions
    handleModeSwitch,
    onLoginSubmit,
    onRegisterSubmit,
  };
}
