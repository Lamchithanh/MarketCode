import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data: settings, error } = await supabaseServiceRole
      .from('SystemSetting')
      .select('key, value, type')
      .in('key', [
        'site_name',
        'site_title',
        'site_description',
        'logo_url',
        'favicon_url',
        'contact_email',
        'support_email',
        'support_phone',
        'support_hours',
        'copyright_text',
        'company_address',
        'company_description',
        'social_facebook',
        'social_github',
        'social_youtube',
        'social_tiktok',
        'social_facebook_enabled',
        'social_github_enabled',
        'social_youtube_enabled',
        'social_tiktok_enabled'
      ]);

    if (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }

    // Convert array of settings to object
    const settingsObj = settings?.reduce((acc, setting) => {
      let value = setting.value;
      
      // Parse value based on type
      if (setting.type === 'boolean') {
        value = setting.value === 'true';
      } else if (setting.type === 'number') {
        value = Number(setting.value);
      } else if (setting.type === 'json') {
        try {
          value = JSON.parse(setting.value);
        } catch {
          value = setting.value;
        }
      }
      
      acc[setting.key] = value;
      return acc;
    }, {} as Record<string, string | number | boolean | object>) || {};

    // Structure the response with proper naming
    const response = {
      // Site Identity
      siteName: settingsObj.site_name || 'MarketCode',
      siteTitle: settingsObj.site_title || 'MarketCode - Premium Source Code Platform',
      siteDescription: settingsObj.site_description || 'Nền tảng mua bán mã nguồn chất lượng cao',
      logoUrl: settingsObj.logo_url || '/logo.png',
      faviconUrl: settingsObj.logo_url || '/favicon.ico', // Sử dụng chung logo_url cho favicon
      
      // Contact Information
      contactEmail: settingsObj.contact_email || 'contact@marketcode.com',
      supportEmail: settingsObj.support_email || 'support@marketcode.com',
      supportPhone: settingsObj.support_phone || '',
      supportHours: settingsObj.support_hours || '24/7',
      
      // Company Info
      companyAddress: settingsObj.company_address || '',
      companyDescription: settingsObj.company_description || '',
      copyrightText: settingsObj.copyright_text || '© 2024 MarketCode. All rights reserved.',
      
      // Social Media
      socialLinks: {
        facebook: {
          url: settingsObj.social_facebook || '',
          enabled: settingsObj.social_facebook_enabled || false
        },
        github: {
          url: settingsObj.social_github || '',
          enabled: settingsObj.social_github_enabled || false
        },
        youtube: {
          url: settingsObj.social_youtube || '',
          enabled: settingsObj.social_youtube_enabled || false
        },
        tiktok: {
          url: settingsObj.social_tiktok || '',
          enabled: settingsObj.social_tiktok_enabled || false
        }
      }
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });

  } catch (error) {
    console.error('Error fetching system settings:', error);
    
    // Return fallback data
    return NextResponse.json({
      siteName: 'MarketCode',
      siteTitle: 'MarketCode - Premium Source Code Platform',
      siteDescription: 'Nền tảng mua bán mã nguồn chất lượng cao',
      logoUrl: '/logo.png',
      faviconUrl: '/favicon.ico',
      contactEmail: 'contact@marketcode.com',
      supportEmail: 'support@marketcode.com',
      supportPhone: '',
      supportHours: '24/7',
      companyAddress: '',
      companyDescription: '',
      copyrightText: '© 2024 MarketCode. All rights reserved.',
      socialLinks: {
        facebook: { url: '', enabled: false },
        github: { url: '', enabled: false },
        youtube: { url: '', enabled: false },
        tiktok: { url: '', enabled: false }
      }
    }, { status: 200 });
  }
}
