import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase-server";

// GET - Fetch all reviews with user and product data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    
    let query = supabaseServiceRole
      .from('Review')
      .select(`
        id,
        rating,
        comment,
        isHelpful,
        isApproved,
        createdAt,
        updatedAt,
        User:userId (
          id,
          name,
          email,
          avatar
        ),
        Product:productId (
          id,
          title
        )
      `)
      .is('deletedAt', null)
      .order('createdAt', { ascending: false });

    // Apply filters
    if (status === 'approved') {
      query = query.eq('isApproved', true);
    } else if (status === 'pending') {
      query = query.eq('isApproved', false);
    }

    const { data: reviews, error } = await query;

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    // Transform data to match frontend interface
    const transformedReviews = reviews?.map(review => ({
      id: review.id,
      userName: review.User?.name || 'Unknown User',
      userEmail: review.User?.email || '',
      userAvatar: review.User?.avatar || null,
      productTitle: review.Product?.title || 'Unknown Product',
      productId: review.Product?.id || '',
      rating: review.rating,
      comment: review.comment,
      isHelpful: review.isHelpful || 0,
      isApproved: review.isApproved,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    })) || [];

    // Apply search filter on transformed data
    let filteredReviews = transformedReviews;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredReviews = transformedReviews.filter(review =>
        review.userName.toLowerCase().includes(searchLower) ||
        review.userEmail.toLowerCase().includes(searchLower) ||
        review.productTitle.toLowerCase().includes(searchLower) ||
        (review.comment && review.comment.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json({
      reviews: filteredReviews,
      total: filteredReviews.length,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
