import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Get all users with 2FA settings
    const { data: users, error } = await supabaseServiceRole
      .from('User')
      .select('email, settings')
      .not('settings', 'is', null);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      users: users?.map(user => ({
        email: user.email,
        has2FA: user.settings?.twoFactorEnabled === true,
        hasSecret: !!user.settings?.twoFactorSecret,
        settings: user.settings
      }))
    });

  } catch (error) {
    console.error('Debug users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
