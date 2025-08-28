import { NextRequest, NextResponse } from 'next/server';
import { TwoFactorService } from '@/lib/two-factor-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST - Verify và enable 2FA
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Chỉ admin mới được verify 2FA
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { secret, token, backupCodes } = await request.json();

    if (!secret || !token || !backupCodes) {
      return NextResponse.json(
        { success: false, error: 'Secret, token and backup codes are required' },
        { status: 400 }
      );
    }

    const result = await TwoFactorService.enableTwoFactor(
      session.user.id, 
      secret, 
      token,
      backupCodes
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '2FA has been enabled successfully'
    });

  } catch (error) {
    console.error('Verify 2FA error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to verify 2FA' 
      },
      { status: 500 }
    );
  }
}
