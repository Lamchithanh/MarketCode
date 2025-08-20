import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

interface BuyNowRequest {
  productId: string;
  userId: string;
  paymentMethod: 'bank_transfer' | 'paypal' | 'stripe' | 'momo' | 'zalopay';
  couponCode?: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BuyNowRequest = await request.json();
    
    // Validate required fields
    if (!body.productId || !body.userId || !body.paymentMethod) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          details: 'productId, userId, and paymentMethod are required' 
        },
        { status: 400 }
      );
    }

    // 1. Verify product exists and is active
    const { data: product, error: productError } = await supabaseServiceRole
      .from('Product')
      .select('id, title, price, isActive, userId')
      .eq('id', body.productId)
      .eq('isActive', true)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      );
    }

    // 2. Verify user exists
    const { data: user, error: userError } = await supabaseServiceRole
      .from('User')
      .select('id, name, email, isActive')
      .eq('id', body.userId)
      .eq('isActive', true)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 404 }
      );
    }

    // 3. Check if user is trying to buy their own product
    if (product.userId === body.userId) {
      return NextResponse.json(
        { error: 'Cannot buy your own product' },
        { status: 400 }
      );
    }

    const totalAmount = parseFloat(product.price);
    let discountAmount = 0;
    let couponData = null;

    // 4. Process coupon if provided
    if (body.couponCode) {
      const { data: coupon, error: couponError } = await supabaseServiceRole
        .from('Coupon')
        .select('*')
        .eq('code', body.couponCode)
        .eq('isActive', true)
        .lte('validFrom', new Date().toISOString())
        .gte('validUntil', new Date().toISOString())
        .single();

      if (coupon && !couponError) {
        // Check usage limit
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
          return NextResponse.json(
            { error: 'Coupon usage limit exceeded' },
            { status: 400 }
          );
        }

        // Check minimum amount
        if (coupon.minAmount && totalAmount < parseFloat(coupon.minAmount)) {
          return NextResponse.json(
            { 
              error: 'Order amount does not meet coupon minimum requirement',
              minAmount: coupon.minAmount
            },
            { status: 400 }
          );
        }

        // Calculate discount
        if (coupon.type === 'percentage') {
          discountAmount = totalAmount * (parseFloat(coupon.value) / 100);
          if (coupon.maxAmount) {
            discountAmount = Math.min(discountAmount, parseFloat(coupon.maxAmount));
          }
        } else if (coupon.type === 'fixed') {
          discountAmount = parseFloat(coupon.value);
        }

        discountAmount = Math.min(discountAmount, totalAmount); // Cannot discount more than total
        couponData = coupon;
      }
    }

    const finalAmount = totalAmount - discountAmount;

    // 5. Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

    // 6. Create order in transaction
    const { data: order, error: orderError } = await supabaseServiceRole
      .from('Order')
      .insert({
        orderNumber,
        buyerId: body.userId,
        totalAmount: finalAmount,
        discountAmount,
        taxAmount: 0, // Can be calculated if needed
        status: 'PENDING',
        paymentMethod: body.paymentMethod,
        paymentStatus: 'PENDING',
        notes: body.notes || `Direct purchase of ${product.title}`,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order', details: orderError.message },
        { status: 500 }
      );
    }

    // 7. Create order item
    const { error: orderItemError } = await supabaseServiceRole
      .from('OrderItem')
      .insert({
        orderId: order.id,
        productId: product.id,
        productTitle: product.title,
        productPrice: parseFloat(product.price),
        snapshotUrl: null, // Can be set if needed
      });

    if (orderItemError) {
      // Rollback: delete the order
      await supabaseServiceRole.from('Order').delete().eq('id', order.id);
      console.error('Order item creation error:', orderItemError);
      return NextResponse.json(
        { error: 'Failed to create order item', details: orderItemError.message },
        { status: 500 }
      );
    }

    // 8. Update coupon usage count if coupon was used
    if (couponData) {
      await supabaseServiceRole
        .from('Coupon')
        .update({ 
          usageCount: couponData.usageCount + 1,
          updatedAt: new Date().toISOString()
        })
        .eq('id', couponData.id);
    }

    // 9. Remove product from user's cart if it exists
    await supabaseServiceRole
      .from('Cart')
      .delete()
      .eq('userId', body.userId)
      .eq('productId', body.productId);

    // 10. Prepare response data
    const response = {
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: finalAmount,
        originalAmount: totalAmount,
        discountAmount,
        paymentMethod: body.paymentMethod,
        paymentStatus: 'PENDING',
        status: 'PENDING',
        createdAt: order.createdAt,
      },
      product: {
        id: product.id,
        title: product.title,
        price: parseFloat(product.price),
      },
      buyer: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      coupon: couponData ? {
        code: couponData.code,
        name: couponData.name,
        type: couponData.type,
        value: parseFloat(couponData.value),
        discountApplied: discountAmount,
      } : null,
      nextSteps: {
        message: 'Order created successfully. Proceed to payment.',
        paymentUrl: `/checkout/${order.id}`, // URL for payment processing
        redirectUrl: `/orders/${order.id}`, // URL to view order details
      }
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Buy now error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// GET method to check if a product can be bought directly
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const userId = searchParams.get('userId');

    if (!productId || !userId) {
      return NextResponse.json(
        { error: 'Missing productId or userId parameters' },
        { status: 400 }
      );
    }

    // Check product availability
    const { data: product, error: productError } = await supabaseServiceRole
      .from('Product')
      .select('id, title, price, isActive, userId')
      .eq('id', productId)
      .eq('isActive', true)
      .single();

    if (productError || !product) {
      return NextResponse.json({
        canBuy: false,
        reason: 'Product not found or inactive'
      });
    }

    // Check if user is trying to buy their own product
    if (product.userId === userId) {
      return NextResponse.json({
        canBuy: false,
        reason: 'Cannot buy your own product'
      });
    }

    // Check user status
    const { data: user, error: userError } = await supabaseServiceRole
      .from('User')
      .select('id, isActive')
      .eq('id', userId)
      .eq('isActive', true)
      .single();

    if (userError || !user) {
      return NextResponse.json({
        canBuy: false,
        reason: 'User not found or inactive'
      });
    }

    return NextResponse.json({
      canBuy: true,
      product: {
        id: product.id,
        title: product.title,
        price: parseFloat(product.price),
      },
      availablePaymentMethods: [
        'bank_transfer',
        'paypal',
        'stripe',
        'momo',
        'zalopay'
      ]
    });

  } catch (error) {
    console.error('Buy now check error:', error);
    return NextResponse.json(
      { error: 'Failed to check buy now availability' },
      { status: 500 }
    );
  }
}
