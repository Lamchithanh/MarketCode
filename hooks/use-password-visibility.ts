import { useState, useCallback } from "react";

interface PasswordVisibilityState {
  password: boolean;
  confirmPassword: boolean;
}

interface UsePasswordVisibilityReturn {
  visibility: PasswordVisibilityState;
  togglePassword: () => void;
  toggleConfirmPassword: () => void;
  showPassword: (field: keyof PasswordVisibilityState) => boolean;
}

export function usePasswordVisibility(): UsePasswordVisibilityReturn {
  const [visibility, setVisibility] = useState<PasswordVisibilityState>({
    password: false,
    confirmPassword: false,
  });

  const togglePassword = useCallback(() => {
    setVisibility(prev => ({ ...prev, password: !prev.password }));
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setVisibility(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }));
  }, []);

  const showPassword = useCallback((field: keyof PasswordVisibilityState) => {
    return visibility[field];
  }, [visibility]);

  return {
    visibility,
    togglePassword,
    toggleConfirmPassword,
    showPassword,
  };
}
