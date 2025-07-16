"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, User, Package, FileText, Mail, ChevronUp, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

/**
 * FLOATING MENU COMPONENT
 * ========================
 * 
 * Menu nhỏ gọn xuất hiện khi scroll thay thế header sticky.
 * Thiết kế theo ý tưởng floating sidebar với icons.
 * 
 * FEATURES:
 * - Xuất hiện khi scroll > 150px
 * - Floating position fixed bên trái
 * - Icon navigation với tooltips
 * - Cart badge indicator
 * - Scroll to top button
 * - Glassmorphism design
 * - Responsive: ẩn trên mobile nhỏ
 * - Smooth animations
 */

interface FloatingMenuProps {
  className?: string;
}

export const FloatingMenu = ({ className }: FloatingMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Enhanced scroll detection
  useEffect(() => {
    let lastScrollY = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          
          // Show menu after scrolling down 150px
          const shouldShow = scrollY > 150;
          setIsVisible(shouldShow);
          
          // Track scroll direction for subtle animations
          setIsScrollingUp(scrollY < lastScrollY);
          lastScrollY = scrollY;
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items with icons
  const navigationItems = [
    { name: "Home", path: "/", icon: Home, label: "Trang chủ" },
    { name: "Products", path: "/products", icon: Package, label: "Sản phẩm" },
    { name: "About", path: "/about", icon: FileText, label: "Về chúng tôi" },
    { name: "Contact", path: "/contact", icon: Mail, label: "Liên hệ" },
    { name: "Profile", path: "/profile", icon: User, label: "Tài khoản" },
  ];

  const isActive = (path: string) => pathname === path;

  // Handle navigation
  const handleNavigation = (path: string) => {
    // Close tooltip when navigating
    setShowTooltip(null);
  };

  // Scroll to top với smooth animation
  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
    setShowTooltip(null);
  };

  // Hide tooltip when mouse leaves the entire menu
  const handleMenuLeave = () => {
    setShowTooltip(null);
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed left-4 top-1/2 -translate-y-1/2 z-[100] transition-all duration-700 ease-out",
      // Responsive: hide on very small screens
      "hidden sm:block",
      // Animation states
      isVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-full scale-95",
      // Subtle scroll direction effect
      isScrollingUp ? "transform-gpu" : "",
      // Force fixed positioning
      "!fixed !z-[100]",
      className
    )}
    onMouseLeave={handleMenuLeave}
    style={{ 
      position: 'fixed', 
      zIndex: 100, 
      willChange: 'transform, opacity',
      isolation: 'isolate',
      pointerEvents: 'auto'
    }}
    >
      {/* Floating Menu Container */}
      <div className={cn(
        "flex flex-col space-y-1.5 p-2.5 transition-all duration-300",
        "bg-card/80 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl",
        "hover:bg-card/90 hover:border-border/60",
        // Subtle glow effect
        "hover:shadow-2xl"
      )}>
        {/* Logo Icon */}
        <div className="flex items-center justify-center mb-1.5 pb-1.5 border-b border-border/40">
          <Link href="/" onClick={() => handleNavigation("/")} className="block">
            <button className={cn(
              "w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xs",
              "hover:scale-110 active:scale-95 transition-all duration-200",
              "shadow-lg hover:shadow-primary/20"
            )}>
              <Code className="h-4 w-4" />
            </button>
          </Link>
        </div>

        {/* Navigation Icons */}
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.path} className="relative group">
              <Link href={item.path} onClick={() => handleNavigation(item.path)} className="block">
                <button
                  onMouseEnter={() => setShowTooltip(item.path)}
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 relative",
                    "hover:scale-110 active:scale-95",
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  
                  {/* Active indicator */}
                  {isActive(item.path) && (
                    <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full animate-pulse" />
                  )}
                </button>
              </Link>

              {/* Tooltip */}
              {showTooltip === item.path && (
                <div className={cn(
                  "absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1.5 z-10",
                  "bg-popover text-popover-foreground text-sm rounded-lg backdrop-blur-sm border border-border shadow-lg",
                  "whitespace-nowrap font-medium",
                  "animate-in fade-in-0 slide-in-from-left-2 duration-200"
                )}>
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover" />
                </div>
              )}
            </div>
          );
        })}

        {/* Cart with Badge */}
        <div className="relative group">
          <Link href="/orders" onClick={() => handleNavigation("/orders")} className="block">
            <button
              onMouseEnter={() => setShowTooltip("/orders")}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 relative",
                "hover:scale-110 active:scale-95",
                isActive("/orders")
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className={cn(
                  "absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs border-0",
                  "animate-pulse"
                )}
              >
                3
              </Badge>

              {/* Active indicator */}
              {isActive("/orders") && (
                <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          </Link>

          {/* Tooltip */}
          {showTooltip === "/orders" && (
            <div className={cn(
              "absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1.5 z-10",
              "bg-popover text-popover-foreground text-sm rounded-lg backdrop-blur-sm border border-border shadow-lg",
              "whitespace-nowrap font-medium",
              "animate-in fade-in-0 slide-in-from-left-2 duration-200"
            )}>
              Đơn hàng (3)
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover" />
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 my-1" />

        {/* Scroll to Top */}
        <div className="relative group">
          <button
            onClick={scrollToTop}
            onMouseEnter={() => setShowTooltip("/top")}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
              "bg-muted/60 text-muted-foreground hover:bg-primary hover:text-primary-foreground",
              "hover:scale-110 active:scale-95",
              "hover:shadow-lg hover:shadow-primary/20"
            )}
          >
            <ChevronUp className="h-4 w-4" />
          </button>

          {/* Tooltip */}
          {showTooltip === "/top" && (
            <div className={cn(
              "absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1.5 z-10",
              "bg-popover text-popover-foreground text-sm rounded-lg backdrop-blur-sm border border-border shadow-lg",
              "whitespace-nowrap font-medium",
              "animate-in fade-in-0 slide-in-from-left-2 duration-200"
            )}>
              Lên đầu trang
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 