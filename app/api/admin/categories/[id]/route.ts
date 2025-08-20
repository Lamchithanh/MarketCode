import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/lib/services/category-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await categoryService.getCategoryById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: true, message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error in GET /api/admin/categories/[id]:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, icon } = body;

    if (!name) {
      return NextResponse.json(
        { error: true, message: 'Name is required' },
        { status: 400 }
      );
    }

    const category = await categoryService.updateCategory(id, { name, slug, description, icon });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error in PUT /api/admin/categories/[id]:', error);
    const message = error instanceof Error ? error.message : 'Failed to update category';
    return NextResponse.json(
      { error: true, message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await categoryService.deleteCategory(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/categories/[id]:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete category';
    return NextResponse.json(
      { error: true, message },
      { status: 500 }
    );
  }
}
