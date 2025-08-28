import { NextRequest, NextResponse } from 'next/server';
import { TwoFactorService } from '@/lib/two-factor-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Lấy trạng thái 2FA cho user thường
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const status = await TwoFactorService.getTwoFactorStatus(session.user.id);

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Failed to get 2FA status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      enabled: status.enabled,
      lastVerifiedAt: status.lastVerifiedAt
    });

  } catch (error) {
    console.error('Get 2FA status error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get 2FA status' 
      },
      { status: 500 }
    );
  }
}

// POST - Setup 2FA cho user thường
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

    const setupData = await TwoFactorService.setupTwoFactorForUser(session.user.id);

    if (!setupData) {
      return NextResponse.json(
        { success: false, error: 'Failed to setup 2FA' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      secret: setupData.secret,
      qrCodeUrl: setupData.qrCodeUrl,
      backupCodes: setupData.backupCodes,
      manualEntryKey: setupData.manualEntryKey
    });

  } catch (error) {
    console.error('Setup 2FA error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to setup 2FA' 
      },
      { status: 500 }
    );
  }
}
