import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin client với service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET() {
  try {
    // Sử dụng RPC để join data
    const { data, error } = await supabaseAdmin.rpc('get_admin_downloads');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch downloads' }, { status: 500 });
    }

    // Transform data cho frontend
    const downloads = data?.map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      userName: item.user_name || 'Unknown',
      userEmail: item.user_email || 'Unknown',
      productId: item.product_id,
      productName: item.product_name || 'Unknown Product',
      productThumbnail: item.product_thumbnail || '/api/placeholder/40/40',
      downloadDate: item.created_at,
      ipAddress: item.ip_address || 'Unknown',
      userAgent: item.user_agent || 'Unknown',
      githubUrl: item.github_url || '#'
    })) || [];

    return NextResponse.json({ 
      data: downloads,
      total: downloads.length 
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { downloadId } = await request.json();

    if (!downloadId) {
      return NextResponse.json({ error: 'Download ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('Download')
      .delete()
      .eq('id', downloadId);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: 'Failed to delete download' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
