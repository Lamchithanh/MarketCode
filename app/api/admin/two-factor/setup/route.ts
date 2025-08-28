import { NextRequest, NextResponse } from 'next/server';
import { TwoFactorService } from '@/lib/two-factor-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Lấy trạng thái 2FA
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Chỉ admin mới được truy cập 2FA
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
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

// POST - Setup 2FA (tạo secret và QR code)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Chỉ admin mới được setup 2FA
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    const result = await TwoFactorService.setupTwoFactor(session.user.id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to setup 2FA' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      qrCodeUrl: result.qrCodeUrl,
      secret: result.secret,
      backupCodes: result.backupCodes,
      manualEntryKey: result.manualEntryKey
    });

  } catch (error) {
    console.error('Setup 2FA error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to setup 2FA' 
      },
      { status: 500 }
    );
  }
}
