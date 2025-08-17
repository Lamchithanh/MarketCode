import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/lib/services/category-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await categoryService.getCategories({ search, page, limit });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/admin/categories:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, icon } = body;

    if (!name) {
      return NextResponse.json(
        { error: true, message: 'Name is required' },
        { status: 400 }
      );
    }

    const category = await categoryService.createCategory({ name, slug, description, icon });
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/categories:', error);
    const message = error instanceof Error ? error.message : 'Failed to create category';
    return NextResponse.json(
      { error: true, message },
      { status: 500 }
    );
  }
}
