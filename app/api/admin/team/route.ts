import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data: teamMembers, error } = await supabaseServiceRole
      .from('Team')
      .select('*')
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, avatar_url, description, display_order, is_active } = body;

    if (!name || !position) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Name and position are required' 
        },
        { status: 400 }
      );
    }

    const { data: newMember, error } = await supabaseServiceRole
      .from('Team')
      .insert({
        name,
        position,
        avatar_url: avatar_url || null,
        description: description || null,
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating team member:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: newMember
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