import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/lib/services/category-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await categoryService.restoreCategory(id);
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error in POST /api/admin/categories/[id]/restore:', error);
    const message = error instanceof Error ? error.message : 'Failed to restore category';
    return NextResponse.json(
      { error: true, message },
      { status: 500 }
    );
  }
}
