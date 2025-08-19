import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Test database connection
    const { error } = await supabaseServiceRole
      .from('SystemSetting')
      .select('count(*)')
      .limit(1);

    if (error) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Database connection failed',
          error: error.message 
        },
        { status: 500 }
      );
    }

    // Mock system status
    const systemStatus = {
      database: 'healthy',
      storage: 'healthy',
      api: 'healthy',
      memory: Math.random() * 100,
      uptime: `${Math.floor(Math.random() * 30)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(systemStatus);
  } catch (error) {
    console.error('System status error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to get system status' 
      },
      { status: 500 }
    );
  }
}
