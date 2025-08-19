import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Fetch all system settings
    const { data: settings, error } = await supabaseServiceRole
      .from('SystemSetting')
      .select('key, value, type');

    if (error) {
      console.error('Error fetching system settings:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to fetch settings' 
        },
        { status: 500 }
      );
    }

    // Transform to key-value object
    const settingsMap = (settings || []).reduce((acc: Record<string, string | number | boolean>, setting) => {
      let value = setting.value;
      
      // Convert value based on type
      if (setting.type === 'boolean') {
        value = setting.value === 'true';
      } else if (setting.type === 'number') {
        value = parseFloat(setting.value) || 0;
      }
      
      acc[setting.key] = value;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      settings: settingsMap
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
