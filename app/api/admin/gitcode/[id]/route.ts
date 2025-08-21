import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseServiceRole } from '@/lib/supabase-server';

// PUT - Update GitCode (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Validate GitCode exists
    const { data: existingGitCode, error: fetchError } = await supabaseServiceRole
      .from('GitCode')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingGitCode) {
      return NextResponse.json(
        { success: false, error: 'GitCode không tồn tại' },
        { status: 404 }
      );
    }

    // If updating code, check for duplicates
    if (body.code && body.code !== existingGitCode.code) {
      const { data: duplicateCode, error: duplicateError } = await supabaseServiceRole
        .from('GitCode')
        .select('id')
        .eq('code', body.code.trim().toUpperCase())
        .neq('id', id)
        .single();

      if (duplicateCode && !duplicateError) {
        return NextResponse.json(
          { success: false, error: 'Mã GitCode này đã tồn tại' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Only update fields that are provided
    if (body.code !== undefined) updateData.code = body.code.trim().toUpperCase();
    if (body.repo_url !== undefined) updateData.repo_url = body.repo_url.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.expire_date !== undefined) {
      updateData.expire_date = body.expire_date ? new Date(body.expire_date).toISOString() : null;
    }
    if (body.usage_limit !== undefined) updateData.usage_limit = parseInt(body.usage_limit) || -1;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;

    // Update GitCode
    const { data, error } = await supabaseServiceRole
      .from('GitCode')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating GitCode:', error);
      return NextResponse.json(
        { success: false, error: 'Không thể cập nhật GitCode' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đã cập nhật GitCode thành công',
      data: data,
    });

  } catch (error) {
    console.error('Admin GitCode update API error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
}

// DELETE - Delete GitCode (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Validate GitCode exists
    const { data: existingGitCode, error: fetchError } = await supabaseServiceRole
      .from('GitCode')
      .select('code')
      .eq('id', id)
      .single();

    if (fetchError || !existingGitCode) {
      return NextResponse.json(
        { success: false, error: 'GitCode không tồn tại' },
        { status: 404 }
      );
    }

    // Check if GitCode has been used
    const { data: usageCount, error: usageError } = await supabaseServiceRole
      .from('GitCodeUsage')
      .select('id', { count: 'exact' })
      .eq('gitCodeId', id);

    if (usageError) {
      console.error('Error checking GitCode usage:', usageError);
    }

    // Delete GitCode usage records first
    if (usageCount && usageCount.length > 0) {
      const { error: deleteUsageError } = await supabaseServiceRole
        .from('GitCodeUsage')
        .delete()
        .eq('gitCodeId', id);

      if (deleteUsageError) {
        console.error('Error deleting GitCode usage records:', deleteUsageError);
        return NextResponse.json(
          { success: false, error: 'Không thể xóa các bản ghi sử dụng GitCode' },
          { status: 500 }
        );
      }
    }

    // Delete GitCode
    const { error: deleteError } = await supabaseServiceRole
      .from('GitCode')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting GitCode:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Không thể xóa GitCode' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa GitCode "${existingGitCode.code}" thành công`,
    });

  } catch (error) {
    console.error('Admin GitCode delete API error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
}

// GET - Get single GitCode details (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Get GitCode with usage statistics
    const { data: gitCode, error: gitCodeError } = await supabaseServiceRole
      .from('GitCode')
      .select('*')
      .eq('id', id)
      .single();

    if (gitCodeError || !gitCode) {
      return NextResponse.json(
        { success: false, error: 'GitCode không tồn tại' },
        { status: 404 }
      );
    }

    // Get usage details
    const { data: usageDetails, error: usageError } = await supabaseServiceRole
      .from('GitCodeUsage')
      .select(`
        id,
        usedAt,
        ipAddress,
        userAgent,
        userId
      `)
      .eq('gitCodeId', id)
      .order('usedAt', { ascending: false });

    if (usageError) {
      console.error('Error fetching GitCode usage details:', usageError);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...gitCode,
        usageDetails: usageDetails || [],
      },
    });

  } catch (error) {
    console.error('Admin GitCode get API error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
}
