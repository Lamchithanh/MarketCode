import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // TODO: Get userId from authentication and verify ownership
    const userId = '550e8400-e29b-41d4-a716-446655440001'; // Mock user ID

    // Delete cart item
    const { error } = await supabaseServiceRole
      .from('Cart')
      .delete()
      .eq('id', id)
      .eq('userId', userId); // Ensure user can only delete their own items

    if (error) {
      console.error('Error removing cart item:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to remove item from cart' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully'
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
