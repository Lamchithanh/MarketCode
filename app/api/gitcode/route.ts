import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';
import { supabaseServiceRole } from '@/lib/supabase-server';

// GET - Lấy danh sách GitCode (cho admin) hoặc sử dụng mã (cho user)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code'); // Mã gitcode để sử dụng
    const isAdmin = searchParams.get('admin') === 'true'; // Admin xem danh sách

    // Nếu là admin xem danh sách
    if (isAdmin) {
      // TEMPORARY: Disable auth for testing - REMEMBER TO RE-ENABLE IN PRODUCTION
      // const session = await getServerSession(authOptions);
      // if (!session || session.user.role !== 'admin') {
      //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      // }

      const { data, error } = await supabaseServiceRole
        .from('GitCode')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ data });
    }

    // Nếu user nhập mã để sử dụng
    if (code) {
      const { data: gitcode, error } = await supabaseServiceRole
        .from('GitCode')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !gitcode) {
        return NextResponse.json({ 
          error: 'Mã không hợp lệ hoặc đã hết hạn' 
        }, { status: 404 });
      }

      // Kiểm tra hạn sử dụng
      if (gitcode.expire_date && new Date() > new Date(gitcode.expire_date)) {
        return NextResponse.json({ 
          error: 'Mã đã hết hạn sử dụng' 
        }, { status: 400 });
      }

      // Kiểm tra số lần sử dụng
      if (gitcode.usage_limit !== -1 && gitcode.times_used >= gitcode.usage_limit) {
        return NextResponse.json({ 
          error: 'Mã đã hết lượt sử dụng' 
        }, { status: 400 });
      }

      // Tăng số lần sử dụng
      const { error: updateError } = await supabaseServiceRole
        .from('GitCode')
        .update({ 
          times_used: gitcode.times_used + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', gitcode.id);

      if (updateError) throw updateError;

      return NextResponse.json({
        success: true,
        data: {
          description: gitcode.description,
          repo_url: gitcode.repo_url,
          usage_info: `Đã sử dụng ${gitcode.times_used + 1}/${gitcode.usage_limit === -1 ? '∞' : gitcode.usage_limit} lần`
        }
      });
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('GitCode API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Tạo mã GitCode mới (chỉ admin)
export async function POST(request: NextRequest) {
  try {
    // TEMPORARY: Disable auth for testing - REMEMBER TO RE-ENABLE IN PRODUCTION
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const {
      code,
      repo_url,
      description,
      expire_date,
      usage_limit
    } = body;

    // Validate required fields
    if (!code || !repo_url) {
      return NextResponse.json({ 
        error: 'Mã code và repo URL là bắt buộc' 
      }, { status: 400 });
    }

    // Xử lý usage_limit: null/undefined/0 = unlimited (-1), còn lại giữ nguyên
    let finalUsageLimit = -1; // Mặc định là vô hạn
    if (usage_limit !== undefined && usage_limit !== null && usage_limit !== 0) {
      finalUsageLimit = usage_limit;
    }

    const { data, error } = await supabaseServiceRole
      .from('GitCode')
      .insert({
        code: code.toUpperCase(),
        repo_url,
        description,
        expire_date: expire_date ? new Date(expire_date).toISOString() : null,
        usage_limit: finalUsageLimit,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ 
          error: 'Mã code đã tồn tại' 
        }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Create GitCode Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật mã GitCode (chỉ admin)
export async function PUT(request: NextRequest) {
  try {
    // TEMPORARY: Disable auth for testing - REMEMBER TO RE-ENABLE IN PRODUCTION
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const {
      id,
      code,
      repo_url,
      description,
      expire_date,
      usage_limit,
      is_active
    } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (code !== undefined) updateData.code = code.toUpperCase();
    if (repo_url !== undefined) updateData.repo_url = repo_url;
    if (description !== undefined) updateData.description = description;
    if (expire_date !== undefined) updateData.expire_date = expire_date ? new Date(expire_date).toISOString() : null;
    if (usage_limit !== undefined) {
      // null/undefined/0 = unlimited (-1), còn lại giữ nguyên
      updateData.usage_limit = (usage_limit === null || usage_limit === 0) ? -1 : usage_limit;
    }
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseServiceRole
      .from('GitCode')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'GitCode not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Update GitCode Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Xóa mã GitCode (chỉ admin)
export async function DELETE(request: NextRequest) {
  try {
    // TEMPORARY: Disable auth for testing - REMEMBER TO RE-ENABLE IN PRODUCTION
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabaseServiceRole
      .from('GitCode')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'GitCode deleted successfully'
    });

  } catch (error) {
    console.error('Delete GitCode Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
