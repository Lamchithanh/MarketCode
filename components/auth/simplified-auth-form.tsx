"use client";

import { ModeSwitcher } from "./mode-switcher";
import { FormContainer } from "./form-container";
import { useAuthFormLogic } from "@/hooks/use-auth-form-logic";

interface SimplifiedAuthFormProps {
  mode?: "login" | "register";
  onModeChange?: (mode: "login" | "register") => void;
}

export function SimplifiedAuthForm({ mode: propMode, onModeChange }: SimplifiedAuthFormProps) {
  const {
    mode,
    isTransitioning,
    authState,
    loginForm,
    registerForm,
    handleModeSwitch,
    onLoginSubmit,
    onRegisterSubmit,
  } = useAuthFormLogic({
    initialMode: propMode,
    onModeChange,
  });

  return (
    <div className="relative w-full max-w-md">
      <ModeSwitcher
        mode={mode}
        onModeSwitch={handleModeSwitch}
        isTransitioning={isTransitioning}
      />
      
      <FormContainer
        mode={mode}
        loginForm={loginForm}
        registerForm={registerForm}
        onLoginSubmit={onLoginSubmit}
        onRegisterSubmit={onRegisterSubmit}
        isLoading={authState.isLoading}
        error={authState.error}
        success={authState.success}
      />
    </div>
  );
}
