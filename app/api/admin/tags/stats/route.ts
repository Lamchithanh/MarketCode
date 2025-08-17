import { NextResponse } from 'next/server';
import { tagService } from '@/lib/services/tag-service';

export async function GET() {
  try {
    const stats = await tagService.getTagStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in GET /api/admin/tags/stats:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to fetch tag statistics' },
      { status: 500 }
    );
  }
}
