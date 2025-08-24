import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    let query = supabaseServiceRole
      .from('Category')
      .select('*', { count: 'exact' })
      .is('deletedAt', null); // Only active categories

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data: categories, error, count } = await query
      .range(from, to)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    // Get product counts for all categories in one query
    const { data: productCounts } = await supabaseServiceRole
      .from('Product')
      .select('categoryId')
      .is('deletedAt', null);

    // Count products per category
    const productCountMap = (productCounts || []).reduce((acc, product) => {
      acc[product.categoryId] = (acc[product.categoryId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Transform data using the product count map
    const transformedCategories = (categories || []).map((category) => ({
      id: category.id?.toString() || '',
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      icon: category.icon || null,
      productCount: productCountMap[category.id] || 0,
      createdAt: category.createdAt || new Date().toISOString(),
      updatedAt: category.updatedAt || new Date().toISOString(),
      deletedAt: category.deletedAt || null
    }));

    // Return paginated format
    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      categories: transformedCategories,
      total: count || 0,
      page: page,
      limit: limit,
      totalPages: totalPages
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if category already exists
    const { data: existingCategory } = await supabaseServiceRole
      .from('Category')
      .select('id')
      .eq('name', name)
      .single();

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      );
    }

    // Create new category
    const { data: category, error } = await supabaseServiceRole
      .from('Category')
      .insert({
        name,
        description: description || '',
        isActive: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      category
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
