import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Get total orders count
    const { count: totalOrders, error: ordersError } = await supabaseServiceRole
      .from('Order')
      .select('*', { count: 'exact', head: true });

    if (ordersError) {
      console.error('Error fetching orders count:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch orders statistics' },
        { status: 500 }
      );
    }

    // Get completed orders count (status enum: PENDING, PROCESSING, COMPLETED, CANCELLED)
    const { count: completedOrders, error: completedOrdersError } = await supabaseServiceRole
      .from('Order')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'COMPLETED');

    // Get pending orders count
    const { count: pendingOrders, error: pendingOrdersError } = await supabaseServiceRole
      .from('Order')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING');

    // Get processing orders count
    const { count: processingOrders, error: processingOrdersError } = await supabaseServiceRole
      .from('Order')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PROCESSING');

    // Get cancelled orders count
    const { count: cancelledOrders, error: cancelledOrdersError } = await supabaseServiceRole
      .from('Order')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'CANCELLED');

    return NextResponse.json({
      success: true,
      data: {
        total: totalOrders || 0,
        completed: completedOrders || 0,
        pending: pendingOrders || 0,
        processing: processingOrders || 0,
        cancelled: cancelledOrders || 0
      }
    });

  } catch (error) {
    console.error('Error in orders stats API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
