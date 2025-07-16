"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

export function BackToTop() {
  const { isVisible, scrollProgress, scrollToTop } = useScrollProgress({ threshold: 300 });
  const [isScrolledHeader, setIsScrolledHeader] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolledHeader(currentScrollY > 50);
      setScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Chỉ hiển thị floating BackToTop khi header chưa có BackToTop (khi chưa scrolled) 
  // và khi FloatingMenu chưa xuất hiện (scroll < 150px)
  const shouldShowFloating = isVisible && !isScrolledHeader && scrollY < 150;

  const circumference = 2 * Math.PI * 18; // radius = 18
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className={cn(
      "transition-all duration-300 ease-in-out",
      shouldShowFloating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
    )}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
              <div className="relative">
                {/* Progress Circle - Outside */}
                <svg
                  className="absolute inset-0 h-12 w-12 md:h-14 md:w-14 transform -rotate-90"
                  viewBox="0 0 40 40"
                >
                  {/* Background circle */}
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary/20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="text-primary transition-all duration-300 ease-out"
                  />
                </svg>
                
                {/* Button */}
                <Button
                  onClick={scrollToTop}
                  size="icon"
                  className={cn(
                    "h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg",
                    "bg-primary hover:bg-primary/90 text-primary-foreground",
                    "transition-all duration-300 ease-in-out",
                    "hover:scale-105 active:scale-95",
                    "border-2 border-background shadow-md"
                  )}
                >
                  <ArrowUp className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-popover text-popover-foreground">
            <p className="text-sm font-medium">
              Cuộn lên đầu trang • {scrollProgress}%
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
} 