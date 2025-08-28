import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Lấy tất cả system settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Chỉ admin mới được truy cập system settings
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Import supabase service role here để tránh circular dependency
    const { supabaseServiceRole } = await import('@/lib/supabase-server');
    
    const { data: settings, error } = await supabaseServiceRole
      .from('SystemSetting')
      .select('key, value, type')
      .order('key');

    if (error) {
      console.error('Error fetching system settings:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings
    });

  } catch (error) {
    console.error('System settings error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch system settings' 
      },
      { status: 500 }
    );
  }
}

// POST - Cập nhật system setting
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Chỉ admin mới được cập nhật system settings
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { key, value } = await request.json();

    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Key is required' },
        { status: 400 }
      );
    }

    // Import supabase service role here để tránh circular dependency
    const { supabaseServiceRole } = await import('@/lib/supabase-server');

    // Xác định type dựa vào value
    let type = 'string';
    let processedValue = value;

    if (typeof value === 'boolean') {
      type = 'boolean';
      processedValue = value.toString();
    } else if (typeof value === 'number') {
      type = 'number';
      processedValue = value.toString();
    } else if (typeof value === 'object' && value !== null) {
      type = 'json';
      processedValue = JSON.stringify(value);
    }

    const { error } = await supabaseServiceRole
      .from('SystemSetting')
      .update({ 
        value: processedValue,
        type,
        updatedAt: new Date().toISOString()
      })
      .eq('key', key);

    if (error) {
      console.error('Error updating system setting:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update setting' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Setting ${key} updated successfully`
    });

  } catch (error) {
    console.error('Update system setting error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update system setting' 
      },
      { status: 500 }
    );
  }
}
