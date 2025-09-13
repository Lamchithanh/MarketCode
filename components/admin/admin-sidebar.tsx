"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSystemSettings } from "@/hooks/use-system-settings";
import { LogoutConfirmationModal } from "@/components/ui/confirmation-modal";
import { toast, toastMessages } from "@/components/ui/toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  Tags,
  ReceiptCent,
  Star,
  Download,
  MessageSquare,
  Settings,
  Code,
  Shield,
  LogOut,
  Github,
  Briefcase,
  Wrench,
  UserCheck,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { settings: systemSettings } = useSystemSettings();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      toast.success(toastMessages.auth.logoutSuccess);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Đã xảy ra lỗi khi đăng xuất");
    }
  };

  return (
    <>
      <Sidebar className="min-h-screen border-r border-border/40">
        <SidebarHeader className="bg-gradient-to-r from-primary/10 via-background to-accent/10 border-b border-border/40">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-3 py-4 hover:bg-accent/20 transition-colors rounded-md group"
            title="Về trang chủ"
          >
            {systemSettings.logoUrl ? (
              <div className="w-10 h-10 rounded-lg overflow-hidden group-hover:scale-105 transition-transform bg-white relative">
                <Image 
                  src={systemSettings.logoUrl} 
                  alt={`${systemSettings.siteName} Logo`}
                  className="object-contain"
                  fill
                  sizes="40px"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h2 className="font-bold text-lg text-foreground">{systemSettings.siteName}</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Dashboard
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/dashboard"}>
                    <Link href="/admin/dashboard">
                      <BarChart3 className="w-4 h-4" />
                      <span>Tổng quan</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quản lý người dùng
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/users")}>
                    <Link href="/admin/users">
                      <Users className="w-4 h-4" />
                      <span>Người dùng</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quản lý đội ngũ
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/team")}>
                    <Link href="/admin/team">
                      <UserCheck className="w-4 h-4" />
                      <span>Đội ngũ</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quản lý sản phẩm
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/products")}>
                    <Link href="/admin/products">
                      <Package className="w-4 h-4" />
                      <span>Sản phẩm</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/categories")}>
                    <Link href="/admin/categories">
                      <Tags className="w-4 h-4" />
                      <span>Danh mục</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/tags")}>
                    <Link href="/admin/tags">
                      <Code className="w-4 h-4" />
                      <span>Tags</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/gitcode")}>
                    <Link href="/admin/gitcode">
                      <Github className="w-4 h-4" />
                      <span>GitCode</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quản lý đơn hàng
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/orders")}>
                    <Link href="/admin/orders">
                      <ShoppingCart className="w-4 h-4" />
                      <span>Đơn hàng</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/coupons")}>
                    <Link href="/admin/coupons">
                      <ReceiptCent className="w-4 h-4" />
                      <span>Mã giảm giá</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Đánh giá & Phản hồi
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/reviews")}>
                    <Link href="/admin/reviews">
                      <Star className="w-4 h-4" />
                      <span>Đánh giá</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nội dung
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/downloads")}>
                    <Link href="/admin/downloads">
                      <Download className="w-4 h-4" />
                      <span>Tải xuống</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quản lý dịch vụ
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/services")}>
                    <Link href="/admin/services">
                      <Briefcase className="w-4 h-4" />
                      <span>Dịch vụ</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Giao tiếp
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/service-requests")}>
                    <Link href="/admin/service-requests">
                      <Wrench className="w-4 h-4" />
                      <span>Yêu cầu dịch vụ</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/messages")}>
                    <Link href="/admin/messages">
                      <MessageSquare className="w-4 h-4" />
                      <span>Tin nhắn</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Hệ thống
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/settings")}>
                    <Link href="/admin/settings">
                      <Settings className="w-4 h-4" />
                      <span>Cài đặt</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="bg-gradient-to-r from-accent/10 via-background to-primary/10 border-t border-border/40">
          <div className="px-3 py-4 space-y-3">
            {/* User Info */}
            {session && (
              <div className="text-xs text-muted-foreground text-center border-b border-border/40 pb-3">
                <p className="font-medium text-foreground">{session.user.name}</p>
                <p className="text-xs">{session.user.email}</p>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200",
                "bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground",
                "border border-destructive/20 hover:border-destructive",
                "hover:shadow-md active:scale-95"
              )}
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>

            {/* Version Info */}
            <div className="text-xs text-muted-foreground text-center pt-2">
              <p className="font-medium">{systemSettings.siteName} Admin</p>
              <p className="text-xs">v{systemSettings.version}</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
      />
    </>
  );
}
