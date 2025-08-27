import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const isActiveParam = searchParams.get('isActive');

    let query = supabaseServiceRole
      .from('User')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (role) {
      query = query.eq('role', role);
    }

    if (isActiveParam !== null) {
      const isActive = isActiveParam === 'true';
      query = query.eq('isActive', isActive);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data: users, error, count } = await query
      .range(from, to)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    // Transform data with all available fields
    const transformedUsers = users?.map(user => ({
      id: user.id?.toString() || '',
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'USER',
      avatar: user.avatar || null,
      isActive: user.isActive ?? true,
      lastLoginAt: user.lastLoginAt || null,
      emailVerified: user.emailVerified || null,
      deletedAt: user.deletedAt || null, // Include deletedAt field
      orderCount: 0, // We'll calculate this separately if needed
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString()
    }));

    // Return paginated format
    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      users: transformedUsers || [],
      total: count || 0,
      page: page,
      limit: limit,
      totalPages: totalPages
    });

  } catch (error) {
    console.error('Error in users API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
