import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch user profile data
    const { data: user, error: userError } = await supabaseServiceRole
      .from('User')
      .select('name, email, avatar, emailVerified')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    // Fetch system settings for profile completion
    const { data: settings, error: settingsError } = await supabaseServiceRole
      .from('SystemSetting')
      .select('key, value')
      .in('key', [
        'profile_completion_reward_enabled',
        'profile_completion_coupon_code', 
        'profile_completion_required_fields',
        'profile_completion_reward_message'
      ]);

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    // Convert settings to object
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    // Parse required fields
    const requiredFields = JSON.parse(settingsMap.profile_completion_required_fields || '["name","avatar","emailVerified"]');
    
    // Check completion status
    const completedFields: string[] = [];
    const missingFields: string[] = [];

    requiredFields.forEach((field: string) => {
      if (field === 'name' && user.name) {
        completedFields.push(field);
      } else if (field === 'avatar' && user.avatar) {
        completedFields.push(field);
      } else if (field === 'emailVerified' && user.emailVerified) {
        completedFields.push(field);
      } else {
        missingFields.push(field);
      }
    });

    const percentage = Math.round((completedFields.length / requiredFields.length) * 100);
    const isCompleted = missingFields.length === 0;

    // Check if reward was already claimed
    let isClaimed = false;
    if (isCompleted && settingsMap.profile_completion_reward_enabled === 'true') {
      // Check if user already received the completion coupon
      const { data: existingClaim } = await supabaseServiceRole
        .from('SystemSetting')
        .select('value')
        .eq('key', `profile_completion_claimed_${userId}`)
        .single();
      
      isClaimed = !!existingClaim;
    }

    const completionStatus = {
      percentage,
      completedFields,
      missingFields,
      isCompleted,
      reward: isCompleted && settingsMap.profile_completion_reward_enabled === 'true' ? {
        couponCode: settingsMap.profile_completion_coupon_code,
        message: settingsMap.profile_completion_reward_message,
        isClaimed
      } : undefined
    };

    return NextResponse.json({
      success: true,
      data: completionStatus
    });

  } catch (error) {
    console.error('Error in profile completion API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
