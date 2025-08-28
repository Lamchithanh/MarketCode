"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

interface AuthFormProps {
  mode?: "login" | "register";
  onModeChange?: (mode: "login" | "register") => void;
}

export function AuthForm({ mode: propMode, onModeChange }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">(propMode || "login");

  // Update mode based on prop
  useEffect(() => {
    if (propMode) {
      setMode(propMode);
    }
  }, [propMode]);

  const handleModeSwitch = (newMode: "login" | "register") => {
    // Prevent double clicks
    if (mode === newMode) return;
    
    setMode(newMode);
    
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  const handleRegisterSuccess = () => {
    handleModeSwitch("login");
  };

  const formVariants = {
    enter: { 
      x: 0, 
      opacity: 1
    },
    exit: { 
      x: mode === "login" ? -50 : 50, 
      opacity: 0
    },
    initial: { 
      x: mode === "login" ? 50 : -50, 
      opacity: 0 
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Mode Switch Buttons */}
      <div className="flex mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-sm">
        <button
          type="button"
          className={`flex-1 relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            mode === "login" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
          }`}
          onClick={() => handleModeSwitch("login")}
        >
          {mode === "login" && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-primary rounded-lg"
              initial={false}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          )}
          <span className="relative z-10">Đăng nhập</span>
        </button>
        <button
          type="button"
          className={`flex-1 relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            mode === "register" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
          }`}
          onClick={() => handleModeSwitch("register")}
        >
          {mode === "register" && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-primary rounded-lg"
              initial={false}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          )}
          <span className="relative z-10">Đăng ký</span>
        </button>
      </div>

      {/* Form Container */}
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
                <LoginForm />
              ) : (
                <RegisterForm onSuccess={handleRegisterSuccess} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
