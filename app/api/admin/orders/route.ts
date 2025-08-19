import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/lib/services/order-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      status: searchParams.get('status') || undefined,
      paymentStatus: searchParams.get('paymentStatus') || undefined,
      search: searchParams.get('search') || undefined,
      buyerId: searchParams.get('buyerId') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
    };

    const result = await orderService.getOrders(filters);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // Validate required fields
    if (!orderData.buyerId || !orderData.totalAmount || !orderData.paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: buyerId, totalAmount, paymentMethod' },
        { status: 400 }
      );
    }

    const order = await orderService.createOrder(orderData);
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
