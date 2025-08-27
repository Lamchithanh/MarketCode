import { NextResponse, NextRequest } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Lấy system settings từ database
    const { data: settingsData, error } = await supabaseServiceRole
      .from('SystemSetting')
      .select('*');

    if (error) {
      console.error('Error fetching settings from database:', error);
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    // Transform dữ liệu thành object dễ sử dụng
    const settings: Record<string, string | number | boolean | object> = {};
    settingsData?.forEach(setting => {
      let value: string | number | boolean | object = setting.value;
      
      // Parse theo type
      switch (setting.type) {
        case 'boolean':
          value = setting.value === 'true';
          break;
        case 'number':
          value = parseFloat(setting.value);
          break;
        case 'json':
          try {
            value = JSON.parse(setting.value);
          } catch {
            value = setting.value;
          }
          break;
        default:
          value = setting.value;
      }
      
      settings[setting.key] = value;
    });

    return NextResponse.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('Error in settings API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Support cả 2 format: { settings: {...} } và { key, value }
    let settingsToUpdate: Record<string, string | number | boolean | object> = {};

    if (body.settings && typeof body.settings === 'object') {
      // Format cũ: { settings: { key1: value1, key2: value2 } }
      settingsToUpdate = body.settings;
    } else if (body.key && body.value !== undefined) {
      // Format mới: { key: "setting_key", value: "setting_value" }
      settingsToUpdate[body.key] = body.value;
    } else {
      return NextResponse.json(
        { error: 'Invalid settings data. Expected { settings: {...} } or { key, value }' },
        { status: 400 }
      );
    }

    // Update từng setting trong database
    const updatePromises = Object.entries(settingsToUpdate).map(async ([key, value]) => {
      let stringValue: string;
      let type: string;

      // Determine type và convert value thành string
      if (typeof value === 'boolean') {
        stringValue = value.toString();
        type = 'boolean';
      } else if (typeof value === 'number') {
        stringValue = value.toString();
        type = 'number';
      } else if (typeof value === 'object') {
        stringValue = JSON.stringify(value);
        type = 'json';
      } else {
        stringValue = String(value);
        type = 'string';
      }

      // Upsert setting
      const { error } = await supabaseServiceRole
        .from('SystemSetting')
        .upsert(
          {
            key,
            value: stringValue,
            type,
            updatedAt: new Date().toISOString()
          },
          {
            onConflict: 'key'
          }
        );

      if (error) {
        console.error(`Error updating setting ${key}:`, error);
        throw error;
      }
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'Setting key is required' },
        { status: 400 }
      );
    }

    // Delete setting from database
    const { error } = await supabaseServiceRole
      .from('SystemSetting')
      .delete()
      .eq('key', key);

    if (error) {
      console.error('Error deleting setting:', error);
      return NextResponse.json(
        { error: 'Failed to delete setting' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Setting deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting setting:', error);
    return NextResponse.json(
      { error: 'Failed to delete setting' },
      { status: 500 }
    );
  }
}
