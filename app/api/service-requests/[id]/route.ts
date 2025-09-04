import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data: serviceRequest, error } = await supabase
      .from('ServiceRequest')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching service request:', error);
      return NextResponse.json(
        { error: 'Service request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ request: serviceRequest });

  } catch (error) {
    console.error('Service request API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: {
      status?: string;
      assigned_to?: string;
      quoted_price?: number;
      quoted_duration?: string;
      quote_notes?: string;
      admin_notes?: string;
      client_feedback?: string;
      priority?: string;
    } = await request.json();

    // Build update object
    const updateData: Record<string, unknown> = {};
    
    if (body.status) updateData.status = body.status;
    if (body.assigned_to !== undefined) updateData.assigned_to = body.assigned_to;
    if (body.quoted_price) updateData.quoted_price = body.quoted_price;
    if (body.quoted_duration) updateData.quoted_duration = body.quoted_duration;
    if (body.quote_notes !== undefined) updateData.quote_notes = body.quote_notes;
    if (body.admin_notes !== undefined) updateData.admin_notes = body.admin_notes;
    if (body.client_feedback !== undefined) updateData.client_feedback = body.client_feedback;
    if (body.priority) updateData.priority = body.priority;

    // Add timestamps
    if (body.quoted_price || body.quoted_duration) {
      updateData.quoted_at = new Date().toISOString();
    }
    if (body.status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    updateData.updated_at = new Date().toISOString();

    const { data: serviceRequest, error } = await supabase
      .from('ServiceRequest')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service request:', error);
      return NextResponse.json(
        { error: 'Failed to update service request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      request: serviceRequest,
      message: 'Service request updated successfully'
    });

  } catch (error) {
    console.error('Service request update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('ServiceRequest')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting service request:', error);
      return NextResponse.json(
        { error: 'Failed to delete service request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Service request deleted successfully'
    });

  } catch (error) {
    console.error('Service request deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
