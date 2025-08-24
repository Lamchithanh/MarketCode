import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

interface Tag {
  id: string;
  name: string;
}

interface ProductTag {
  Tag: Tag;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await params for Next.js 15
    const { id } = await params;
    
    const { data: product, error } = await supabaseServiceRole
      .from('Product')
      .select(`
        *,
        Category!inner(id, name),
        User!inner(id, name, email),
        ProductTag!left(
          Tag!inner(id, name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Transform the data to include tags properly
    const transformedProduct = {
      ...product,
      tags: product.ProductTag?.map((pt: ProductTag) => pt.Tag) || []
    };

    return NextResponse.json({
      success: true,
      data: transformedProduct
    });

  } catch (error) {
    console.error('Error in GET /api/admin/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await params for Next.js 15
    const { id } = await params;
    
    const body = await request.json();
    const { 
      title, 
      description, 
      price, 
      discountPrice, 
      categoryId, 
      isActive, 
      tagIds = [] 
    } = body;

    // Update the product
    const { data: updatedProduct, error: updateError } = await supabaseServiceRole
      .from('Product')
      .update({
        title,
        description,
        price,
        discountPrice,
        categoryId,
        isActive,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating product:', updateError);
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    // Handle tags - first delete existing tags
    if (tagIds && Array.isArray(tagIds)) {
      // Delete existing ProductTag relationships
      const { error: deleteTagsError } = await supabaseServiceRole
        .from('ProductTag')
        .delete()
        .eq('productId', id);

      if (deleteTagsError) {
        console.error('Error deleting existing tags:', deleteTagsError);
      }

      // Insert new ProductTag relationships
      if (tagIds.length > 0) {
        const productTags = tagIds.map((tagId: string) => ({
          productId: id,
          tagId
        }));

        const { error: insertTagsError } = await supabaseServiceRole
          .from('ProductTag')
          .insert(productTags);

        if (insertTagsError) {
          console.error('Error inserting new tags:', insertTagsError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Error in PUT /api/admin/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await params for Next.js 15
    const { id } = await params;

    // First delete associated ProductTag relationships
    const { error: deleteTagsError } = await supabaseServiceRole
      .from('ProductTag')
      .delete()
      .eq('productId', id);

    if (deleteTagsError) {
      console.error('Error deleting product tags:', deleteTagsError);
    }

    // Soft delete the product (set deletedAt)
    const { error } = await supabaseServiceRole
      .from('Product')
      .update({ deletedAt: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}