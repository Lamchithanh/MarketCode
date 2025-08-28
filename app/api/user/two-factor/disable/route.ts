import { NextRequest, NextResponse } from 'next/server';
import { TwoFactorService } from '@/lib/two-factor-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST - Disable 2FA cho user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    // TODO: Verify password trước khi disable
    // Tạm thời skip password verification

    const result = await TwoFactorService.disableTwoFactor(session.user.id, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to disable 2FA' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Disable 2FA error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to disable 2FA' 
      },
      { status: 500 }
    );
  }
}
