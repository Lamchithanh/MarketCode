import { NextRequest, NextResponse } from 'next/server';
import { tagService } from '@/lib/services/tag-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tag = await tagService.restoreTag(id);
    
    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error in POST /api/admin/tags/[id]/restore:', error);
    const message = error instanceof Error ? error.message : 'Failed to restore tag';
    return NextResponse.json(
      { error: true, message },
      { status: 500 }
    );
  }
}
