"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Code, ShoppingCart, User, ArrowUp } from "lucide-react";
import { NavItem } from "@/types";
import { useSession } from "next-auth/react";
import { UserNav } from "@/components/ui/user-nav";
import { useIsClient } from "@/hooks/use-hydration";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

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
  const isClient = useIsClient();
  const { data: session, status } = useSession();
  const { isVisible, scrollProgress, scrollToTop } = useScrollProgress({ threshold: 100 });

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
          <div className="flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-8 w-8">
            <Code className="h-4 w-4" />
          </div>
          <span className="font-bold text-xl">CodeMarket</span>
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
          
          {!isClient ? (
            <div className="animate-pulse bg-gray-200 rounded-full h-8 w-8"></div>
          ) : session ? (
            <UserNav />
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="default"
                asChild
              >
                <Link href="/login">
                  <User className="h-4 w-4 mr-2" />
                  Đăng nhập
                </Link>
              </Button>
              <Button 
                size="default"
                asChild
              >
                <Link href="/register">
                  Đăng ký
                </Link>
              </Button>
            </>
          )}
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
              {!isClient ? (
                <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-full"></div>
              ) : session ? (
                <div className="flex items-center space-x-3 px-4 py-3">
                  <UserNav />
                  <span className="font-medium">{session.user?.name}</span>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Đăng nhập</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Đăng ký</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
