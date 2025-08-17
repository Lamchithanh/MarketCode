import { NextResponse } from 'next/server';
import { productService } from '@/lib/services/product-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await productService.restoreProduct(params.id);
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in POST /api/admin/products/[id]/restore:', error);
    const message = error instanceof Error ? error.message : 'Failed to restore product';
    return NextResponse.json(
      { error: true, message },
      { status: 500 }
    );
  }
}
