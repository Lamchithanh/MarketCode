import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseServiceRole } from '@/lib/supabase-server';

// GET - List all GitCodes (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    const { data: gitCodes, error } = await supabaseServiceRole
      .from('GitCode')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching GitCodes:', error);
      return NextResponse.json(
        { success: false, error: 'Không thể tải danh sách GitCode' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: gitCodes || [],
    });

  } catch (error) {
    console.error('Admin GitCode list API error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
}

// POST - Create new GitCode (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { code, repo_url, description, expire_date, usage_limit, is_active } = body;

    // Validation
    if (!code || !repo_url || !description) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const { data: existingCode, error: checkError } = await supabaseServiceRole
      .from('GitCode')
      .select('id')
      .eq('code', code.trim().toUpperCase())
      .single();

    if (existingCode && !checkError) {
      return NextResponse.json(
        { success: false, error: 'Mã GitCode này đã tồn tại' },
        { status: 400 }
      );
    }

    // Create new GitCode
    const gitCodeData = {
      code: code.trim().toUpperCase(),
      repo_url: repo_url.trim(),
      description: description.trim(),
      expire_date: expire_date ? new Date(expire_date).toISOString() : null,
      usage_limit: parseInt(usage_limit) || -1, // -1 means unlimited
      times_used: 0,
      is_active: is_active !== undefined ? is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseServiceRole
      .from('GitCode')
      .insert(gitCodeData)
      .select()
      .single();

    if (error) {
      console.error('Error creating GitCode:', error);
      return NextResponse.json(
        { success: false, error: 'Không thể tạo GitCode' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã tạo GitCode "${code}" thành công`,
      data: data,
    });

  } catch (error) {
    console.error('Admin GitCode create API error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
}
