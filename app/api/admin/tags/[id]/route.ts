import { NextRequest, NextResponse } from 'next/server';
import { tagService } from '@/lib/services/tag-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tag = await tagService.getTagById(params.id);
    
    if (!tag) {
      return NextResponse.json(
        { error: true, message: 'Tag not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error in GET /api/admin/tags/[id]:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to fetch tag' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, slug, color } = body;

    if (!name) {
      return NextResponse.json(
        { error: true, message: 'Name is required' },
        { status: 400 }
      );
    }

    const tag = await tagService.updateTag(params.id, { name, slug, color });
    
    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error in PUT /api/admin/tags/[id]:', error);
    const message = error instanceof Error ? error.message : 'Failed to update tag';
    return NextResponse.json(
      { error: true, message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await tagService.deleteTag(params.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/tags/[id]:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete tag';
    return NextResponse.json(
      { error: true, message },
      { status: 500 }
    );
  }
}
