import { NextResponse } from 'next/server';
import { productService } from '@/lib/services/product-service';

export async function GET() {
  try {
    const stats = await productService.getProductStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in GET /api/admin/products/stats:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to fetch product statistics' },
      { status: 500 }
    );
  }
}
