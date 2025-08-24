import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

interface AdminProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  isActive: boolean;
  category: string;
  author: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
  downloadCount: number;
  viewCount: number;
  averageRating: number;
  totalReviews: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    // Build query
    let query = supabaseServiceRole
      .from('Product')
      .select(`
        *,
        Category!inner(name),
        User!inner(name, email)
      `)
      .order('createdAt', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('Category.name', category);
    }

    if (status) {
      if (status === 'active') {
        query = query.eq('isActive', true);
      } else if (status === 'inactive') {
        query = query.eq('isActive', false);
      }
    }

    // Get total count for pagination
    const { count } = await supabaseServiceRole
      .from('Product')
      .select('*', { count: 'exact', head: true });

    // Get paginated results
    const { data: products, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Transform data
    const transformedProducts: AdminProduct[] = products?.map(product => ({
      id: product.id?.toString() || '',
      title: product.title || '',
      description: product.description || '',
      price: parseFloat(product.price || '0'),
      isActive: product.isActive ?? true,
      category: product.Category?.name || 'Khác',
      author: product.User?.name || 'Unknown',
      authorEmail: product.User?.email || '',
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString(),
      downloadCount: product.downloadCount || 0,
      viewCount: product.viewCount || 0,
      averageRating: parseFloat(product.averageRating || '0') || 0,
      totalReviews: product.totalReviews || 0
    })) || [];

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, categoryId, technologies, demoUrl, githubUrl } = body;

    // Validate required fields
    if (!title || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create product
    const { data: product, error } = await supabaseServiceRole
      .from('Product')
      .insert({
        title,
        description,
        price: price.toString(),
        categoryId,
        technologies: technologies || [],
        demoUrl,
        githubUrl,
        isActive: true,
        userId: '1' // Default user ID, should be from auth context
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product
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
