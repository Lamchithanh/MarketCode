import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: message, error } = await supabase
      .from('ContactMessage')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Message not found' },
          { status: 404 }
        );
      }
      
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isRead } = body;

    if (typeof isRead !== 'boolean') {
      return NextResponse.json(
        { error: 'isRead must be a boolean' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: message, error } = await supabase
      .from('ContactMessage')
      .update({ isRead })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Message not found' },
          { status: 404 }
        );
      }
      
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from('ContactMessage')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to delete message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
