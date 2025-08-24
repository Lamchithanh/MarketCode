import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service role client for admin operations
const supabaseServiceRole = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get total downloads count
    const { count: totalDownloads, error: downloadsError } = await supabaseServiceRole
      .from('Download')
      .select('*', { count: 'exact', head: true });

    if (downloadsError) {
      console.error('Error fetching downloads count:', downloadsError);
      return NextResponse.json(
        { error: 'Failed to fetch downloads statistics' },
        { status: 500 }
      );
    }

    // Get unique users who have downloads
    const { data: uniqueUsersData, error: uniqueUsersError } = await supabaseServiceRole
      .from('Download')
      .select('userId', { head: false })
      .not('userId', 'is', null);

    let uniqueUsers = 0;
    if (!uniqueUsersError && uniqueUsersData) {
      const uniqueUserIds = new Set(uniqueUsersData.map(d => d.userId));
      uniqueUsers = uniqueUserIds.size;
    }

    // Get downloads from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: recentDownloads, error: recentDownloadsError } = await supabaseServiceRole
      .from('Download')
      .select('*', { count: 'exact', head: true })
      .gte('createdAt', thirtyDaysAgo.toISOString());

    if (recentDownloadsError) {
      console.error('Error fetching recent downloads:', recentDownloadsError);
    }

    return NextResponse.json({
      success: true,
      data: {
        total: totalDownloads || 0,
        uniqueUsers: uniqueUsers,
        recentDownloads: recentDownloads || 0
      }
    });

  } catch (error) {
    console.error('Error in downloads stats API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
