import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;

    const { data: legalPage, error } = await supabaseServiceRole
      .from('LegalPage')
      .select('*')
      .eq('type', type)
      .single();

    if (error && error.code === 'PGRST116') {
      return NextResponse.json(
        { error: 'Legal page not found' },
        { status: 404 }
      );
    }

    if (error) {
      console.error('Error fetching legal page:', error);
      return NextResponse.json(
        { error: 'Failed to fetch legal page' },
        { status: 500 }
      );
    }

    return NextResponse.json({ page: legalPage });

  } catch (error) {
    console.error('Legal page API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
