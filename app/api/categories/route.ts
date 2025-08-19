import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Lấy categories từ database
    const { data: categories, error } = await supabaseServiceRole
      .from('Category')
      .select('id, name, description')
      .is('deletedAt', null)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    // Transform data
    const transformedCategories = [
      { id: 'all', name: 'Tất cả' },
      ...(categories?.map(cat => ({
        id: cat.id.toString(),
        name: cat.name
      })) || [])
    ];

    return NextResponse.json({
      success: true,
      categories: transformedCategories
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
