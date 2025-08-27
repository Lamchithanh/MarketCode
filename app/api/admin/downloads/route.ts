import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Fetch downloads với thông tin user và product
    const { data: downloads, error } = await supabaseServiceRole
      .from('Download')
      .select(`
        *,
        User!userId (
          id,
          name,
          email
        ),
        Product!productId (
          id,
          title,
          thumbnailUrl,
          githubUrl
        )
      `)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching downloads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch downloads' },
        { status: 500 }
      );
    }

    // Transform data với đầy đủ thông tin
    const transformedDownloads = downloads?.map(download => ({
      id: download.id?.toString() || '',
      userId: download.userId?.toString() || '',
      userName: download.User?.name || 'Unknown User',
      userEmail: download.User?.email || 'No Email',
      productId: download.productId?.toString() || '',
      productName: download.Product?.title || 'Unknown Product',
      productThumbnail: download.Product?.thumbnailUrl || '/placeholder-image.jpg',
      downloadDate: download.createdAt || new Date().toISOString(),
      ipAddress: download.ipAddress || '---',
      userAgent: download.userAgent || 'Unknown',
      githubUrl: download.Product?.githubUrl || '#'
    })) || [];

    return NextResponse.json({
      success: true,
      data: transformedDownloads
    });

  } catch (error) {
    console.error('Error in downloads API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { downloadId } = await request.json();

    if (!downloadId) {
      return NextResponse.json(
        { error: 'Download ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseServiceRole
      .from('Download')
      .delete()
      .eq('id', downloadId);

    if (error) {
      console.error('Error deleting download:', error);
      return NextResponse.json(
        { error: 'Failed to delete download' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Download deleted successfully'
    });

  } catch (error) {
    console.error('Error in downloads DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}