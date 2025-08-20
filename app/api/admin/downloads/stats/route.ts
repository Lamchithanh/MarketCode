import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface ProductDownloadItem {
  productId: string;
  Product: Array<{
    title: string;
  }>;
}

// Admin client with service role for admin operations
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';

    // Get total downloads count
    const { count: totalDownloads, error: totalError } = await adminSupabase
      .from('Download')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '7d':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case '1y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 30));
    }

    // Get downloads by date range
    const { count: recentDownloads, error: recentError } = await adminSupabase
      .from('Download')
      .select('*', { count: 'exact', head: true })
      .gte('createdAt', startDate.toISOString());

    if (recentError) throw recentError;

    // Get unique users count
    const { data: uniqueUsersData, error: usersError } = await adminSupabase
      .from('Download')
      .select('userId');

    if (usersError) throw usersError;

    const uniqueUsers = new Set(uniqueUsersData?.map(d => d.userId)).size;

    // Get top downloaded products
    const { data: productDownloads, error: productError } = await adminSupabase
      .from('Download')
      .select(`
        productId,
        Product!inner(title)
      `);

    if (productError) throw productError;

    // Count downloads per product
    const productCounts = (productDownloads || []).reduce((acc: Record<string, number>, item: ProductDownloadItem) => {
      const title = item.Product?.[0]?.title || 'Unknown Product';
      acc[title] = (acc[title] || 0) + 1;
      return acc;
    }, {});

    const topProducts = Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Get downloads by date for chart data
    const { data: chartData, error: chartError } = await adminSupabase
      .from('Download')
      .select('createdAt')
      .gte('createdAt', startDate.toISOString())
      .order('createdAt', { ascending: true });

    if (chartError) throw chartError;

    // Group downloads by date
    const downloadsByDate = (chartData || []).reduce((acc: Record<string, number>, download) => {
      const date = new Date(download.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      data: {
        totalDownloads: totalDownloads || 0,
        recentDownloads: recentDownloads || 0,
        uniqueUsers,
        topProducts,
        downloadsByDate,
        timeRange,
        completedDownloads: totalDownloads || 0, // All downloads in DB are completed
        failedDownloads: 0, // Failed downloads not stored in DB
        pendingDownloads: 0, // Pending downloads not stored in DB
      }
    });

  } catch (error) {
    console.error('Error fetching download stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch download statistics' },
      { status: 500 }
    );
  }
}
