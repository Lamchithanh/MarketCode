import { NextRequest, NextResponse } from 'next/server';
import { uploadTeamAvatar, ensureTeamAvatarsBucket } from '@/lib/team-avatar-storage';

export async function POST(request: NextRequest) {
  try {
    // Ensure bucket exists
    await ensureTeamAvatarsBucket();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const memberId = formData.get('memberId') as string;
    const oldAvatarUrl = formData.get('oldAvatarUrl') as string;

    if (!file || !memberId) {
      return NextResponse.json(
        {
          success: false,
          error: 'File và member ID là bắt buộc'
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Chỉ hỗ trợ file JPG, PNG, WEBP'
        },
        { status: 400 }
      );
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: 'File không được vượt quá 2MB'
        },
        { status: 400 }
      );
    }

    const result = await uploadTeamAvatar(memberId, file, oldAvatarUrl || undefined);

    if (result.success) {
      return NextResponse.json({
        success: true,
        url: result.url
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Lỗi upload ảnh'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Avatar upload API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Lỗi server khi upload ảnh'
      },
      { status: 500 }
    );
  }
}