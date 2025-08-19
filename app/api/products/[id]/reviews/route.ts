import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch reviews for the product with user information
    const { data: reviews, error } = await supabaseServiceRole
      .from('Review')
      .select(`
        id,
        productId,
        userId,
        rating,
        comment,
        isApproved,
        isHelpful,
        createdAt,
        updatedAt,
        User!inner(
          id,
          name,
          email,
          avatar
        )
      `)
      .eq('productId', id)
      .is('deletedAt', null)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to fetch reviews' 
        },
        { status: 500 }
      );
    }

    // Transform the data to include user name
    const formattedReviews = (reviews || []).map((review: any) => ({
      id: review.id,
      productId: review.productId || id,
      userId: review.userId,
      userName: Array.isArray(review.User) ? review.User[0]?.name : review.User?.name || 'Anonymous User',
      rating: review.rating,
      comment: review.comment,
      isApproved: review.isApproved || false,
      createdAt: review.createdAt
    }));

    return NextResponse.json({
      success: true,
      reviews: formattedReviews
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
