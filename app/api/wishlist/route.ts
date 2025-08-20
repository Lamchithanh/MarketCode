import { NextRequest, NextResponse } from 'next/server';
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

    // Lấy wishlist items từ database
    const { data: wishlistItems, error } = await supabaseServiceRole
      .from('Wishlist')
      .select(`
        id,
        productId,
        Product (
          id,
          title,
          price,
          thumbnailUrl
        )
      `)
      .eq('userId', session.user.id)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching wishlist:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch wishlist' },
        { status: 500 }
      );
    }

    // Transform data để match interface
    const transformedItems = wishlistItems?.map(item => ({
      id: item.id,
      title: (item.Product as any)?.title || 'Unknown Product',
      price: (item.Product as any)?.price || 0,
      image: (item.Product as any)?.thumbnailUrl || '/placeholder.jpg'
    })) || [];

    return NextResponse.json({
      success: true,
      data: transformedItems
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if item already exists in wishlist
    const { data: existing, error: checkError } = await supabaseServiceRole
      .from('Wishlist')
      .select('id')
      .eq('userId', session.user.id)
      .eq('productId', productId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking wishlist:', checkError);
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Item already in wishlist' },
        { status: 400 }
      );
    }

    // Add to wishlist
    const { error: insertError } = await supabaseServiceRole
      .from('Wishlist')
      .insert({
        userId: session.user.id,
        productId: productId
      });

    if (insertError) {
      console.error('Error adding to wishlist:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to add to wishlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Added to wishlist'
    });

  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, wishlistId } = body;

    if (!productId && !wishlistId) {
      return NextResponse.json(
        { success: false, error: 'Product ID or Wishlist ID is required' },
        { status: 400 }
      );
    }

    let query = supabaseServiceRole
      .from('Wishlist')
      .delete()
      .eq('userId', session.user.id);

    if (wishlistId) {
      query = query.eq('id', wishlistId);
    } else {
      query = query.eq('productId', productId);
    }

    const { error: deleteError } = await query;

    if (deleteError) {
      console.error('Error removing from wishlist:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to remove from wishlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Removed from wishlist'
    });

  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
