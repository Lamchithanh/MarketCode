import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';
import { userService } from '@/lib/services/user-service';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    let result;
    let message;

    switch (action) {
      case 'toggle_status':
        result = await userService.toggleUserStatus(id);
        message = `User ${result.isActive ? 'activated' : 'deactivated'} successfully`;
        break;

      case 'verify_email':
        result = await userService.verifyEmail(id);
        message = 'User email verified successfully';
        break;

      case 'restore':
        result = await userService.restoreUser(id);
        message = 'User restored successfully';
        break;

      case 'update_last_login':
        await userService.updateLastLogin(id);
        message = 'Last login updated successfully';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message,
      user: result || { id }
    });
  } catch (error) {
    console.error('Error performing user action:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to perform user action' },
      { status: 500 }
    );
  }
}
