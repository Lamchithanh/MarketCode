import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Kiểm tra tất cả products để tìm URL placeholder
    const { data: products, error } = await supabaseServiceRole
      .from('Product')
      .select('id, title, thumbnailUrl')
      .or('thumbnailUrl.like.%via.placeholder.com%,thumbnailUrl.like.%placeholder.com%,thumbnailUrl.like.%placehold.it%');

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Clean up: Cập nhật tất cả URL placeholder thành null
    if (products && products.length > 0) {
      const { error: updateError } = await supabaseServiceRole
        .from('Product')
        .update({ thumbnailUrl: null })
        .or('thumbnailUrl.like.%via.placeholder.com%,thumbnailUrl.like.%placeholder.com%,thumbnailUrl.like.%placehold.it%');

      if (updateError) {
        console.error('Error updating products:', updateError);
        return NextResponse.json({
          success: false,
          error: 'Failed to update products',
          products: products
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Found and cleaned ${products?.length || 0} products with placeholder URLs`,
      products: products || []
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
