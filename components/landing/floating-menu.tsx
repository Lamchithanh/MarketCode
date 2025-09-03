"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, User, Package, FileText, Mail, ChevronUp, Code, Settings, Heart, LogOut, Download, Shield, CreditCard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useSystemSettings } from "@/hooks/use-system-settings";

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
 * - User dropdown menu
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
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { settings } = useSystemSettings();

  // Ẩn floating menu khi ở trong admin panel
  const isAdminPanel = pathname.startsWith('/admin');

  // Ẩn menu ngay lập tức khi chuyển vào admin panel
  useEffect(() => {
    if (isAdminPanel) {
      setIsVisible(false);
    }
  }, [isAdminPanel]);

  // Enhanced scroll detection
  useEffect(() => {
    let lastScrollY = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          
          // Show menu after scrolling down 150px, nhưng chỉ khi không ở admin panel
          const shouldShow = scrollY > 150 && !isAdminPanel;
          setIsVisible(shouldShow);
          
          // Track scroll direction for subtle animations
          setIsScrollingUp(scrollY < lastScrollY);
          lastScrollY = scrollY;
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Chỉ thêm event listener khi không ở admin panel
    if (!isAdminPanel) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isAdminPanel]);

  // Navigation items with icons
  const navigationItems = [
    { name: "Home", path: "/", icon: Home, label: "Trang chủ" },
    { name: "Products", path: "/products", icon: Package, label: "Sản phẩm" },
    { name: "Services", path: "/services", icon: Code, label: "Dịch vụ" },
    { name: "About", path: "/about", icon: FileText, label: "Về chúng tôi" },
    { name: "Contact", path: "/contact", icon: Mail, label: "Liên hệ" },
  ];

  // User dropdown menu items - giống với user-nav
  const userMenuItems = [
    { name: "Hồ sơ", path: "/profile?tab=overview", icon: User },
    { name: "Đơn hàng", path: "/profile?tab=orders", icon: CreditCard },
    { name: "Tải xuống", path: "/profile?tab=downloads", icon: Download },
    { name: "GitCode", path: "/profile?tab=gitcode", icon: Code },
    { name: "Yêu thích", path: "/profile?tab=wishlist", icon: Heart },
    { name: "Cài đặt", path: "/profile?tab=settings", icon: Settings },
  ];

  // Admin menu items
  const isAdmin = session?.user?.role === "ADMIN";
  const adminMenuItems = isAdmin ? [
    { name: "Quản trị", path: "/admin/dashboard", icon: Shield },
  ] : [];

  const isActive = (path: string) => pathname === path;

  // Handle navigation
  const handleNavigation = () => {
    // Close tooltip when navigating
    setShowTooltip(null);
    setShowUserDropdown(false);
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
    setShowUserDropdown(false);
  };

  // Handle user dropdown
  const handleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowTooltip(null);
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    setShowUserDropdown(false);
  };

  // Hide FloatingMenu on auth pages and admin panel
  const isAuthPage = pathname === "/login" || pathname === "/register";
  
  // Ẩn hoàn toàn khi ở admin panel hoặc auth pages
  if (isAuthPage || isAdminPanel) return null;
  
  // Ẩn khi không visible
  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed left-4 top-20 z-[100] transition-all duration-700 ease-out",
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
        <div className="flex items-center justify-center mb-1.5 pb-1.5 border-b border-border/40 relative group">
          <Link href="/" onClick={handleNavigation} className="block">
            <button 
              onMouseEnter={() => setShowTooltip("/home")}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden",
                "hover:scale-110 active:scale-95 transition-all duration-200",
                "hover:bg-accent/10"
              )}
            >
              {settings?.faviconUrl ? (
                <Image 
                  src={settings.faviconUrl} 
                  alt={settings?.siteName || 'MarketCode'} 
                  width={28}
                  height={28}
                  className="object-contain rounded-sm"
                  unoptimized
                />
              ) : (
                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                  <Code className="h-4 w-4" />
                </div>
              )}
            </button>
          </Link>

          {/* Logo Tooltip */}
          {showTooltip === "/home" && (
            <div className={cn(
              "absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1.5 z-10",
              "bg-popover text-popover-foreground text-sm rounded-lg backdrop-blur-sm border border-border shadow-lg",
              "whitespace-nowrap font-medium",
              "animate-in fade-in-0 slide-in-from-left-2 duration-200"
            )}>
              {settings?.siteName || 'MarketCode'}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover" />
            </div>
          )}
        </div>

        {/* Navigation Icons */}
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.path} className="relative group">
              <Link href={item.path} onClick={handleNavigation} className="block">
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

        {/* User Account with Dropdown */}
        {session && (
          <div className="relative group">
            <button
              onClick={handleUserDropdown}
              onMouseEnter={() => setShowTooltip("/profile")}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 relative",
                "hover:scale-110 active:scale-95",
                isActive("/profile") || showUserDropdown
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <User className="h-4 w-4" />
              
              {/* Active indicator */}
              {isActive("/profile") && (
                <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full animate-pulse" />
              )}
            </button>

            {/* User Dropdown Menu */}
            {showUserDropdown && (
              <div className={cn(
                "absolute left-12 top-0 z-20 min-w-[200px]",
                "bg-popover text-popover-foreground rounded-lg backdrop-blur-sm border border-border shadow-lg",
                "animate-in fade-in-0 slide-in-from-left-2 duration-200"
              )}>
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-sm">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user.email}</p>
                </div>
                <div className="p-1">
                  {/* User Menu Items */}
                  {userMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={handleNavigation}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                          "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <IconComponent className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                  
                  {/* Admin Menu Items */}
                  {adminMenuItems.length > 0 && (
                    <>
                      <div className="border-t border-border mx-1 my-1" />
                      {adminMenuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.path}
                            href={item.path}
                            onClick={handleNavigation}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                              "hover:bg-accent hover:text-accent-foreground"
                            )}
                          >
                            <IconComponent className="h-4 w-4" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </>
                  )}
                  
                  {/* Separator và Logout */}
                  <div className="border-t border-border mx-1 my-1" />
                  <button
                    onClick={handleLogout}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                      "hover:bg-destructive hover:text-destructive-foreground text-left"
                    )}
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
                <div className="absolute right-full top-4 border-4 border-transparent border-r-popover" />
              </div>
            )}

            {/* Tooltip */}
            {showTooltip === "/profile" && !showUserDropdown && (
              <div className={cn(
                "absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1.5 z-10",
                "bg-popover text-popover-foreground text-sm rounded-lg backdrop-blur-sm border border-border shadow-lg",
                "whitespace-nowrap font-medium",
                "animate-in fade-in-0 slide-in-from-left-2 duration-200"
              )}>
                Tài khoản
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover" />
              </div>
            )}
          </div>
        )}

        {/* Cart with Badge */}
        <div className="relative group">
          <Link href="/cart" onClick={handleNavigation} className="block">
            <button
              onMouseEnter={() => setShowTooltip("/cart")}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 relative",
                "hover:scale-110 active:scale-95",
                isActive("/cart")
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
              {isActive("/cart") && (
                <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          </Link>

          {/* Tooltip */}
          {showTooltip === "/cart" && (
            <div className={cn(
              "absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1.5 z-10",
              "bg-popover text-popover-foreground text-sm rounded-lg backdrop-blur-sm border border-border shadow-lg",
              "whitespace-nowrap font-medium",
              "animate-in fade-in-0 slide-in-from-left-2 duration-200"
            )}>
              Giỏ hàng (3)
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