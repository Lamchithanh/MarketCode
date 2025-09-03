import type { Metadata } from "next";

interface SystemSettings {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  faviconUrl: string; // Changed back to faviconUrl for consistency
}

async function getSystemSettings(): Promise<SystemSettings> {
  try {
    // In production, this would be a server-side call
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/system-settings`, {
      cache: 'no-cache' // Don't cache to get fresh favicon from DB
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch system settings');
    }
    
    const data = await response.json();
    
    // Use logoUrl from API response which is already set to logo_url
    return {
      siteName: data.siteName || 'MarketCode',
      siteTitle: data.siteTitle || 'MarketCode - Premium Source Code Platform', 
      siteDescription: data.siteDescription || 'Nền tảng mua bán mã nguồn chất lượng cao',
      faviconUrl: data.logoUrl || '/favicon.ico' // API already sets faviconUrl = logo_url
    };
  } catch (error) {
    console.error('Error fetching system settings for metadata:', error);
    // Return fallback values
    return {
      siteName: 'MarketCode',
      siteTitle: 'MarketCode - Premium Source Code Platform',
      siteDescription: 'Nền tảng mua bán mã nguồn chất lượng cao',
      faviconUrl: '/favicon.ico'
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSystemSettings();
  
  return {
    title: {
      default: settings.siteTitle,
      template: `%s | ${settings.siteName}`
    },
    description: settings.siteDescription,
    keywords: ['source code', 'programming', 'web development', 'react', 'nextjs', 'marketplace'],
    authors: [{ name: settings.siteName }],
    creator: settings.siteName,
    publisher: settings.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: settings.faviconUrl,
      shortcut: settings.faviconUrl,
      apple: settings.faviconUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      title: settings.siteTitle,
      description: settings.siteDescription,
      siteName: settings.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.siteTitle,
      description: settings.siteDescription,
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
}
