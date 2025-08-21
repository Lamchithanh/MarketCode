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

    // Fetch user stats từ database - including 5 focused tasks
    const [ordersResult, wishlistResult, reviewsResult, cartResult, shareResult, gitCodeUsageResult] = await Promise.all([
      // Total orders và spending
      supabaseServiceRole
        .from('Order')
        .select('totalAmount, status')
        .eq('buyerId', userId),
      
      // Wishlist count
      supabaseServiceRole
        .from('Wishlist')
        .select('id')
        .eq('userId', userId),
      
      // Reviews count và average rating
      supabaseServiceRole
        .from('Review')
        .select('rating')
        .eq('userId', userId),

      // Cart items count
      supabaseServiceRole
        .from('Cart')
        .select('id')
        .eq('userId', userId),

      // Product shares count
      supabaseServiceRole
        .from('ProductShare')
        .select('id')
        .eq('userId', userId),

      // GitCode usage count
      supabaseServiceRole
        .from('GitCodeUsage')
        .select('id')
        .eq('userId', userId)
    ]);

    if (ordersResult.error || wishlistResult.error || reviewsResult.error || 
        cartResult.error || shareResult.error || gitCodeUsageResult.error) {
      console.error('Error fetching stats:', {
        orders: ordersResult.error,
        wishlist: wishlistResult.error,
        reviews: reviewsResult.error,
        cart: cartResult.error,
        share: shareResult.error,
        gitCodeUsage: gitCodeUsageResult.error
      });
      return NextResponse.json(
        { success: false, error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    const orders = ordersResult.data || [];
    const wishlist = wishlistResult.data || [];
    const reviews = reviewsResult.data || [];
    const cartItems = cartResult.data || [];
    const productShares = shareResult.data || [];
    const gitCodeUsages = gitCodeUsageResult.data || [];

    // Calculate stats
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const downloads = orders.filter(order => order.status === 'COMPLETED').length;
    const wishlistCount = wishlist.length;
    const reviewsCount = reviews.length;
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    // Get user member since date
    const { data: userData } = await supabaseServiceRole
      .from('User')
      .select('createdAt')
      .eq('id', userId)
      .single();

    const stats = {
      totalOrders,
      totalSpent,
      downloads,
      wishlist: wishlistCount,
      reviews: reviewsCount,
      averageRating: Math.round(averageRating * 10) / 10,
      memberSince: userData?.createdAt || new Date().toISOString(),
      // Add new task-related stats
      cartItems: cartItems.length,
      productShares: productShares.length,
      gitCodeUsages: gitCodeUsages.length
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
