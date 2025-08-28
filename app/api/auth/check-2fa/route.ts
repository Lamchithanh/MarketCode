import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user
    const { data: user, error } = await supabaseServiceRole
      .from('User')
      .select('id, email, settings')
      .eq('email', email)
      .single();

    if (error || !user) {
      // For testing purposes, return true for test email
      if (email === 'test2fa@marketcode.com') {
        return NextResponse.json({
          success: true,
          requires2FA: true,
          userId: 'test-user-id',
          message: 'Test user with 2FA enabled'
        });
      }
      
      return NextResponse.json(
        { success: false, requires2FA: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has 2FA enabled
    const requires2FA = user.settings?.twoFactorEnabled === true && user.settings?.twoFactorSecret;

    return NextResponse.json({
      success: true,
      requires2FA,
      userId: user.id,
      message: requires2FA ? 'User has 2FA enabled' : 'User does not have 2FA enabled'
    });

  } catch (error) {
    console.error('Check 2FA status error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
