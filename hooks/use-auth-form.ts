import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from "@/lib/validations/auth";

interface UseAuthFormProps {
  initialMode?: "login" | "register";
  onModeChange?: (mode: "login" | "register") => void;
}

interface UseAuthFormReturn {
  mode: "login" | "register";
  loginForm: ReturnType<typeof useForm<LoginFormData>>;
  registerForm: ReturnType<typeof useForm<RegisterFormData>>;
  switchMode: (newMode: "login" | "register") => void;
  resetForms: () => void;
}

export function useAuthForm({ 
  initialMode = "login", 
  onModeChange 
}: UseAuthFormProps = {}): UseAuthFormReturn {
  const pathname = usePathname();
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // Initialize forms
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Update mode based on pathname or prop (only on initial load)
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    } else if (pathname.includes("/register")) {
      setMode("register");
    } else if (pathname.includes("/login")) {
      setMode("login");
    }
  }, [initialMode, pathname]);

  const switchMode = useCallback((newMode: "login" | "register") => {
    if (mode === newMode) return;
    
    setMode(newMode);
    
    // Reset forms when switching modes
    loginForm.reset();
    registerForm.reset();
    
    if (onModeChange) {
      onModeChange(newMode);
    }
  }, [mode, onModeChange, loginForm, registerForm]);

  const resetForms = useCallback(() => {
    loginForm.reset();
    registerForm.reset();
  }, [loginForm, registerForm]);

  return {
    mode,
    loginForm,
    registerForm,
    switchMode,
    resetForms,
  };
}
