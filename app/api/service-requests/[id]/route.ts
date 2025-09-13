import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: serviceRequest, error } = await supabaseServiceRole
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

// Note: PATCH and DELETE removed - service requests are customer submissions, not editable
// Quote functionality moved to separate endpoint: /api/service-requests/[id]/quote
