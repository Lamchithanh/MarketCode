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
      price_text,
      service_type,
      duration,
      features = [],
      icon_name,
      popular = false,
      is_active = true,
      display_order = 0
    } = body;

    // Validate required fields based on database schema
    if (!name || !slug || !description || !category || !price_text || !service_type || !duration) {
      console.log('Missing required fields:', { 
        name: !!name, 
        slug: !!slug, 
        description: !!description, 
        category: !!category, 
        price_text: !!price_text,
        service_type: !!service_type,
        duration: !!duration
      });
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, description, category, price_text, service_type, duration' },
        { status: 400 }
      );
    }

    // Auto-generate display_order if not provided
    let finalDisplayOrder = display_order;
    if (!display_order || display_order === 0) {
      const { count } = await supabaseServiceRole
        .from('Service')
        .select('*', { count: 'exact', head: true });
      
      finalDisplayOrder = (count || 0) + 1;
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
        price_text,
        service_type,
        duration,
        features,
        icon_name,
        popular,
        is_active,
        display_order: finalDisplayOrder
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
