"use client";

import { motion } from "framer-motion";

interface ModeSwitcherProps {
  mode: "login" | "register";
  onModeSwitch: (newMode: "login" | "register") => void;
  isTransitioning: boolean;
}

export function ModeSwitcher({ mode, onModeSwitch, isTransitioning }: ModeSwitcherProps) {
  return (
    <div className="flex mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-sm">
      <button
        type="button"
        className={`flex-1 relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          mode === "login" 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
        }`}
        onClick={() => onModeSwitch("login")}
        disabled={isTransitioning}
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
        onClick={() => onModeSwitch("register")}
        disabled={isTransitioning}
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
  );
}
