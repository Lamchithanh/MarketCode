import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Partial<{
      slug: string;
      name: string;
      description: string;
      price_text: string;
      price_from: number;
      duration: string;
      category: string;
      service_type: string;
      features: string[];
      icon_name: string;
      popular: boolean;
      is_active: boolean;
      display_order: number;
    }> = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    // If display_order is being updated, handle order swapping
    if (body.display_order) {
      // Get current service data
      const { data: currentService } = await supabaseServiceRole
        .from('Service')
        .select('display_order')
        .eq('id', id)
        .single();

      if (currentService && currentService.display_order !== body.display_order) {
        // Find service with the target display_order
        const { data: targetService } = await supabaseServiceRole
          .from('Service')
          .select('id, display_order')
          .eq('display_order', body.display_order)
          .neq('id', id)
          .single();

        // If target order exists, swap them
        if (targetService) {
          // Update target service to current service's order
          await supabaseServiceRole
            .from('Service')
            .update({ display_order: currentService.display_order })
            .eq('id', targetService.id);
        }
      }
    }

    // Update service
    const { data: service, error } = await supabaseServiceRole
      .from('Service')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service:', error);
      return NextResponse.json(
        { error: 'Failed to update service' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      service,
      message: 'Service updated successfully'
    });

  } catch (error) {
    console.error('Service update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH method - alias for PUT to maintain consistency with other API routes
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(request, { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Check if service has any service requests
    const { data: requests } = await supabaseServiceRole
      .from('ServiceRequest')
      .select('id')
      .eq('service_id', id)
      .limit(1);

    if (requests && requests.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete service with existing requests. Deactivate instead.' },
        { status: 400 }
      );
    }

    // Delete service
    const { error } = await supabaseServiceRole
      .from('Service')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting service:', error);
      return NextResponse.json(
        { error: 'Failed to delete service' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Service deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
