import { NextRequest, NextResponse } from 'next/server';
import { cleanupOrphanedImages, getStorageStats } from '@/lib/storage-server-utils';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'cleanup') {
      const result = await cleanupOrphanedImages();
      
      return NextResponse.json({
        success: true,
        deletedFiles: result.deletedFiles,
        errors: result.errors,
        message: `Cleanup completed. Deleted ${result.deletedFiles.length} files.`
      });
    }

    if (action === 'stats') {
      const stats = await getStorageStats();
      
      return NextResponse.json({
        success: true,
        stats
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "cleanup" or "stats".' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Storage management API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
