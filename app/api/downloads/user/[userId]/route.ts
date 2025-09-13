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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' }, 
        { status: 400 }
      );
    }

    // Get user's downloads with product info using function
    const { data, error } = await supabase
      .rpc('get_user_downloads', { user_id: userId });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch downloads' }, 
        { status: 500 }
      );
    }

    // Function returns JSONB array directly
    const downloads = data || [];

    // Transform the data to match interface expectations
    const transformedDownloads = downloads.map((download: {
      id: string;
      product_id: string;
      product_name: string;
      product_thumbnail: string;
      github_url?: string;
      download_date: string;
      ip_address: string;
    }) => ({
      id: download.id,
      productId: download.product_id,
      productName: download.product_name,
      productThumbnail: download.product_thumbnail,
      githubUrl: download.github_url || '',
      downloadDate: download.download_date,
      ipAddress: download.ip_address
    }));

    return NextResponse.json({ 
      success: true,
      data: transformedDownloads
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
