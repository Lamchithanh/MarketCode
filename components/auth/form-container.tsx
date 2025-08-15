"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import type { UseFormReturn } from "react-hook-form";
import type { LoginFormData, RegisterFormData } from "@/lib/validations/auth";

interface FormContainerProps {
  mode: "login" | "register";
  loginForm: UseFormReturn<LoginFormData>;
  registerForm: UseFormReturn<RegisterFormData>;
  onLoginSubmit: (data: LoginFormData) => Promise<void>;
  onRegisterSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  error?: string;
  success?: string;
}

export function FormContainer({
  mode,
  loginForm,
  registerForm,
  onLoginSubmit,
  onRegisterSubmit,
  isLoading,
  error,
  success,
}: FormContainerProps) {
  const formVariants = {
    enter: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: { 
      x: mode === "login" ? -50 : 50, 
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    initial: { 
      x: mode === "login" ? 50 : -50, 
      opacity: 0 
    }
  };

  return (
    <Card className="overflow-hidden bg-white/95 backdrop-blur-sm shadow-xl border-0">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={formVariants}
            initial="initial" 
            animate="enter"
            exit="exit"
          >
            {mode === "login" ? (
              <LoginForm
                form={loginForm}
                onSubmit={onLoginSubmit}
                isLoading={isLoading}
                error={error}
                success={success}
              />
            ) : (
              <RegisterForm
                form={registerForm}
                onSubmit={onRegisterSubmit}
                isLoading={isLoading}
                error={error}
                success={success}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}
