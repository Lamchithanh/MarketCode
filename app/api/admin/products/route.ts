import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/lib/services/product-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const isActive = searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const technologies = searchParams.get('technologies') ? searchParams.get('technologies')!.split(',') : undefined;
    const tagIds = searchParams.get('tagIds') ? searchParams.get('tagIds')!.split(',') : undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await productService.getProducts({
      search,
      categoryId,
      userId,
      isActive,
      minPrice,
      maxPrice,
      technologies,
      tagIds,
      page,
      limit
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/admin/products:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      categoryId,
      title,
      slug,
      description,
      price,
      thumbnailUrl,
      fileUrl,
      demoUrl,
      githubUrl,
      technologies,
      fileSize,
      isActive,
      tagIds
    } = body;

    if (!userId || !categoryId || !title || !price) {
      return NextResponse.json(
        { error: true, message: 'userId, categoryId, title, and price are required' },
        { status: 400 }
      );
    }

    const product = await productService.createProduct({
      userId,
      categoryId,
      title,
      slug,
      description,
      price,
      thumbnailUrl,
      fileUrl,
      demoUrl,
      githubUrl,
      technologies,
      fileSize,
      isActive,
      tagIds
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/products:', error);
    const message = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json(
      { error: true, message },
      { status: 500 }
    );
  }
}
