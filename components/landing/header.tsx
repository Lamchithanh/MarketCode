"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Code, ShoppingCart, User } from "lucide-react";
import { NavItem } from "@/types";
import { useSession } from "next-auth/react";
import { UserNav } from "@/components/ui/user-nav";

const navItems: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Dịch vụ", href: "/services" },
  { label: "Về chúng tôi", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Code className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold">CodeMarket</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Giỏ hàng
          </Button>
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full"></div>
          ) : session ? (
            <UserNav />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  <User className="h-4 w-4 mr-2" />
                  Đăng nhập
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Đăng ký</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4 mb-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button variant="ghost" className="justify-start">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Giỏ hàng
              </Button>
              {status === "loading" ? (
                <div className="flex items-center space-x-2 px-4 py-2">
                  <div className="h-6 w-6 animate-pulse bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-20 animate-pulse bg-gray-200 rounded"></div>
                </div>
              ) : session ? (
                <div className="flex items-center space-x-2 px-4 py-2">
                  <UserNav />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {session.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {session.user.email}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/login">
                      <User className="h-4 w-4 mr-2" />
                      Đăng nhập
                    </Link>
                  </Button>
                  <Button className="justify-start" asChild>
                    <Link href="/register">Đăng ký</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
