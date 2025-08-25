import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const paymentMethod = searchParams.get('paymentMethod');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    let query = supabase
      .from('Order')
      .select(`
        *
      `);
    
    // Apply filters - only search by order number
    if (search && search.trim()) {
      query = query.ilike('orderNumber', `%${search}%`);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (paymentStatus) {
      query = query.eq('paymentStatus', paymentStatus);
    }

    if (paymentMethod) {
      query = query.eq('paymentMethod', paymentMethod);
    }
    
    // Get total count first
    let countQuery = supabase
      .from('Order')
      .select('*', { count: 'exact', head: true });
    
    if (search && search.trim()) {
      countQuery = countQuery.ilike('orderNumber', `%${search}%`);
    }
    if (status) {
      countQuery = countQuery.eq('status', status);
    }
    if (paymentStatus) {
      countQuery = countQuery.eq('paymentStatus', paymentStatus);
    }
    if (paymentMethod) {
      countQuery = countQuery.eq('paymentMethod', paymentMethod);
    }
    
    const { count } = await countQuery;
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data: orders, error } = await query
      .range(from, to)
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Orders fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders', details: error.message },
        { status: 500 }
      );
    }
    
    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      orders: orders || [],
      total: count || 0,
      page,
      limit,
      totalPages
    });
    
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: order, error } = await supabase
      .from('Order')
      .insert(body)
      .select()
      .single();
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to create order', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(order);
    
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: order, error } = await supabase
      .from('Order')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to update order', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(order);
    
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { error } = await supabase
      .from('Order')
      .delete()
      .eq('id', id);
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete order', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
