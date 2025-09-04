import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data: services, error } = await supabaseServiceRole
      .from('Service')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json(
        { error: 'Failed to fetch services' },
        { status: 500 }
      );
    }

    // Calculate statistics
    const statistics = {
      total: services?.length || 0,
      active: services?.filter(s => s.is_active).length || 0,
      inactive: services?.filter(s => !s.is_active).length || 0,
      popular: services?.filter(s => s.popular).length || 0,
      categories: services?.length || 0 ? [...new Set(services?.map(s => s.category))].length : 0
    };

    return NextResponse.json({
      services: services || [],
      statistics,
      pagination: {
        page: 1,
        limit: 50,
        total: services?.length || 0,
        totalPages: Math.ceil((services?.length || 0) / 50)
      }
    });

  } catch (error) {
    console.error('Services API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      slug,
      description,
      category,
      price_from,
      duration,
      features = [],
      icon_name,
      popular = false,
      is_active = true,
      display_order = 0
    } = body;

    // Validate required fields
    if (!name || !slug || !description || !category || !price_from) {
      console.log('Missing fields:', { name, slug, description, category, price_from });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert service
    const { data: service, error } = await supabaseServiceRole
      .from('Service')
      .insert({
        name,
        slug,
        description,
        category,
        price_from,
        duration,
        features,
        icon_name,
        popular,
        is_active,
        display_order
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      return NextResponse.json(
        { error: 'Failed to create service' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      service,
      message: 'Service created successfully'
    });

  } catch (error) {
    console.error('Service creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
