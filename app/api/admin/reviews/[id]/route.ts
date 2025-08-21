import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase-server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch specific review by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    const { data: review, error } = await supabaseServiceRole
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
      .eq('id', id)
      .is('deletedAt', null)
      .single();

    if (error) {
      console.error('Error fetching review:', error);
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Transform data
    const transformedReview = {
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
    };

    return NextResponse.json({ review: transformedReview });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update review (approve/unapprove, edit)
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: any = {};
    
    // Only allow specific fields to be updated
    if (typeof body.isApproved === 'boolean') {
      updateData.isApproved = body.isApproved;
    }
    
    if (body.comment !== undefined) {
      updateData.comment = body.comment;
    }
    
    if (body.rating && body.rating >= 1 && body.rating <= 5) {
      updateData.rating = body.rating;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    updateData.updatedAt = new Date().toISOString();

    const { data, error } = await supabaseServiceRole
      .from('Review')
      .update(updateData)
      .eq('id', id)
      .is('deletedAt', null)
      .select()
      .single();

    if (error) {
      console.error('Error updating review:', error);
      return NextResponse.json(
        { error: 'Failed to update review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Review updated successfully',
      review: data
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete review
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    const { error } = await supabaseServiceRole
      .from('Review')
      .update({ 
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .is('deletedAt', null);

    if (error) {
      console.error('Error deleting review:', error);
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
