import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Get total products count
    const { count: totalProducts } = await supabaseServiceRole
      .from('Product')
      .select('*', { count: 'exact', head: true });

    // Get active products count
    const { count: activeProducts } = await supabaseServiceRole
      .from('Product')
      .select('*', { count: 'exact', head: true })
      .eq('isActive', true);

    // Get inactive products count
    const { count: inactiveProducts } = await supabaseServiceRole
      .from('Product')
      .select('*', { count: 'exact', head: true })
      .eq('isActive', false);

    // Get total revenue (sum of all product prices)
    const { data: revenueData } = await supabaseServiceRole
      .from('Product')
      .select('price');

    const totalRevenue = revenueData?.reduce((sum, product) => {
      return sum + (parseFloat(product.price) || 0);
    }, 0) || 0;

    // Get products by category
    const { data: categoryStats } = await supabaseServiceRole
      .from('Product')
      .select(`
        Category!inner(name)
      `);

    const categoryCounts = categoryStats?.reduce((acc, product) => {
      const categoryName = product.Category?.name || 'Khác';
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Get recent products (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recentProducts } = await supabaseServiceRole
      .from('Product')
      .select('*', { count: 'exact', head: true })
      .gte('createdAt', sevenDaysAgo.toISOString());

    // Get top performing products (by download count)
    const { data: topProducts } = await supabaseServiceRole
      .from('Product')
      .select('title, downloadCount, viewCount')
      .order('downloadCount', { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        inactiveProducts: inactiveProducts || 0,
        totalRevenue: totalRevenue.toFixed(2),
        recentProducts: recentProducts || 0,
        categoryBreakdown: categoryCounts,
        topProducts: topProducts || []
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
