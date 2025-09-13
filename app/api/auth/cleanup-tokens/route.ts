import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Verify this is called by system cron job (optional)
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
    
    if (process.env.CRON_SECRET && authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete expired password reset tokens
    const { data: deletedTokens, error } = await supabaseServiceRole
      .from('PasswordResetToken')
      .delete()
      .lt('expiresAt', new Date().toISOString())
      .select('count');

    if (error) {
      console.error('Error cleaning up expired tokens:', error);
      throw error;
    }

    // Clean up old security logs (keep last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { error: securityLogError } = await supabaseServiceRole
      .from('SecurityLog')
      .delete()
      .lt('createdAt', ninetyDaysAgo.toISOString());

    if (securityLogError) {
      console.error('Error cleaning up old security logs:', securityLogError);
    }

    console.log(`Cleanup completed: ${deletedTokens?.length || 0} expired tokens deleted`);

    return NextResponse.json({
      success: true,
      deletedTokens: deletedTokens?.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Allow GET for health check
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}