import { NextRequest, NextResponse } from 'next/server';
import { TwoFactorService } from '@/lib/two-factor-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Lấy trạng thái toggle 2FA system
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Chỉ admin mới được xem system settings
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const enabled = await TwoFactorService.is2FAEnabledForSystem();

    return NextResponse.json({
      success: true,
      enabled
    });

  } catch (error) {
    console.error('Get 2FA system status error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get 2FA system status' 
      },
      { status: 500 }
    );
  }
}

// POST - Toggle 2FA cho toàn hệ thống
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Chỉ admin mới được toggle system 2FA
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { enabled } = await request.json();

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Enabled must be a boolean value' },
        { status: 400 }
      );
    }

    const result = await TwoFactorService.toggle2FAForSystem(enabled);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `2FA system has been ${enabled ? 'enabled' : 'disabled'} successfully`,
      enabled
    });

  } catch (error) {
    console.error('Toggle 2FA system error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to toggle 2FA system' 
      },
      { status: 500 }
    );
  }
}
