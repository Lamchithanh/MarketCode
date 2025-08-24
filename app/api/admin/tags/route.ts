import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '1000');

    const { data: tags, error } = await supabaseServiceRole
      .from('Tag')
      .select(`
        *,
        ProductTag!inner(Product!inner(id))
      `)
      .order('name')
      .limit(limit);

    if (error) {
      console.error('Error fetching tags:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tags' },
        { status: 500 }
      );
    }

    // Transform data to include usage count
    const transformedTags = tags?.map(tag => ({
      id: tag.id?.toString() || '',
      name: tag.name || '',
      description: tag.description || '',
      isActive: tag.isActive ?? true,
      usageCount: tag.ProductTag?.length || 0,
      createdAt: tag.createdAt || new Date().toISOString(),
      updatedAt: tag.updatedAt || new Date().toISOString()
    })) || [];

    return NextResponse.json({
      success: true,
      tags: transformedTags
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    // Check if tag already exists
    const { data: existingTag } = await supabaseServiceRole
      .from('Tag')
      .select('id')
      .eq('name', name)
      .single();

    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag already exists' },
        { status: 400 }
      );
    }

    // Create new tag
    const { data: tag, error } = await supabaseServiceRole
      .from('Tag')
      .insert({
        name,
        description: description || '',
        isActive: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating tag:', error);
      return NextResponse.json(
        { error: 'Failed to create tag' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tag
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
