import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Lấy product từ database với thông tin category và reviews
    const { data: product, error } = await supabaseServiceRole
      .from('Product')
      .select(`
        *,
        Category!inner(name),
        Review(rating, comment, createdAt, User(name))
      `)
      .eq('id', id)
      .eq('isActive', true)
      .is('deletedAt', null)
      .single();

    if (error || !product) {
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate average rating from reviews
    const reviews = product.Review || [];
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / reviews.length
      : 4.5; // Default rating

    // Transform data để match với interface Project
    const transformedProduct = {
      id: product.id.toString(),
      title: product.title,
      description: product.description || '',
      image: product.thumbnailUrl || '/products/default.jpg',
      technologies: product.technologies || [],
      category: product.Category?.name || 'Khác',
      price: `${parseFloat(product.price).toLocaleString('vi-VN')}đ`,
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      reviews: reviews.length,
      downloadCount: product.downloadCount || 0,
      viewCount: product.viewCount || 0,
      fileUrl: product.fileUrl,
      demoUrl: product.demoUrl,
      githubUrl: product.githubUrl,
      fileSize: product.fileSize,
      images: product.images || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };

    // Update view count
    await supabaseServiceRole
      .from('Product')
      .update({ viewCount: (product.viewCount || 0) + 1 })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      product: transformedProduct
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
