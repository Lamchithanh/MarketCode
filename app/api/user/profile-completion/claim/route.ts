import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check if user profile is actually completed
    const { data: user, error: userError } = await supabaseServiceRole
      .from('User')
      .select('name, email, avatar, emailVerified')
      .eq('id', userId)
      .single();

    if (userError) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    // Verify profile completion
    const isProfileComplete = user.name && user.avatar && user.emailVerified;
    
    if (!isProfileComplete) {
      return NextResponse.json(
        { success: false, message: 'Hồ sơ chưa hoàn thành. Vui lòng hoàn tất tất cả thông tin cần thiết.' },
        { status: 400 }
      );
    }

    // Check if already claimed
    const { data: existingClaim, error: claimError } = await supabaseServiceRole
      .from('SystemSetting')
      .select('id')
      .eq('key', `profile_completion_claimed_${userId}`)
      .single();

    if (!claimError && existingClaim) {
      return NextResponse.json(
        { success: false, message: 'Bạn đã nhận phần thưởng này rồi.' },
        { status: 400 }
      );
    }

    // Fetch reward settings
    const { data: settings, error: settingsError } = await supabaseServiceRole
      .from('SystemSetting')
      .select('key, value')
      .in('key', [
        'profile_completion_reward_enabled',
        'profile_completion_coupon_code'
      ]);

    if (settingsError) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    // Check if reward is enabled
    if (settingsMap.profile_completion_reward_enabled !== 'true') {
      return NextResponse.json(
        { success: false, message: 'Phần thưởng hiện không khả dụng.' },
        { status: 400 }
      );
    }

    // Verify coupon exists and is valid
    const couponCode = settingsMap.profile_completion_coupon_code;
    const { data: coupon, error: couponError } = await supabaseServiceRole
      .from('Coupon')
      .select('*')
      .eq('code', couponCode)
      .eq('isActive', true)
      .single();

    if (couponError || !coupon) {
      return NextResponse.json(
        { success: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' },
        { status: 400 }
      );
    }

    // Check if coupon usage limit exceeded
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, message: 'Mã giảm giá đã hết lượt sử dụng.' },
        { status: 400 }
      );
    }

    // Check if coupon is still valid (date range)
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (now < validFrom || now > validUntil) {
      return NextResponse.json(
        { success: false, message: 'Mã giảm giá đã hết hạn.' },
        { status: 400 }
      );
    }

    // Record the claim
    const { error: recordError } = await supabaseServiceRole
      .from('SystemSetting')
      .insert({
        key: `profile_completion_claimed_${userId}`,
        value: new Date().toISOString(),
        type: 'string'
      });

    if (recordError) {
      console.error('Error recording claim:', recordError);
      return NextResponse.json(
        { success: false, error: 'Failed to record claim' },
        { status: 500 }
      );
    }

    // Update coupon usage count (optional - for statistics)
    await supabaseServiceRole
      .from('Coupon')
      .update({ 
        usageCount: coupon.usageCount + 1,
        updatedAt: new Date().toISOString()
      })
      .eq('code', couponCode);

    return NextResponse.json({
      success: true,
      message: 'Đã nhận phần thưởng thành công!',
      data: {
        couponCode,
        couponName: coupon.name,
        discount: coupon.value,
        type: coupon.type,
        minAmount: coupon.minAmount,
        maxAmount: coupon.maxAmount
      }
    });

  } catch (error) {
    console.error('Error claiming profile completion reward:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
