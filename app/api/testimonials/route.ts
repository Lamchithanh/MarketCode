import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '6';
    const featured = searchParams.get('featured') === 'true';

    let query = supabaseServiceRole
      .from('Testimonial')
      .select(`
        id,
        name,
        role,
        company,
        content,
        avatar,
        rating,
        is_featured,
        is_published,
        created_at,
        updated_at
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    // Filter by featured if requested
    if (featured) {
      query = query.eq('is_featured', true);
    }

    // Apply limit
    query = query.limit(parseInt(limit));

    const { data: testimonials, error } = await query;

    if (error) {
      console.error('Error fetching testimonials:', error);
      return NextResponse.json(
        { error: 'Failed to fetch testimonials' },
        { status: 500 }
      );
    }

    // Calculate statistics
    const { data: allTestimonials } = await supabaseServiceRole
      .from('Testimonial')
      .select('id, rating, is_published')
      .eq('is_published', true);

    const stats = {
      total: allTestimonials?.length || 0,
      average_rating: allTestimonials?.length 
        ? (allTestimonials.reduce((sum, t) => sum + t.rating, 0) / allTestimonials.length).toFixed(1)
        : 0,
      five_star_count: allTestimonials?.filter(t => t.rating === 5).length || 0,
    };

    return NextResponse.json({
      testimonials: testimonials || [],
      stats,
      message: 'Testimonials fetched successfully'
    });

  } catch (error) {
    console.error('Testimonials API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
