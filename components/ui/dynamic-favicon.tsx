"use client";

import { useEffect } from 'react';
import { useSystemSettings } from '@/hooks/use-system-settings';

export function DynamicFavicon() {
  const { settings, loading } = useSystemSettings();

  // Debug log
  useEffect(() => {
    console.log('DynamicFavicon - Settings:', settings);
    console.log('DynamicFavicon - Loading:', loading);
    console.log('DynamicFavicon - FaviconUrl:', settings?.faviconUrl);
  }, [settings, loading]);

  useEffect(() => {
    if (loading || !settings?.faviconUrl) return;
    
    // Skip if it's the default favicon (no need to replace with itself)
    if (settings.faviconUrl === '/favicon.ico') return;

    console.log('Updating favicon to:', settings.faviconUrl);

    // Remove all existing favicon-related links
    const existingIcons = document.querySelectorAll("link[rel*='icon'], link[rel*='shortcut']");
    existingIcons.forEach(icon => icon.remove());

    // Create new favicon links with cache buster
    const cacheBuster = new Date().getTime();
    const faviconLinks = [
      { rel: 'icon', type: 'image/x-icon', href: `${settings.faviconUrl}?v=${cacheBuster}` },
      { rel: 'shortcut icon', type: 'image/x-icon', href: `${settings.faviconUrl}?v=${cacheBuster}` },
      { rel: 'apple-touch-icon', href: `${settings.faviconUrl}?v=${cacheBuster}` },
    ];

    faviconLinks.forEach(linkData => {
      const link = document.createElement('link');
      link.rel = linkData.rel;
      link.href = linkData.href;
      if (linkData.type) link.type = linkData.type;
      document.head.appendChild(link);
    });

    // Update title if needed
    if (settings.siteTitle && document.title !== settings.siteTitle) {
      document.title = settings.siteTitle;
    }

    console.log('Dynamic favicon updated successfully');
  }, [settings, loading]);

  return null; // This component doesn't render anything
}
