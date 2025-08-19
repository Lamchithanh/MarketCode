import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // TODO: Get userId from authentication
    // For now, using a mock userId - in real app, get from session/JWT
    const userId = '550e8400-e29b-41d4-a716-446655440001'; // Mock user ID

    // Fetch cart items with product details
    const { data: cartItems, error } = await supabaseServiceRole
      .from('Cart')
      .select(`
        id,
        createdAt,
        Product(
          id,
          title,
          price,
          description,
          thumbnailUrl,
          technologies,
          Category(name),
          features
        )
      `)
      .eq('userId', userId);

    if (error) {
      console.error('Error fetching cart items:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to fetch cart items' 
        },
        { status: 500 }
      );
    }

    // Transform data to match cart interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedItems = (cartItems || []).map((item: any) => ({
      id: item.Product.id,
      title: item.Product.title,
      price: parseFloat(item.Product.price) || 0,
      image: item.Product.thumbnailUrl || '/Images/images.png',
      technologies: item.Product.technologies || [],
      category: item.Product.Category?.name || 'Khác',
      description: item.Product.description || '',
      rating: 4.5, // TODO: Calculate from reviews
      features: Array.isArray(item.Product.features) 
        ? item.Product.features.filter((f: unknown) => typeof f === 'string') 
        : [],
      cartId: item.id,
      addedAt: item.createdAt
    }));

    return NextResponse.json({
      success: true,
      items: transformedItems
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

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Product ID is required' 
        },
        { status: 400 }
      );
    }

    // TODO: Get userId from authentication
    const userId = '550e8400-e29b-41d4-a716-446655440001'; // Mock user ID

    // Check if item already exists in cart
    const { data: existingItem } = await supabaseServiceRole
      .from('Cart')
      .select('id')
      .eq('userId', userId)
      .eq('productId', productId)
      .single();

    if (existingItem) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Item already in cart' 
        },
        { status: 400 }
      );
    }

    // Add item to cart
    const { error } = await supabaseServiceRole
      .from('Cart')
      .insert({
        userId,
        productId
      });

    if (error) {
      console.error('Error adding to cart:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to add item to cart' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to cart successfully'
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
