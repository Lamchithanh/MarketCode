import { NextResponse } from 'next/server';
import { categoryService } from '@/lib/services/category-service';

export async function GET() {
  try {
    const stats = await categoryService.getCategoryStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in GET /api/admin/categories/stats:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to fetch category statistics' },
      { status: 500 }
    );
  }
}
