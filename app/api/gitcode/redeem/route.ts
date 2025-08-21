import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập để sử dụng GitCode' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code } = body;

    if (!code || !code.trim()) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập mã GitCode' },
        { status: 400 }
      );
    }

    const trimmedCode = code.trim().toUpperCase();
    const userId = session.user.id;

    // Check if GitCode exists and is valid
    const { data: gitCode, error: gitCodeError } = await supabaseServiceRole
      .from('GitCode')
      .select('*')
      .eq('code', trimmedCode)
      .eq('is_active', true)
      .single();

    if (gitCodeError || !gitCode) {
      return NextResponse.json(
        { success: false, error: 'Mã GitCode không tồn tại hoặc đã bị vô hiệu hóa' },
        { status: 404 }
      );
    }

    // Check expiration date
    if (gitCode.expire_date && new Date(gitCode.expire_date) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Mã GitCode đã hết hạn sử dụng' },
        { status: 400 }
      );
    }

    // Check usage limit
    if (gitCode.usage_limit > 0 && gitCode.times_used >= gitCode.usage_limit) {
      return NextResponse.json(
        { success: false, error: 'Mã GitCode đã đạt giới hạn sử dụng' },
        { status: 400 }
      );
    }

    // Check if user has already used this GitCode
    const { data: existingUsage, error: usageCheckError } = await supabaseServiceRole
      .from('GitCodeUsage')
      .select('id')
      .eq('userId', userId)
      .eq('gitCodeId', gitCode.id)
      .single();

    if (existingUsage && !usageCheckError) {
      return NextResponse.json(
        { success: false, error: 'Bạn đã sử dụng mã GitCode này rồi' },
        { status: 400 }
      );
    }

    // Record the usage
    const { error: usageInsertError } = await supabaseServiceRole
      .from('GitCodeUsage')
      .insert({
        userId: userId,
        gitCodeId: gitCode.id,
        usedAt: new Date().toISOString(),
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   request.ip || 
                   'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      });

    if (usageInsertError) {
      console.error('Error recording GitCode usage:', usageInsertError);
      return NextResponse.json(
        { success: false, error: 'Không thể ghi nhận việc sử dụng GitCode' },
        { status: 500 }
      );
    }

    // Update usage count
    const { error: updateError } = await supabaseServiceRole
      .from('GitCode')
      .update({ 
        times_used: gitCode.times_used + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', gitCode.id);

    if (updateError) {
      console.error('Error updating GitCode usage count:', updateError);
      // Don't fail the whole operation for this
    }

    // Return success with GitCode details
    return NextResponse.json({
      success: true,
      message: `Đã sử dụng mã GitCode "${trimmedCode}" thành công! Truy cập repository ngay.`,
      data: {
        code: gitCode.code,
        repo_url: gitCode.repo_url,
        description: gitCode.description
      }
    });

  } catch (error) {
    console.error('GitCode redeem API error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi server. Vui lòng thử lại!' },
      { status: 500 }
    );
  }
}
