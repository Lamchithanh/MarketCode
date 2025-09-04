import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Service slug is required' },
        { status: 400 }
      );
    }

    // Get service by slug
    const { data: service, error } = await supabaseServiceRole
      .from('Service')
      .select(`
        id,
        name,
        slug,
        description,
        price_text,
        price_from,
        duration,
        category,
        service_type,
        features,
        icon_name,
        popular,
        is_active,
        meta_title,
        meta_description,
        display_order,
        created_at,
        updated_at
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error && error.code === 'PGRST116') {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    if (error) {
      console.error('Error fetching service:', error);
      return NextResponse.json(
        { error: 'Failed to fetch service' },
        { status: 500 }
      );
    }

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      service,
      message: 'Service fetched successfully'
    });

  } catch (error) {
    console.error('Service API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
