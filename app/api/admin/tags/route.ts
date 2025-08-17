import { NextRequest, NextResponse } from 'next/server';
import { tagService } from '@/lib/services/tag-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await tagService.getTags({ search, page, limit });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/admin/tags:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, color } = body;

    if (!name) {
      return NextResponse.json(
        { error: true, message: 'Name is required' },
        { status: 400 }
      );
    }

    const tag = await tagService.createTag({ name, slug, color });
    
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/tags:', error);
    const message = error instanceof Error ? error.message : 'Failed to create tag';
    return NextResponse.json(
      { error: true, message },
      { status: 500 }
    );
  }
}
