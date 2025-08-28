import { NextRequest, NextResponse } from 'next/server';
import { TwoFactorService } from '@/lib/two-factor-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST - Xác thực 2FA token
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Chỉ admin mới được authenticate 2FA
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const result = await TwoFactorService.verifyTwoFactor(session.user.id, token);

    return NextResponse.json({
      success: result.success,
      error: result.error
    });

  } catch (error) {
    console.error('Authenticate 2FA error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to authenticate 2FA' 
      },
      { status: 500 }
    );
  }
}
