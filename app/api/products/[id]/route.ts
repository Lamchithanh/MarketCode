import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Lấy product từ database với thông tin category
    const { data: product, error } = await supabaseServiceRole
      .from('Product')
      .select(`
        *,
        Category(
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .eq('isActive', true)
      .is('deletedAt', null)
      .single();

    if (error || !product) {
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Product not found' 
        },
        { status: 404 }
      );
    }

    // Transform data để match với component interface
    const transformedProduct = {
      id: product.id,
      title: product.title,
      description: product.description || '',
      price: product.price,
      originalPrice: null, // TODO: Add originalPrice field to Product table if needed
      thumbnailUrl: product.thumbnailUrl || '/Images/images.png',
      downloadCount: product.downloadCount || 0,
      viewCount: product.viewCount || 0,
      fileUrl: product.fileUrl,
      demoUrl: product.demoUrl,
      githubUrl: product.githubUrl,
      fileSize: product.fileSize,
      images: product.images || [],
      features: product.features || null,
      technologies: product.technologies || [],
      userId: product.userId,
      Category: product.Category,
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
