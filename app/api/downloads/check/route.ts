import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'Missing userId or productId' }, 
        { status: 400 }
      );
    }

    // Check how many times user has downloaded this product
    const { data, error, count } = await supabase
      .from('Download')
      .select('id, createdAt', { count: 'exact' })
      .eq('userId', userId)
      .eq('productId', productId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to check download status' }, 
        { status: 500 }
      );
    }

    const downloadCount = count || 0;
    const canDownload = downloadCount < 2; // Maximum 2 downloads
    const lastDownload = data && data.length > 0 ? data[0] : null;

    return NextResponse.json({ 
      downloaded: downloadCount > 0,
      downloadCount: downloadCount,
      canDownload: canDownload,
      maxDownloads: 2,
      downloadedAt: lastDownload?.createdAt || null,
      allDownloads: data || []
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
