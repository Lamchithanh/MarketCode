import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data: categories, error } = await supabaseServiceRole
      .from('Category')
      .select(`
        *,
        Product!inner(count)
      `)
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    // Transform data to include product count
    const transformedCategories = categories?.map(category => ({
      id: category.id?.toString() || '',
      name: category.name || '',
      description: category.description || '',
      isActive: category.isActive ?? true,
      productCount: category.Product?.length || 0,
      createdAt: category.createdAt || new Date().toISOString(),
      updatedAt: category.updatedAt || new Date().toISOString()
    })) || [];

    return NextResponse.json({
      success: true,
      categories: transformedCategories
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
