import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // First try to get downloads without complex relationships
    const { data: downloads, error } = await supabaseServiceRole
      .from('Download')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching downloads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch downloads' },
        { status: 500 }
      );
    }

    // Transform data 
    const transformedDownloads = downloads?.map(download => ({
      id: download.id?.toString() || '',
      userId: download.userId?.toString() || '',
      productId: download.productId?.toString() || '',
      downloadUrl: download.downloadUrl || '',
      createdAt: download.createdAt || new Date().toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: transformedDownloads || []
    });

  } catch (error) {
    console.error('Error in downloads API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}