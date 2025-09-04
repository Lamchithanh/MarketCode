import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status'); // 'read', 'unread', or null for all

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Build query
    let query = supabase
      .from('ContactMessage')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`);
    }

    // Apply status filter
    if (status === 'read') {
      query = query.eq('isRead', true);
    } else if (status === 'unread') {
      query = query.eq('isRead', false);
    }

    // Apply pagination and ordering
    const offset = (page - 1) * limit;
    query = query
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: messages, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    // Get statistics
    const { data: stats } = await supabase
      .from('ContactMessage')
      .select('isRead');

    const totalMessages = count || 0;
    const unreadMessages = stats?.filter((s: { isRead: boolean }) => !s.isRead).length || 0;
    const readMessages = stats?.filter((s: { isRead: boolean }) => s.isRead).length || 0;

    // Get this week's messages count
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { count: thisWeekCount } = await supabase
      .from('ContactMessage')
      .select('*', { count: 'exact', head: true })
      .gte('createdAt', oneWeekAgo.toISOString());

    return NextResponse.json({
      messages: messages || [],
      pagination: {
        page,
        limit,
        total: totalMessages,
        totalPages: Math.ceil(totalMessages / limit)
      },
      statistics: {
        total: totalMessages,
        unread: unreadMessages,
        read: readMessages,
        thisWeek: thisWeekCount || 0
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('ContactMessage')
      .insert({
        name,
        email,
        subject,
        message
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: data }, { status: 201 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
