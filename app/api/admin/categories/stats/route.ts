import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Get total categories count
    const { count: totalCategories, error: categoriesError } = await supabaseServiceRole
      .from('Category')
      .select('*', { count: 'exact', head: true })
      .is('deletedAt', null);

    if (categoriesError) {
      console.error('Error fetching categories count:', categoriesError);
      return NextResponse.json(
        { error: 'Failed to fetch categories statistics' },
        { status: 500 }
      );
    }

    // Get deleted categories count
    const { count: deletedCategories, error: deletedError } = await supabaseServiceRole
      .from('Category')
      .select('*', { count: 'exact', head: true })
      .not('deletedAt', 'is', null);

    // Get total products count across all categories
    const { count: productsCount, error: productsError } = await supabaseServiceRole
      .from('Product')
      .select('*', { count: 'exact', head: true })
      .is('deletedAt', null);

    return NextResponse.json({
      total: totalCategories || 0,
      active: totalCategories || 0, // All non-deleted categories are active
      deleted: deletedCategories || 0,
      productsCount: productsCount || 0
    });

  } catch (error) {
    console.error('Error in categories stats API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
