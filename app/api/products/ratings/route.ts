import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { productIds } = await request.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Product IDs are required'
      }, { status: 400 });
    }

    // Fetch review statistics for all products at once
    const { data: reviews, error } = await supabaseServiceRole
      .from('Review')
      .select('productId, rating, isApproved')
      .in('productId', productIds)
      .is('deletedAt', null);

    if (error) {
      console.error('Error fetching product ratings:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch ratings' },
        { status: 500 }
      );
    }

    // Process reviews to calculate statistics for each product
    const ratingsMap: Record<string, any> = {};

    productIds.forEach(productId => {
      const productReviews = (reviews || []).filter(
        review => review.productId === productId && review.isApproved
      );

      const totalReviews = productReviews.length;
      
      if (totalReviews > 0) {
        const averageRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        
        const ratingDistribution = {
          1: productReviews.filter(r => r.rating === 1).length,
          2: productReviews.filter(r => r.rating === 2).length,
          3: productReviews.filter(r => r.rating === 3).length,
          4: productReviews.filter(r => r.rating === 4).length,
          5: productReviews.filter(r => r.rating === 5).length,
        };

        ratingsMap[productId] = {
          productId,
          averageRating: Number(averageRating.toFixed(1)),
          totalReviews,
          ratingDistribution
        };
      } else {
        ratingsMap[productId] = {
          productId,
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }
    });

    return NextResponse.json({
      success: true,
      ratings: ratingsMap
    });

  } catch (error) {
    console.error('Error in ratings API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
