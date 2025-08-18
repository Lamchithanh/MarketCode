import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/lib/services/product-service';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const product = await productService.getProductById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: true, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in GET /api/admin/products/[id]:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    
    // Log incoming data for debugging
    console.log('PUT /api/admin/products/[id] - Received body:', JSON.stringify(body, null, 2));
    
    const {
      categoryId,
      title,
      slug,
      description,
      price,
      thumbnailUrl,
      images,
      fileUrl,
      demoUrl,
      githubUrl,
      technologies,
      fileSize,
      isActive,
      tags: tagIds
    } = body;

    if (!title || !price) {
      return NextResponse.json(
        { error: true, message: 'Title and price are required' },
        { status: 400 }
      );
    }

    const product = await productService.updateProduct(params.id, {
      categoryId,
      title,
      slug,
      description,
      price,
      thumbnailUrl,
      images,
      fileUrl,
      demoUrl,
      githubUrl,
      technologies,
      fileSize,
      isActive,
      tagIds
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in PUT /api/admin/products/[id]:', error);
    const message = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json(
      { error: true, message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    await productService.deleteProduct(params.id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/products/[id]:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete product';
    return NextResponse.json(
      { error: true, message },
      { status: 500 }
    );
  }
}
