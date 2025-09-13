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
      slug,
      description, 
      price, 
      categoryId, 
      isActive,
      thumbnailUrl,
      fileUrl,
      demoUrl,
      githubUrl,
      technologies,
      fileSize,
      images,
      features,
      tagIds = [] 
    } = body;

    // Update the product - only include fields that exist in database
    const updateData: Partial<{
      title: string;
      slug: string;
      description: string;
      price: number;
      categoryId: string;
      isActive: boolean;
      thumbnailUrl: string;
      fileUrl: string;
      demoUrl: string;
      githubUrl: string;
      technologies: string[];
      fileSize: number;
      images: unknown;
      features: unknown;
    }> = {
      // Don't manually update updatedAt - let database handle it
    };

    // Only add fields if they are provided and properly formatted
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) {
      // Ensure price is a valid number for PostgreSQL numeric type
      const numPrice = parseFloat(price.toString());
      if (!isNaN(numPrice) && numPrice > 0) {
        updateData.price = numPrice;
      }
    }
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
    if (demoUrl !== undefined) updateData.demoUrl = demoUrl;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (technologies !== undefined) {
      // Ensure technologies is properly formatted as string array
      if (Array.isArray(technologies)) {
        updateData.technologies = technologies.map(tech => String(tech).trim()).filter(tech => tech);
      }
    }
    if (fileSize !== undefined) {
      const numFileSize = parseInt(fileSize.toString());
      if (!isNaN(numFileSize)) {
        updateData.fileSize = numFileSize;
      }
    }
    if (images !== undefined) {
      // Ensure images is valid JSON
      try {
        if (Array.isArray(images)) {
          updateData.images = images;
        } else {
          updateData.images = [];
        }
      } catch (e) {
        console.warn('Invalid images format:', e);
        updateData.images = [];
      }
    }
    if (features !== undefined) {
      // Ensure features is valid JSON
      try {
        if (Array.isArray(features)) {
          updateData.features = features;
        } else {
          updateData.features = [];
        }
      } catch (e) {
        console.warn('Invalid features format:', e);
        updateData.features = [];
      }
    }

    console.log('Updating product with data:', updateData);

    const { data: updatedProduct, error: updateError } = await supabaseServiceRole
      .from('Product')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating product:', updateError);
      console.error('Update data that caused error:', JSON.stringify(updateData, null, 2));
      console.error('Product ID:', id);
      return NextResponse.json(
        { error: 'Failed to update product', details: updateError.message },
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