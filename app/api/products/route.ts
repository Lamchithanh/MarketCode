import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Lấy products từ database với thông tin category
    const { data: products, error } = await supabaseServiceRole
      .from('Product')
      .select(`
        *,
        Category!inner(name)
      `)
      .eq('isActive', true)
      .is('deletedAt', null)
      .order('createdAt', { ascending: false })
      .limit(6); // Lấy 6 sản phẩm mới nhất

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Transform data để match với interface Project
    const transformedProducts = products?.map(product => ({
      id: product.id.toString(),
      title: product.title,
      description: product.description || '',
      image: product.thumbnailUrl || '/products/default.jpg',
      technologies: product.technologies || [],
      category: product.Category?.name || 'Khác',
      price: `${parseFloat(product.price).toLocaleString('vi-VN')}đ`,
      rating: parseFloat(product.averageRating) || 0, // Use database rating
      reviews: product.totalReviews || 0, // Use database reviews count
      averageRating: parseFloat(product.averageRating) || 0, // New field
      totalReviews: product.totalReviews || 0, // New field
      downloadCount: product.downloadCount || 0,
      viewCount: product.viewCount || 0,
      demoUrl: product.demoUrl,
      githubUrl: product.githubUrl,
      thumbnailUrl: product.thumbnailUrl
    })) || [];

    return NextResponse.json({
      success: true,
      products: transformedProducts
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
