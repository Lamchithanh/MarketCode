import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// GET - Lấy tất cả settings
export async function GET() {
  try {
    const { data: settings, error } = await supabaseServiceRole
      .from('SystemSetting')
      .select('*')
      .order('key', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    // Nhóm settings theo category dựa trên key
    const generalKeys = ['site_name', 'site_description', 'contact_email', 'items_per_page', 
                        'enable_registration', 'enable_email_verification', 'currency', 'maintenance_mode'];
    const brandingKeys = ['logo_url', 'footer_text', 'hero_title', 'hero_subtitle'];
    const systemKeys = ['max_file_upload_size', 'email_smtp_host', 'email_smtp_port', 
                       'email_from_name', 'email_from_address', 'backup_frequency'];

    const groupedSettings = {
      general: settings?.filter((s: Setting) => generalKeys.includes(s.key)) || [],
      branding: settings?.filter((s: Setting) => brandingKeys.includes(s.key)) || [],
      system: settings?.filter((s: Setting) => systemKeys.includes(s.key)) || []
    };

    return NextResponse.json(groupedSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật multiple settings
export async function PUT(request: NextRequest) {
  try {
    const { settings } = await request.json();

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    // Update settings in batch using Supabase
    const updatePromises = Object.entries(settings).map(async ([key, value]) => {
      const { error } = await supabaseServiceRole
        .from('SystemSetting')
        .update({ 
          value: String(value),
          updatedAt: new Date().toISOString()
        })
        .eq('key', key);
      
      if (error) {
        throw new Error(`Failed to update setting ${key}: ${error.message}`);
      }
      
      return { key, value };
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      updatedCount: Object.keys(settings).length
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
