import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Verify user has purchased this product or it's free
    const { data: product, error: productError } = await adminSupabase
      .from('Product')
      .select(`
        id,
        title,
        fileUrl,
        price,
        isActive,
        deletedAt,
        userId
      `)
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.isActive || product.deletedAt) {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 403 }
      );
    }

    if (!product.fileUrl) {
      return NextResponse.json(
        { error: 'Product file not available' },
        { status: 404 }
      );
    }

    // Check if user has purchased this product (if it's not free)
    if (product.price > 0) {
      const { data: orderItem, error: orderError } = await adminSupabase
        .from('OrderItem')
        .select(`
          id,
          Order!inner(
            buyerId,
            status,
            paymentStatus
          )
        `)
        .eq('productId', productId)
        .eq('Order.buyerId', userId)
        .eq('Order.status', 'COMPLETED')
        .eq('Order.paymentStatus', 'PAID')
        .limit(1);

      if (orderError) {
        console.error('Error checking purchase:', orderError);
        return NextResponse.json(
          { error: 'Error verifying purchase' },
          { status: 500 }
        );
      }

      if (!orderItem || orderItem.length === 0) {
        return NextResponse.json(
          { error: 'Product not purchased or payment not completed' },
          { status: 403 }
        );
      }
    }

    // Track the download
    const trackResponse = await fetch(
      `${request.nextUrl.origin}/api/downloads/track`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
          'x-real-ip': request.headers.get('x-real-ip') || '',
          'user-agent': request.headers.get('user-agent') || '',
        },
        body: JSON.stringify({
          userId,
          productId,
        }),
      }
    );

    if (!trackResponse.ok) {
      console.warn('Failed to track download');
    }

    // Generate secure download URL or redirect to file
    if (product.fileUrl.startsWith('http')) {
      // External URL - redirect
      return NextResponse.redirect(product.fileUrl);
    } else {
      // Internal storage - generate signed URL
      const { data: signedUrlData, error: signedUrlError } = await adminSupabase
        .storage
        .from('products')
        .createSignedUrl(product.fileUrl, 3600); // 1 hour expiry

      if (signedUrlError) {
        console.error('Error creating signed URL:', signedUrlError);
        return NextResponse.json(
          { error: 'Error generating download link' },
          { status: 500 }
        );
      }

      return NextResponse.redirect(signedUrlData.signedUrl);
    }

  } catch (error) {
    console.error('Error in download API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
