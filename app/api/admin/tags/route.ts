import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    let query = supabaseServiceRole
      .from('Tag')
      .select('*', { count: 'exact' })
      .is('deletedAt', null); // Only active tags

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data: tags, error, count } = await query
      .range(from, to)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching tags:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tags' },
        { status: 500 }
      );
    }

    // Get usage counts for all tags in one query
    const { data: tagUsages } = await supabaseServiceRole
      .from('ProductTag')
      .select('tagId');

    // Count usage per tag
    const usageCountMap = (tagUsages || []).reduce((acc, usage) => {
      acc[usage.tagId] = (acc[usage.tagId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Transform data
    const transformedTags = (tags || []).map(tag => ({
      id: tag.id?.toString() || '',
      name: tag.name || '',
      slug: tag.slug || '',
      color: tag.color || '#6B7280',
      usageCount: usageCountMap[tag.id] || 0,
      createdAt: tag.createdAt || new Date().toISOString(),
      updatedAt: tag.updatedAt || new Date().toISOString(),
      deletedAt: tag.deletedAt || null
    }));

    // Return paginated format
    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      tags: transformedTags,
      total: count || 0,
      page: page,
      limit: limit,
      totalPages: totalPages
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
