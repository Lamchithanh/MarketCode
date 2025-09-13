import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';
import { deleteTeamAvatar } from '@/lib/team-avatar-storage';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const { data: updatedMember, error } = await supabaseServiceRole
      .from('Team')
      .update({
        name,
        position,
        avatar_url: avatar_url || null,
        description: description || null,
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating team member:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: updatedMember
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Lấy thông tin member để xóa avatar
    const { data: member } = await supabaseServiceRole
      .from('Team')
      .select('avatar_url')
      .eq('id', id)
      .single();

    // Xóa avatar nếu có
    if (member?.avatar_url) {
      await deleteTeamAvatar(member.avatar_url);
    }

    const { error } = await supabaseServiceRole
      .from('Team')
      .update({
        deleted_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully'
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