import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Get total tags count  
    const { count: totalTags, error: tagsError } = await supabaseServiceRole
      .from('Tag')
      .select('*', { count: 'exact', head: true })
      .is('deletedAt', null);

    if (tagsError) {
      console.error('Error fetching tags count:', tagsError);
      return NextResponse.json(
        { error: 'Failed to fetch tags statistics' },
        { status: 500 }
      );
    }

    // Tags don't have isActive field, so active = total (non-deleted)
    const activeTags = totalTags || 0;

    return NextResponse.json({
      success: true,
      data: {
        total: totalTags || 0,
        active: activeTags,
        inactive: 0 // Tags don't have inactive status, only deleted
      }
    });

  } catch (error) {
    console.error('Error in tags stats API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
