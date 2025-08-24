import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Get total users count
    const { count: totalUsers, error: usersError } = await supabaseServiceRole
      .from('User')
      .select('*', { count: 'exact', head: true });

    if (usersError) {
      console.error('Error fetching users count:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch users statistics' },
        { status: 500 }
      );
    }

    // Get users who have verified their email (emailVerified is not null)
    const { count: verifiedUsers, error: verifiedUsersError } = await supabaseServiceRole
      .from('User')
      .select('*', { count: 'exact', head: true })
      .not('emailVerified', 'is', null);

    // Get admin users count
    const { count: adminUsers, error: adminUsersError } = await supabaseServiceRole
      .from('User')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'ADMIN');

    // Get users created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: recentUsers, error: recentUsersError } = await supabaseServiceRole
      .from('User')
      .select('*', { count: 'exact', head: true })
      .gte('createdAt', thirtyDaysAgo.toISOString());

    // Get users who have made purchases (have orders)
    const { data: buyingUsers, error: buyingUsersError } = await supabaseServiceRole
      .from('Order')
      .select('buyerId', { head: false })
      .not('buyerId', 'is', null);

    let uniqueBuyers = 0;
    if (!buyingUsersError && buyingUsers) {
      const uniqueBuyerIds = new Set(buyingUsers.map(o => o.buyerId));
      uniqueBuyers = uniqueBuyerIds.size;
    }

    return NextResponse.json({
      total: totalUsers || 0,
      verified: verifiedUsers || 0,
      unverified: (totalUsers || 0) - (verifiedUsers || 0),
      admins: adminUsers || 0,
      regular: (totalUsers || 0) - (adminUsers || 0),
      recent: recentUsers || 0,
      buyers: uniqueBuyers
    });

  } catch (error) {
    console.error('Error in users stats API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
