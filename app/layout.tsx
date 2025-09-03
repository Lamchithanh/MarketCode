import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";
import { BackToTop } from "@/components/ui/back-to-top";
import { FloatingMenu } from "@/components/landing";
import { NoSSR } from "@/components/ui/no-ssr";
import { Toaster } from "@/components/ui/sonner";
import { Chatbox } from "@/components/ui/chatbox";
import { DynamicFavicon } from "@/components/ui/dynamic-favicon";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MarketCode - Premium Source Code Platform",
    template: "%s | MarketCode"
  },
  description: "Nền tảng mua bán mã nguồn chất lượng cao cho React, NextJS và các công nghệ web hiện đại",
  keywords: ['source code', 'programming', 'web development', 'react', 'nextjs', 'marketplace', 'mã nguồn', 'lập trình'],
  authors: [{ name: 'MarketCode Team' }],
  creator: 'MarketCode',
  publisher: 'MarketCode',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    title: 'MarketCode - Premium Source Code Platform',
    description: 'Nền tảng mua bán mã nguồn chất lượng cao cho React, NextJS và các công nghệ web hiện đại',
    siteName: 'MarketCode',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MarketCode - Premium Source Code Platform',
    description: 'Nền tảng mua bán mã nguồn chất lượng cao cho React, NextJS và các công nghệ web hiện đại',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              if (typeof window === 'undefined') return;
              
              const originalError = console.error;
              console.error = function() {
                const message = arguments[0]?.toString() || '';
                if (
                  message.includes('removeChild') ||
                  message.includes('Cannot read properties of null') ||
                  message.includes('commitDeletionEffectsOnFiber')
                ) {
                  return;
                }
                return originalError.apply(console, arguments);
              };
              
              window.addEventListener('error', function(e) {
                const msg = e.error?.message || e.message || '';
                if (msg.includes('removeChild') || msg.includes('Cannot read properties of null')) {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  return false;
                }
              }, { capture: true, passive: false });
            })();
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <NoSSR>
            <DynamicFavicon />
          </NoSSR>
          {children}
          <NoSSR>
            <BackToTop />
            <FloatingMenu />
            <Chatbox dailyLimit={50} />
          </NoSSR>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
