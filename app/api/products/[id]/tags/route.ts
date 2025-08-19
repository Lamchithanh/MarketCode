import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch product tags
    const { data: productTags, error } = await supabaseServiceRole
      .from('ProductTag')
      .select(`
        Tag(
          id,
          name,
          slug,
          color
        )
      `)
      .eq('productId', id);

    if (error) {
      console.error('Error fetching product tags:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to fetch product tags' 
        },
        { status: 500 }
      );
    }

    // Transform the data to extract tag information
    const tags = productTags?.map(pt => pt.Tag).filter(Boolean) || [];

    return NextResponse.json({
      success: true,
      tags
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
