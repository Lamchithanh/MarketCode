import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data: teamMembers, error } = await supabaseServiceRole
      .from('Team')
      .select('*')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: teamMembers || []
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