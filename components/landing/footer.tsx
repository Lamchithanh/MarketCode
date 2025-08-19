import Link from "next/link";
import {
  Code,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Github,
  Linkedin,
} from "lucide-react";
import { SocialLink } from "@/types";
import { ClientEmailSupport } from "@/components/ui/client-email-support";
import { ClientPhoneSupport } from "@/components/ui/client-phone-support";

const socialLinks: SocialLink[] = [
  { name: "Facebook", href: "#", icon: "facebook" },
  { name: "Twitter", href: "#", icon: "twitter" },
  { name: "Github", href: "#", icon: "github" },
  { name: "LinkedIn", href: "#", icon: "linkedin" },
];

const getSocialIcon = (iconName: string) => {
  switch (iconName) {
    case "facebook":
      return <Facebook className="h-4 w-4" />;
    case "twitter":
      return <Twitter className="h-4 w-4" />;
    case "github":
      return <Github className="h-4 w-4" />;
    case "linkedin":
      return <Linkedin className="h-4 w-4" />;
    default:
      return null;
  }
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Code className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold">CodeMarket</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Nền tảng uy tín cung cấp source code chất lượng cao cho React,
              NextJS và các công nghệ web hiện đại.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {getSocialIcon(link.icon)}
                  <span className="sr-only">{link.name}</span>
                </Link>
              ))}
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
                <ClientEmailSupport />
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <ClientPhoneSupport />
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CodeMarket. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
