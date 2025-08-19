import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabaseServiceRole
      .from('Order')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { 
          error: 'Supabase connection failed', 
          details: error.message,
          code: error.code 
        },
        { status: 500 }
      );
    }

    console.log('Supabase connection successful:', data);

    return NextResponse.json({
      success: true,
      message: 'Supabase connection working',
      data
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { 
        error: 'API test failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
