import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseServiceRole
      .from('GitCode')
      .select(`
        *,
        User (
          id,
          name,
          avatar
        ),
        Category (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .is('deletedAt', null)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'GitCode not found' }, { status: 404 });
    }

    // Increment view count
    await supabaseServiceRole
      .from('GitCode')
      .update({ viewCount: (data.viewCount || 0) + 1 })
      .eq('id', id);

    return NextResponse.json({ 
      success: true, 
      data 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check if user owns this gitcode or is admin
    const { data: existingGitCode, error: fetchError } = await supabaseServiceRole
      .from('GitCode')
      .select('userId')
      .eq('id', id)
      .single();

    if (fetchError || !existingGitCode) {
      return NextResponse.json({ error: 'GitCode not found' }, { status: 404 });
    }

    const isOwner = existingGitCode.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update gitcode
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    // Only allow certain fields to be updated by owner
    if (isOwner) {
      if (body.title) updateData.title = body.title.trim();
      if (body.description !== undefined) updateData.description = body.description?.trim() || null;
      if (body.githubUrl) updateData.githubUrl = body.githubUrl.trim();
      if (body.demoUrl !== undefined) updateData.demoUrl = body.demoUrl?.trim() || null;
      if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl?.trim() || null;
      if (body.technologies) updateData.technologies = body.technologies;
      if (body.tags) updateData.tags = body.tags;
      if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
      if (body.isPublic !== undefined) updateData.isPublic = body.isPublic;
      
      // Reset approval when user updates
      updateData.isApproved = false;
    }

    // Admin can update approval status
    if (isAdmin && body.isApproved !== undefined) {
      updateData.isApproved = body.isApproved;
    }

    const { data, error } = await supabaseServiceRole
      .from('GitCode')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating gitcode:', error);
      return NextResponse.json({ error: 'Failed to update gitcode' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data,
      message: 'GitCode updated successfully!' 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if user owns this gitcode or is admin
    const { data: existingGitCode, error: fetchError } = await supabaseServiceRole
      .from('GitCode')
      .select('userId')
      .eq('id', id)
      .single();

    if (fetchError || !existingGitCode) {
      return NextResponse.json({ error: 'GitCode not found' }, { status: 404 });
    }

    const isOwner = existingGitCode.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Soft delete
    const { error } = await supabaseServiceRole
      .from('GitCode')
      .update({ 
        deletedAt: new Date().toISOString(),
        isActive: false
      })
      .eq('id', id);

    if (error) {
      console.error('Error deleting gitcode:', error);
      return NextResponse.json({ error: 'Failed to delete gitcode' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'GitCode deleted successfully!' 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
