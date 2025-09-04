import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const service_type = searchParams.get('service_type') || '';
    const priority = searchParams.get('priority') || '';

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('ServiceRequest')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (service_type) {
      query = query.eq('service_type', service_type);
    }

    if (priority) {
      query = query.eq('priority', priority);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: requests, error, count } = await query;

    if (error) {
      console.error('Error fetching service requests:', error);
      return NextResponse.json(
        { error: 'Failed to fetch service requests' },
        { status: 500 }
      );
    }

    // Get statistics
    const { data: allRequests } = await supabase
      .from('ServiceRequest')
      .select('status, quoted_price, created_at');

    const statistics = {
      total: count || 0,
      pending: allRequests?.filter(r => r.status === 'pending').length || 0,
      reviewing: allRequests?.filter(r => r.status === 'reviewing').length || 0,
      quoted: allRequests?.filter(r => r.status === 'quoted').length || 0,
      approved: allRequests?.filter(r => r.status === 'approved').length || 0,
      in_progress: allRequests?.filter(r => r.status === 'in_progress').length || 0,
      completed: allRequests?.filter(r => r.status === 'completed').length || 0,
      cancelled: allRequests?.filter(r => r.status === 'cancelled').length || 0,
      this_week: allRequests?.filter(r => {
        const requestDate = new Date(r.created_at);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return requestDate >= oneWeekAgo;
      }).length || 0,
      total_revenue: allRequests?.reduce((sum, r) => {
        return r.status === 'completed' && r.quoted_price ? sum + Number(r.quoted_price) : sum;
      }, 0) || 0
    };

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      requests: requests || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages
      },
      statistics
    });

  } catch (error) {
    console.error('Service requests API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: {
      user_id?: string;
      name: string;
      email: string;
      phone?: string;
      company?: string;
      service_type: string;
      service_name: string;
      title: string;
      description: string;
      budget_range?: string;
      timeline?: string;
      priority?: string;
      requirements?: Record<string, unknown>;
      technical_specs?: Record<string, unknown>;
    } = await req.json();
    
    const {
      user_id,
      name,
      email,
      phone,
      company,
      service_type,
      service_name,
      title,
      description,
      budget_range,
      timeline,
      priority = 'medium',
      requirements = {},
      technical_specs = {}
    } = body;

    // Get service info if service_type is provided
    let finalServiceName = service_name;
    if (service_type && !service_name) {
      const { data: service } = await supabase
        .from('Service')
        .select('name')
        .eq('service_type', service_type)
        .single();
      
      if (service) {
        finalServiceName = service.name;
      }
    }

    // Validate required fields
    if (!name || !email || !service_type || !service_name || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert service request
    const { data: serviceRequest, error } = await supabase
      .from('ServiceRequest')
      .insert({
        user_id,
        name,
        email,
        phone,
        company,
        service_type,
        service_name,
        title,
        description,
        budget_range,
        timeline,
        priority,
        requirements,
        technical_specs,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating service request:', error);
      return NextResponse.json(
        { error: 'Failed to create service request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      request: serviceRequest,
      message: 'Service request created successfully'
    });

  } catch (error) {
    console.error('Service request creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
