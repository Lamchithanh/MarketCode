"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, Code, ShoppingCart, User } from "lucide-react";
import { NavItem } from "@/types";
import { useSession } from "next-auth/react";
import { UserNav } from "@/components/ui/user-nav";

import { useUser } from "@/hooks/use-user";
import { useSystemSettings } from "@/hooks/use-system-settings";
import { useNavigation } from "@/hooks/use-navigation";
import { cn } from "@/lib/utils";
import { AuthNoSSR } from "@/components/ui/no-ssr";

const navItems: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Dịch vụ", href: "/services" },
  { label: "Về chúng tôi", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { data: session } = useSession();
  const { user: liveUser } = useUser();
  const { settings } = useSystemSettings();
  const { navigateToLogin, navigateToRegister } = useNavigation();
  
  // Use live user data if available, fallback to session
  const displayUser = liveUser || session?.user;

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Chỉ có 2 trạng thái: bình thường và ẩn hoàn toàn
  const shouldHideHeader = scrollY > 150;    // Header ẩn hoàn toàn

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-all duration-500 ease-out",
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16",
      // Ẩn header khi FloatingMenu xuất hiện
      shouldHideHeader && "transform -translate-y-full opacity-0 pointer-events-none"
    )}>
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {settings?.logoUrl ? (
            <Image 
              src={settings.logoUrl} 
              alt={settings?.siteName || 'MarketCode'} 
              width={32}
              height={32}
              className="object-contain rounded-lg"
            />
          ) : (
            <div className="flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-8 w-8">
              <Code className="h-4 w-4" />
            </div>
          )}
          <span className="font-bold text-xl">{settings?.siteName || 'MarketCode'}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium transition-colors hover:text-primary text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="default"
            asChild
          >
            <Link href="/cart">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Giỏ hàng
            </Link>
          </Button>
          
          <AuthNoSSR>
            {session ? (
              <UserNav />
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="default"
                  onClick={navigateToLogin}
                >
                  <User className="h-4 w-4 mr-2" />
                  Đăng nhập
                </Button>
                <Button 
                  size="default"
                  onClick={navigateToRegister}
                >
                  Đăng ký
                </Button>
              </>
            )}
          </AuthNoSSR>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="relative"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b shadow-lg md:hidden">
          <nav className="container py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="border-t pt-4 space-y-2">
              <AuthNoSSR>
                {session ? (
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <UserNav />
                    <span className="font-medium">{displayUser?.name}</span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigateToLogin();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left"
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">Đăng nhập</span>
                    </button>
                    <button
                      onClick={() => {
                        navigateToRegister();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left"
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">Đăng ký</span>
                    </button>
                  </>
                )}
              </AuthNoSSR>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
