"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Code,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Github,
} from "lucide-react";
import { useSystemSettings } from "@/hooks/use-system-settings";

export function Footer() {
  const { settings, loading } = useSystemSettings();

  if (loading) {
    return (
      <footer className="border-t bg-background">
        <div className="container py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </footer>
    );
  }
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Code className="h-4 w-4" />
                </div>
              )}
              <span className="text-xl font-bold">{settings?.siteName || 'MarketCode'}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {settings?.companyDescription || settings?.siteDescription || "Nền tảng uy tín cung cấp source code chất lượng cao cho React, NextJS và các công nghệ web hiện đại."}
            </p>
            <div className="flex space-x-4">
              {settings?.socialLinks?.facebook?.enabled && settings.socialLinks.facebook.url && (
                <Link
                  href={settings.socialLinks.facebook.url}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Link>
              )}
              {settings?.socialLinks?.github?.enabled && settings.socialLinks.github.url && (
                <Link
                  href={settings.socialLinks.github.url}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  <span className="sr-only">Github</span>
                </Link>
              )}
              {settings?.socialLinks?.youtube?.enabled && settings.socialLinks.youtube.url && (
                <Link
                  href={settings.socialLinks.youtube.url}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className="sr-only">YouTube</span>
                </Link>
              )}
              {settings?.socialLinks?.tiktok?.enabled && settings.socialLinks.tiktok.url && (
                <Link
                  href={settings.socialLinks.tiktok.url}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  <span className="sr-only">TikTok</span>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Dịch vụ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services/web-development"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Phát triển Website
                </Link>
              </li>
              <li>
                <Link
                  href="/services/thesis-support"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Hỗ trợ đồ án
                </Link>
              </li>
              <li>
                <Link
                  href="/services/consultation"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Tư vấn kỹ thuật
                </Link>
              </li>
              <li>
                <Link
                  href="/services/maintenance"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Bảo trì & Nâng cấp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Liên hệ</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{settings?.supportEmail || 'support@marketcode.com'}</span>
              </div>
              {settings?.supportPhone && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{settings.supportPhone}</span>
                </div>
              )}
              {settings?.companyAddress && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{settings.companyAddress}</span>
                </div>
              )}
              {settings?.supportHours && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <span className="font-medium">Giờ hỗ trợ:</span>
                  <span>{settings.supportHours}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>{settings?.copyrightText || `© ${new Date().getFullYear()} MarketCode. Tất cả quyền được bảo lưu.`}</p>
        </div>
      </div>
    </footer>
  );
}
