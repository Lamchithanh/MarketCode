import { useState, useCallback } from "react";

interface UseAuthModeReturn {
  mode: "login" | "register";
  switchMode: (newMode: "login" | "register") => void;
  isTransitioning: boolean;
}

export function useAuthMode(initialMode: "login" | "register" = "login"): UseAuthModeReturn {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const switchMode = useCallback((newMode: "login" | "register") => {
    if (mode === newMode) return;
    
    setIsTransitioning(true);
    
    // Small delay to allow for smooth transition
    setTimeout(() => {
      setMode(newMode);
      setIsTransitioning(false);
    }, 150);
  }, [mode]);

  return {
    mode,
    switchMode,
    isTransitioning,
  };
}
