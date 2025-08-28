import { NextRequest, NextResponse } from 'next/server';
import { TwoFactorService } from '@/lib/two-factor-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST - Verify và enable 2FA cho user
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
    const { secret, token, backupCodes } = body;

    if (!secret || !token || !backupCodes) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
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
        { success: false, error: result.error || 'Failed to verify 2FA' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true
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
